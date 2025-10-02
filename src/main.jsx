import React from "react";
import { createRoot } from "react-dom/client";


import { MantineProvider } from "@mantine/core";

import { HashRouter, Routes, Route } from "react-router-dom"; // HashRouter avoids server rewrites
import App from "./App";
import BookingFormPage from "./components/registration/Register";

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/book" element={<BookingFormPage />} />
        {/* optional catch-all to avoid blanks */}
        <Route path="*" element={<App />} />
      </Routes>
    </HashRouter>
  </MantineProvider>
);
