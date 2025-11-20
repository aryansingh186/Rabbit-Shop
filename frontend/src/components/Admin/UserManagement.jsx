import React, { useState } from "react";
import { toast } from "sonner";


const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return;

    const newUser = {
      id: Date.now(),
      name: form.name,
      email: form.email,
      role: form.role,
    };

    setUsers([...users, newUser]);
    setForm({ name: "", email: "", password: "", role: "Customer" });
    toast.success("User added successfully!");
  };

  const handleDelete = (id) => {
    
   
    toast.promise(
      new Promise((resolve, reject) => {
        const confirmed = window.confirm("Are you sure you want to delete this user?");
        if (confirmed) {
          setUsers(users.filter((user) => user.id !== id));
          resolve();
        } else {
          reject();
        }
      }),
      {
        loading: "Deleting...",
        success: "User deleted successfully!",
        error: "Delete cancelled",
      }
    );
  };

  const handleRoleChange = (id, newRole) => {
    setUsers(
      users.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );
    toast("User role updated!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>

      {/* Add User Form */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New User</h2>
        <form className="space-y-4" onSubmit={handleAddUser}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          >
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add User
          </button>
        </form>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm">
            <tr>
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Role</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition">
                <td className="p-3 border-b">{user.name}</td>
                <td className="p-3 border-b">{user.email}</td>
                <td className="p-3 border-b">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border p-1 rounded"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Customer">Customer</option>
                  </select>
                </td>
                <td className="p-3 border-b">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sonner Toaster */}
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default UserManagement;
