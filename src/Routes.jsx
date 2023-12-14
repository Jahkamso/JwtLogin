// Routes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Login';
import Data from './components/Data';
import axios from 'axios';

// Set up Axios interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirect to the login page if the response status is 401
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const Routing = () => {
  const isAuthenticated = !!sessionStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Specify the 'element' prop for each Route */}
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/data"
          element={isAuthenticated ? <Data /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;
