import React, { useState, useMemo } from 'react';
import { UserPlus, Loader, AlertTriangle, Edit, Trash2, Lock, RefreshCcw, Search, ArrowUpDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'staff' | 'viewer';
  created_at: string;
  active: boolean;
}

type SortField = 'name' | 'role' | 'status';
type SortDirection = 'asc' | 'desc';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<{ id: string; role: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection }>({
    field: 'role',
    direction: 'asc'
  });

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'staff' as const,
    password: ''
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Handle user creation
  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setLoading(true);

      const { data: session } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            operation: 'create',
            email: formData.email,
            password: formData.password,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: formData.role,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }

      setShowForm(false);
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        role: 'staff',
        password: ''
      });
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Handle role update
  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (updateError) throw updateError;
      setEditingRole(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  // Handle user deactivation
  const deactivateUser = async (userId: string) => {
    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ active: false })
        .eq('id', userId);

      if (updateError) throw updateError;
      setShowDeactivateModal(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
    }
  };

  // Handle user reactivation
  const reactivateUser = async (userId: string) => {
    try {
      setError(null);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ active: true })
        .eq('id', userId);

      if (updateError) throw updateError;
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate user');
    }
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Filter and sort users
  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(user => 
        user.email.toLowerCase().includes(query) ||
        user.first_name.toLowerCase().includes(query) ||
        user.last_name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      switch (sortConfig.field) {
        case 'name':
          return (a.first_name + ' ' + a.last_name)
            .localeCompare(b.first_name + ' ' + b.last_name) * direction;
        case 'role':
          return a.role.localeCompare(b.role) * direction;
        case 'status':
          return Number(b.active) - Number(a.active) * direction;
        default:
          return 0;
      }
    });

    // Group by role (admins first, then staff, then viewers)
    return result.sort((a, b) => {
      const roleOrder = { admin: 0, staff: 1, viewer: 2 };
      return roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder];
    });
  }, [users, searchQuery, sortConfig]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  if (loading && !users.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add New User
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  User
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center">
                  Role
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-1 h-4 w-4" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingRole?.id === user.id ? (
                    <select
                      value={editingRole.role}
                      onChange={(e) => setEditingRole({ ...editingRole, role: e.target.value })}
                      onBlur={() => updateUserRole(user.id, editingRole.role)}
                      autoFocus
                      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="admin">Admin</option>
                      <option value="staff">Staff</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span
                      onClick={() => setEditingRole({ id: user.id, role: user.role })}
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'staff' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    {user.active ? (
                      <button 
                        onClick={() => setShowDeactivateModal(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Deactivate User"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => reactivateUser(user.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Reactivate User"
                      >
                        <RefreshCcw className="h-5 w-5" />
                      </button>
                    )}
                    <button className="text-gray-600 hover:text-gray-900" title="Reset Password">
                      <Lock className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Add New User
            </h3>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'staff' | 'viewer' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="staff">Staff</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirmation Modal */}
      {showDeactivateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirm User Deactivation
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to deactivate {
                users.find(u => u.id === showDeactivateModal)?.first_name
              } {
                users.find(u => u.id === showDeactivateModal)?.last_name
              }? This action can be reversed later.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeactivateModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={() => showDeactivateModal && deactivateUser(showDeactivateModal)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;