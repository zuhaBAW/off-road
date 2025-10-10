import React from "react";
import { createRoot } from "react-dom/client";


import { MantineProvider } from "@mantine/core";

import { BrowserRouter, Routes, Route } from "react-router-dom"; // HashRouter avoids server rewrites
import App from "./App";
import RegistrationForm from "./components/registration/Register";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import Home from "./components/home/Home";

createRoot(document.getElementById("root")).render(
  <MantineProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<RegistrationForm />} />
        {/* <Route path="/home" element={<App />} /> */}

        <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </MantineProvider>
);
