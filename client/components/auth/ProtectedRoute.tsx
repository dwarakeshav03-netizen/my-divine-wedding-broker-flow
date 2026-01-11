import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    
    const role = parseInt(localStorage.getItem('userRole') || '0');
    const token = localStorage.getItem('token');

 
    if (!token) {
        return <Navigate to="/" replace />;
    }

    
    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;