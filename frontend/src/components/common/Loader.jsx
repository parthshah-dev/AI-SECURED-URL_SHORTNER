import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader = ({ fullScreen = false }) => {
  const loaderClass = "animate-spin text-primary-600 text-4xl";
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
        <FontAwesomeIcon icon={faSpinner} className={loaderClass} />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      <FontAwesomeIcon icon={faSpinner} className={loaderClass} />
    </div>
  );
};

export default Loader;
