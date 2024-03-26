// src/routes/Routes.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../Layout/layout';
import Login from '../Login/login';
import Home from '../Home/home';
import Register from '../Register/resgister';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route index element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element = {<Register />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;
