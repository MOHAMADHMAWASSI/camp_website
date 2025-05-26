import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Calendar, Home, Activity, Mail, Users, DollarSign, PenTool as Tool, LogOut } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { signOut } = useAuthContext();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/signin');
  };

  const navItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/reservations', icon: Calendar, label: 'Reservations' },
    { to: '/admin/cabins', icon: Home, label: 'Cabins' },
    { to: '/admin/activities', icon: Activity, label: 'Activities' },
    { to: '/admin/newsletter', icon: Mail, label: 'Newsletter' },
    { to: '/admin/users', icon: Users, label: 'Users' },
    { to: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
    { to: '/admin/maintenance', icon: Tool, label: 'Maintenance' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <div className="bg-green-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleSignOut}
              className="flex items-center text-white hover:text-amber-200 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {navItems.map(({ to, icon: Icon, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-green-700 text-white'
                        : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;