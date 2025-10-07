
import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './page/Login';
import {BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routers/ProtectedRoute';
import Dashboard from './page/Dashboar';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Parte publica */}
        <Route path="/" element={<Login />} />
        {/* <Route path="*" element={<Navigate to={"/Login"} />} /> */}
        {/* Parte protegida */}
        <Route 
          path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);