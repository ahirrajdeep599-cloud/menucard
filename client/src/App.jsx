import React, { useState, useEffect } from 'react';
import CustomerMenuView from './views/CustomerMenuView';
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import { api } from './utils/api';

export default function App() {
  // View mode: 'customer' or 'admin'
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/admin') || hash.includes('admin')) {
        return 'admin';
      }
    }
    return 'customer';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check authentication session via server-side HttpOnly cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.verifyToken();
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkSession();
  }, [view]);

  // Listen to hash / popstate changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/admin') || hash.includes('admin')) {
        setView('admin');
      } else {
        setView('customer');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState(null, '', '#admin');
    setView('admin');
  };

  const navigateToCustomer = () => {
    window.history.pushState(null, '', '/');
    setView('customer');
  };

  // If on Admin View:
  if (view === 'admin') {
    if (checkingAuth) {
      return (
        <div className="min-h-screen bg-[#08090d] flex items-center justify-center text-zinc-400 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span>Verifying session security...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAuthenticated(true)}
          onBackToMenu={navigateToCustomer}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => setIsAuthenticated(false)}
        onViewCustomerMenu={navigateToCustomer}
      />
    );
  }

  // Otherwise, default Customer Digital Menu
  return (
    <CustomerMenuView
      onNavigateAdmin={navigateToAdmin}
    />
  );
}
