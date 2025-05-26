import React from 'react';
import AdminDashboard from '../components/features/AdminDashboard';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default AdminPage;