// Lightweight client-side mock for json-server style endpoints
// Intercepts fetch calls to http://localhost:3000/{resource} and serves data from localStorage,
// seeded from /events.json on first load. Works on Vercel (no backend needed).

export function installMockApi(opts = {}) {
  const seedUrl = opts.seedUrl || "/events.json";
  const STORAGE_KEY = opts.storageKey || "eventapp:data:v1";
  const originalFetch = window.fetch.bind(window);

  // Utility: parse URL or Request to URL string
  function toUrl(input) {
    if (typeof input === "string") return input;
    if (input && typeof input.url === "string") return input.url;
    try { return String(input); } catch { return ""; }
  }

  // Load DB from localStorage or seed
  async function loadDb() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try { return JSON.parse(cached); } catch {}
    }
    // Seed: fetch /events.json (if available), else empty arrays
    let events = [];
    try {
      const res = await originalFetch(seedUrl);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          events = data;
        } else if (Array.isArray(data.events)) {
          events = data.events;
        } else {
          // try array-like fallback
          events = data;
        }
      }
    } catch {}
    const db = { events, users: [], categories: [] };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  }

  function saveDb(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  function json(data, status = 200) {
    return new Response(JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" }
    });
  }

  function notFound() { return json({ error: "Not found" }, 404); }
  function badReq(msg = "Bad Request") { return json({ error: msg }, 400); }

  function isLocalhostApi(u) {
    try {
      const url = new URL(u, window.location.origin);
      // Match absolute http://localhost:3000/* or 127.0.0.1:3000
      const hostMatch = (url.host === "localhost:3000" || url.host === "127.0.0.1:3000");
      return hostMatch;
    } catch {
      return false;
    }
  }

  // Parse path like /events/123
  function parsePath(u) {
    const url = new URL(u);
    const segments = url.pathname.split("/").filter(Boolean);
    const resource = segments[0] || "";
    const id = segments[1] ? Number(segments[1]) : null;
    return { resource, id, url };
  }

  async function handleRequest(input, init = {}) {
    const urlStr = toUrl(input);
    if (!isLocalhostApi(urlStr)) {
      // pass-through for non-mocked requests
      return originalFetch(input, init);
    }

    const method = (init?.method || (typeof input !== "string" && input?.method) || "GET").toUpperCase();
    const { resource, id } = parsePath(urlStr);
    let db = await loadDb();

    // Ensure resource array exists
    if (!["events", "users", "categories"].includes(resource)) {
      return notFound();
    }
    if (!Array.isArray(db[resource])) db[resource] = [];

    if (method === "GET") {
      if (id == null) {
        return json(db[resource]);
      }
      const item = db[resource].find(x => Number(x.id) === id);
      return item ? json(item) : notFound();
    }

    if (method === "POST") {
      let body = {};
      try { body = init?.body ? JSON.parse(init.body) : {}; } catch { return badReq("Invalid JSON"); }
      // naive id generation
      const nextId = db[resource].length ? Math.max(...db[resource].map(x => Number(x.id)||0)) + 1 : 1;
      const newItem = { id: nextId, ...body };
      db[resource].push(newItem);
      saveDb(db);
      return json(newItem, 201);
    }

    if (method === "PATCH" || method === "PUT") {
      if (id == null) return badReq("Missing id");
      let body = {};
      try { body = init?.body ? JSON.parse(init.body) : {}; } catch { return badReq("Invalid JSON"); }
      const idx = db[resource].findIndex(x => Number(x.id) === id);
      if (idx === -1) return notFound();
      db[resource][idx] = { ...db[resource][idx], ...body };
      saveDb(db);
      return json(db[resource][idx]);
    }

    if (method === "DELETE") {
      if (id == null) return badReq("Missing id");
      const before = db[resource].length;
      db[resource] = db[resource].filter(x => Number(x.id) != id);
      const removed = db[resource].length < before;
      saveDb(db);
      return removed ? json({ deleted: true }) : notFound();
    }

    // Fallback
    return badReq("Unsupported method");
  }

  // Patch global fetch
  window.fetch = (input, init) => handleRequest(input, init);
}