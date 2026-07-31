import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
            },
            success: {
              style: {
                background: '#059669',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#059669',
              },
            },
            error: {
              style: {
                background: '#dc2626',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#dc2626',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
