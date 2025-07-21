'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/features/authentication/hooks/useAuth';
import { createClient } from '@/lib/supabaseClient';
import Button from '@/components/Button';
import Modal from '@/components/Modal';

// Admin page for managing users
// Reference: HackerRank Clone document, Section 5.1 (Role-based UI)

export default function ManageUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [fetchingUsers, setFetchingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      return;
    }

    const fetchUsers = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from('users').select('id, email, name, role');

      if (error) {
        setError('Failed to fetch users');
      } else {
        setUsers(data || []);
      }
      setFetchingUsers(false);
    };

    fetchUsers();
  }, [authLoading, user]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('users')
      .update({ role: newRole })
      .eq('id', userId);

    if (error) {
      setError('Failed to update role');
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setShowModal(false);
    }
  };

  if (authLoading || fetchingUsers) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b dark:border-gray-600">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSelectedUser(u);
                      setShowModal(true);
                    }}
                  >
                    Edit Role
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        {selectedUser && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Edit Role for {selectedUser.name}</h2>
            <select
              value={selectedUser.role}
              onChange={(e) => handleRoleChange(selectedUser.id, e.target.value)}
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        )}
      </Modal>
    </div>
  );
}