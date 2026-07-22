import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faLink, faChartLine, faUser } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: faChartPie },
    { name: 'My URLs', path: '/urls', icon: faLink },
    { name: 'Analytics', path: '/analytics', icon: faChartLine },
    { name: 'Profile', path: '/profile', icon: faUser },
  ];

  return (
    <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-neutral-200 font-bold text-xl text-primary-600">
        <FontAwesomeIcon icon={faLink} className="mr-2" />
        Shortener
      </div>
      
      <nav className="p-4 flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors font-medium ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-neutral-200 text-xs text-neutral-400 text-center">
        &copy; {new Date().getFullYear()} URL Shortener
      </div>
    </aside>
  );
};

export default Sidebar;
