import React from "react";
import { createRoot } from "react-dom/client";


import { MantineProvider } from "@mantine/core";

import { HashRouter, Routes, Route } from "react-router-dom"; // HashRouter avoids server rewrites
import App from "./App";
import RegistrationForm from "./components/registration/Register";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegistrationForm />} />
        {/* optional catch-all to avoid blanks */}
        <Route path="*" element={<App />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </HashRouter>
  </MantineProvider>
);
