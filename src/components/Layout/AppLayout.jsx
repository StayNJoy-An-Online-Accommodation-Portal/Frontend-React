import React from 'react';
import { createPortal } from 'react-dom';
import Footer from '../Footer/Footer';

const AppLayout = ({ children, navbar, showSearch = false }) => {
  return (
    <div className="app-layout">
      {/* Sticky Navbar */}
      {React.cloneElement(navbar, { showSearch })}
      
      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export const DropdownPortal = ({ children, isOpen, targetRef }) => {
  if (!isOpen || !targetRef?.current) return null;
  
  const rect = targetRef.current.getBoundingClientRect();
  
  return createPortal(
    <div 
      className="dropdown-portal"
      style={{
        top: rect.bottom + window.scrollY,
        left: rect.right - 200,
        minWidth: '200px'
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default AppLayout;
