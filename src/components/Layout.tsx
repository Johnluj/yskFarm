import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { StickyButtons } from './StickyButtons';
import { Preloader } from './Preloader';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden">
      <Preloader />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <StickyButtons />
    </div>
  );
};
