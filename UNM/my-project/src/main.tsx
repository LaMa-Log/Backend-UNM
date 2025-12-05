import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/dash.tsx";
import Login from "./components/login.tsx";
import Profil from "./components/Profil.tsx";
import Job from "./components/job.tsx";
import './App.css';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profession" element={<Job />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="*" element={<Navigate to="/admin" />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
