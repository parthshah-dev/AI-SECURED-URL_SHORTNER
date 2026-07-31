import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, User, LogOut, ChevronDown } from 'lucide-react';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-neutral-200/80 flex items-center px-4 md:px-6 justify-between sticky top-0 z-30">
      {/* Left: Mobile menu + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors focus:outline-none"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="md:hidden font-bold text-primary-600 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          Linkly
        </div>
      </div>

      {/* Right: User menu */}
      <div className="ml-auto flex items-center" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 py-1.5 px-2 rounded-xl hover:bg-neutral-50 transition-colors focus:outline-none"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-neutral-700 max-w-[120px] truncate">
              {user?.name || 'User'}
            </span>
            <ChevronDown className={`hidden md:block w-4 h-4 text-neutral-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200/80 py-1.5 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-neutral-100">
                <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{user?.email}</p>
              </div>
              <div className="py-1">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  Profile Settings
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
