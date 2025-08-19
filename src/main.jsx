import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { EventPage } from "./pages/EventPage";
import { EventsPage } from "./pages/EventsPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { EventAdd } from "./components/EventAdd";
import { CategoriesProvider } from "./contexts/CategoriesContext";
import { UsersProvider } from "./contexts/UsersContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/events", // Voeg hier de /events route toe
        element: <EventsPage />, // Verwijs naar je EventsPage
      },

      {
        path: "/",
        element: <EventsPage />,
      },
      {
        path: "/add-event",
        element: <EventAdd />,
      },
      {
        path: "/events/:id",
        element: <EventPage />,
      },
    ],
  },
]);
// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <CategoriesProvider>
        <UsersProvider>
          <RouterProvider router={router} />
        </UsersProvider>
      </CategoriesProvider>
    </ChakraProvider>
  </React.StrictMode>
);
