import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faSignOutAlt, faBars } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 md:px-6 justify-between shadow-sm relative">
      <div className="flex items-center md:hidden">
        <button className="p-2 text-neutral-500 hover:text-neutral-900 focus:outline-none">
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>
        <div className="ml-4 font-bold text-primary-600">Shortener</div>
      </div>
      
      <div className="hidden md:block">
        {/* Breadcrumbs or Page Title could go here */}
      </div>

      <div className="ml-auto flex items-center">
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-neutral-700">
              {user?.name || 'User'}
            </span>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-neutral-200 z-50">
              <div className="px-4 py-2 border-b border-neutral-100">
                <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
              <Link 
                to="/profile"
                className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 flex items-center"
                onClick={() => setMenuOpen(false)}
              >
                <FontAwesomeIcon icon={faUserCircle} className="mr-2" /> Profile
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  logout();
                }}
                className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 flex items-center"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
