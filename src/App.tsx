/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { Contact } from './pages/Contact';
import { Login } from './pages/admin/Login';
import { AuthGuard } from './components/admin/AuthGuard';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Overview } from './pages/admin/Overview';
import { Batches } from './pages/admin/Batches';
import { DailyReports } from './pages/admin/DailyReports';
import { SalesLedger } from './pages/admin/SalesLedger';
import { Maintenance } from './pages/admin/Maintenance';
import { StaffDirectory } from './pages/admin/StaffDirectory';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          {/* Main Website Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <AuthGuard>
                <AdminLayout />
              </AuthGuard>
            }
          >
            <Route index element={<Overview />} />
            <Route path="batches" element={<Batches />} />
            <Route path="reports" element={<DailyReports />} />
            <Route path="sales" element={<SalesLedger />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="staff" element={<StaffDirectory />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

