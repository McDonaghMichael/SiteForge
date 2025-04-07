import React from 'react';
import { Navigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
    return (props) => {
        const isAuthenticated = localStorage.getItem('authToken'); 

        if (isAuthenticated) {
            return <WrappedComponent {...props} />;
        } else {
            return <Navigate to="/admin/login" replace />;
        }
    };
};

export default withAuth;