import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import HelpCenter from './components/HelpCenter/HelpCenter';
import PropertyOwnerDashboard from './components/PropertyOwner/PropertyOwnerDashboard';
import AddProperty from './components/PropertyOwner/AddProperty';
import Profile from './components/Profile/Profile';
import About from './components/About/About';
import Events from './components/Events/Events';
import Terms from './components/Terms/Terms';
import Privacy from './components/Privacy/Privacy';
import AdminDashboard from './components/Admin/AdminDashboard';
import ContactUs from './components/Contact/ContactUs';
import ConfirmBookingWrapper from './components/ConfirmBooking/ConfirmBookingWrapper';
import ProtectedRoute from './components/Common/ProtectedRoute';
import IntegrationTest from './components/Common/IntegrationTest';
import Footer from './components/Footer/Footer';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="help" element={<HelpCenter />} />
        <Route path="profile" element={<Profile />} />
        <Route path="contact" element={<ContactUs />} />
        <Route path="about" element={<About />} />
        <Route path="events" element={<Events />} />
        <Route path="terms" element={<Terms />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="confirm-booking" element={<ConfirmBookingWrapper />} />
        <Route path="property-dashboard" element={
          <ProtectedRoute requiredRole="property_owner">
            <PropertyOwnerDashboard />
          </ProtectedRoute>
        } />
        <Route path="add-property" element={
          <ProtectedRoute requiredRole="property_owner">
            <AddProperty />
          </ProtectedRoute>
        } />
        <Route path="integration-test" element={<IntegrationTest />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;