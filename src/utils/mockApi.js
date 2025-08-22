/**
 * Lightweight client-side mock API to replace json-server calls on Vercel.
 * It intercepts fetch() requests to http://localhost:3000/* as well as
 * /events, /users, /categories and serves/updates data from localStorage.
 * Initial data is loaded from /events.json in the public folder.
 */
export function installMockApi() {
  const BASE = "http://localhost:3000";
  const STORE_KEY = "eventapp:data:v1";

  // Keep a reference to the real fetch
  if (!window._realFetch) {
    window._realFetch = window.fetch.bind(window);
  }

  async function loadInitial() {
    const stored = localStorage.getItem(STORE_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch {}
    }
    // Load initial snapshot from public/events.json
    const res = await window._realFetch(`${import.meta.env.BASE_URL}events.json`);
    if (!res.ok) throw new Error("Kon events.json niet laden");
    const data = await res.json();
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    return data;
  }

  let cache = null;
  let loadPromise = loadInitial().then(d => (cache = d));

  function persist() {
    localStorage.setItem(STORE_KEY, JSON.stringify(cache));
  }

  function jsonResponse(body, status = 200) {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  window.fetch = async function(input, init = {}) {
    const url = typeof input === "string" ? input : input.url;
    const method = (init.method || "GET").toUpperCase();

    const isApiUrl =
      url.startsWith(BASE + "/") ||
      url.startsWith("/events") ||
      url.startsWith("/users") ||
      url.startsWith("/categories");

    if (!isApiUrl) {
      // Any other URL: use the real fetch (assets, images, etc)
      return window._realFetch(input, init);
    }

    if (!cache) await loadPromise;

    // Normalize path
    const path = url.startsWith(BASE) ? url.slice(BASE.length) : url;

    // Helper to parse request body JSON safely
    async function parseBody() {
      const body = init.body;
      if (!body) return {};
      if (typeof body === "string") return JSON.parse(body);
      if (body instanceof Blob) return JSON.parse(await body.text());
      try { return JSON.parse(body); } catch { return {}; }
    }

    // ROUTES
    if (path.startsWith("/events")) {
      const parts = path.split("/").filter(Boolean); // e.g. ['events','123']
      if (method === "GET") {
        if (parts.length === 1) return jsonResponse(cache.events);
        const id = parts[1];
        const item = cache.events.find(e => String(e.id) === String(id));
        return item ? jsonResponse(item) : jsonResponse({ message: "Not Found" }, 404);
      }
      if (method === "POST") {
        const newItem = await parseBody();
        cache.events.push(newItem);
        persist();
        return jsonResponse(newItem, 201);
      }
      if (method === "PATCH") {
        const id = path.split("/")[2];
        const patch = await parseBody();
        const idx = cache.events.findIndex(e => String(e.id) === String(id));
        if (idx === -1) return jsonResponse({ message: "Not Found" }, 404);
        cache.events[idx] = { ...cache.events[idx], ...patch };
        persist();
        return jsonResponse(cache.events[idx]);
      }
      if (method === "DELETE") {
        const id = path.split("/")[2];
        const idx = cache.events.findIndex(e => String(e.id) === String(id));
        if (idx === -1) return jsonResponse({ message: "Not Found" }, 404);
        const [removed] = cache.events.splice(idx, 1);
        persist();
        return jsonResponse(removed);
      }
    }

    if (path.startsWith("/users")) {
      const parts = path.split("/").filter(Boolean);
      if (method === "GET") return jsonResponse(cache.users);
      if (method === "POST") {
        const newUser = await parseBody();
        if (!newUser.id) newUser.id = Date.now();
        cache.users.push(newUser);
        persist();
        return jsonResponse(newUser, 201);
      }
    }

    if (path.startsWith("/categories")) {
      if (method === "GET") return jsonResponse(cache.categories);
    }

    return jsonResponse({ message: "Unsupported route" }, 400);
  };
}