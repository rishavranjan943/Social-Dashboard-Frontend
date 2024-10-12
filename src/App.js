import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Updated import
import UserForm from './components/UserForm';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './App.css'; 

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>404 - Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
