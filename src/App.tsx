import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import CabinsPage from './pages/CabinsPage';
import CabinDetailPage from './pages/CabinDetailPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ActivityDetailsPage from './pages/ActivityDetailsPage';
import MapPage from './pages/MapPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import JobsPage from './pages/JobsPage';
import ApplyPage from './pages/ApplyPage';
import SignInPage from './pages/SignInPage';
import AdminOverviewPage from './pages/admin/OverviewPage';
import AdminCabinsPage from './pages/admin/CabinsPage';
import AdminActivitiesPage from './pages/admin/ActivitiesPage';
import AdminReservationsPage from './pages/admin/ReservationsPage';
import AdminNewsletterPage from './pages/admin/NewsletterPage';
import AdminUsersPage from './pages/admin/UsersPage';
import AdminPricingPage from './pages/admin/PricingPage';
import AdminMaintenancePage from './pages/admin/MaintenancePage';
import AdminAvailabilityPage from './pages/admin/AvailabilityPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverviewPage />} />
            <Route path="cabins" element={<AdminCabinsPage />} />
            <Route path="activities" element={<AdminActivitiesPage />} />
            <Route path="reservations" element={<AdminReservationsPage />} />
            <Route path="newsletter" element={<AdminNewsletterPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="pricing" element={<AdminPricingPage />} />
            <Route path="maintenance" element={<AdminMaintenancePage />} />
            <Route path="availability" element={<AdminAvailabilityPage />} />
          </Route>

          {/* Public Routes */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cabins" element={<CabinsPage />} />
                    <Route path="/cabins/:id" element={<CabinDetailPage />} />
                    <Route path="/activities" element={<ActivitiesPage />} />
                    <Route path="/activities/:id" element={<ActivityDetailsPage />} />
                    <Route path="/map" element={<MapPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/gallery" element={<GalleryPage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/apply/:id" element={<ApplyPage />} />
                    <Route path="/signin" element={<SignInPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;