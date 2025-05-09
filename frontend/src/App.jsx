import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import EmployeeDashboard from './components/Dashboard/EmployeeDashboard';
import HRDashboard from './components/Dashboard/HRDashboard';
import EditEmployee from './components/Auth/EditEmployee';
import AddEmployee from './components/Auth/AddEmployee';
import LogOut from './components/Auth/LogOut';
import ForgotPassword from './pages/ForgotPassword';




function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Updated route paths to match what's in navigate() */}
        <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
        <Route path="/dashboard/hr" element={<HRDashboard />} />

        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
        
        <Route path="/logout" element={<LogOut />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Fallback route for 404 */}
        <Route path="*" element={<div className="container mt-5">404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
