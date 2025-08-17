import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const AdminRoute = ({ children }) => {
  const { user } = useAuthStore((state) => ({ user: state.user }));

  // First, check if the user is logged in.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Next, check if the user has the 'admin' role.
  if (user.role !== 'admin') {
    // If they are logged in but not an admin, redirect to the homepage.
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the child components.
  return children;
};

export default AdminRoute;
