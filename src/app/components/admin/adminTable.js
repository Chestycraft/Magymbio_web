"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";

// Simple modal component
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

export default function AdminTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState({ id: '', email: '', role: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ id: null, desc: false });
  const [searchEmail, setSearchEmail] = useState("");
  const [emailResult, setEmailResult] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // Fetch all roles
  useEffect(() => {
    async function fetchRoles() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin`);
        if (!res.ok) throw new Error("Failed to fetch roles");
        const json = await res.json();
        setData(json.roles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRoles();
  }, []);

  // Sorting and filtering logic
  const sortedData = useMemo(() => {
    let filtered = [...data];
    if (sortBy.id) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy.id];
        const bVal = b[sortBy.id];
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortBy.desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }
        return sortBy.desc ? bVal - aVal : aVal - bVal;
      });
    }
    return filtered;
  }, [data, sortBy]);

  // Table columns
  const columns = useMemo(() => [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "role", header: "Role" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-xs font-semibold shadow"
            title="Edit"
            onClick={() => handleEdit(row.original)}
          >
            Edit
          </button>
          <button
            className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs font-semibold shadow"
            title="Delete"
            onClick={() => handleDelete(row.original.email)}
            disabled={deleteLoading}
          >
            {deleteLoading ? '...' : 'Delete'}
          </button>
        </div>
      ),
    },
  ], [deleteLoading]);

  const table = useReactTable({
    data: sortedData,
    columns,
    state: { globalFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  // Delete logic
  const handleDelete = async (email) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/admin/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete admin');
      setData(prev => prev.filter(m => m.email !== email));
    } catch (err) {
      alert('Delete failed: ' + err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Edit logic
  const handleEdit = (admin) => {
    setEditRow(admin.email);
    setEditForm({ ...admin });
    setEditModalOpen(true);
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await fetch(`/api/admin/${encodeURIComponent(editRow)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) throw new Error('Failed to update admin');
      const updated = await res.json();
      setData((prev) => prev.map((item) => (item.email === editRow ? updated : item)));
      setEditModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  // Add logic
  const handleAdd = () => {
    setAddForm({ id: '', email: '', role: '' });
    setAddModalOpen(true);
  };
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      });
      let newAdmin = null;
      try {
        newAdmin = await res.json();
      } catch (jsonErr) {}
      if (!res.ok) throw new Error('Failed to add admin');
      setData((prev) => [newAdmin, ...prev]);
      setAddModalOpen(false);
    } catch (err) {
      alert('Add failed: ' + err.message);
    } finally {
      setAddLoading(false);
    }
  };

  // Search by email
  const handleSearchEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError(null);
    setEmailResult(null);
    try {
      const res = await fetch(`/api/admin/${encodeURIComponent(searchEmail)}`);
      const result = await res.json();
      if (!res.ok || !result) throw new Error('Admin not found');
      setEmailResult(result);
      setEmailModalOpen(true);
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setEmailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-white">Loading admins...</div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-40 text-red-500">{error}</div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-full mx-auto bg-white dark:bg-gray-900 shadow-lg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 pt-6 pb-2 bg-gradient-to-r from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search admins..."
            className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg w-full sm:w-1/2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          <form onSubmit={handleSearchEmail} className="flex gap-2 items-center">
            <input
              type="email"
              value={searchEmail}
              onChange={e => setSearchEmail(e.target.value)}
              placeholder="Find by email"
              className="border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-xs"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow hover:bg-blue-600 transition font-semibold text-xs"
              disabled={emailLoading}
            >
              {emailLoading ? '...' : 'Find'}
            </button>
          </form>
          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition font-semibold"
          >
            ➕ Add Admin
          </button>
        </div>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-6 py-3 cursor-pointer select-none group font-bold tracking-wide"
                      onClick={() => {
                        if (header.id === 'actions') return;
                        setSortBy((prev) =>
                          prev.id === header.id
                            ? { id: header.id, desc: !prev.desc }
                            : { id: header.id, desc: false }
                        );
                      }}
                    >
                      <span className="flex items-center gap-1">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {sortBy.id === header.id && (
                          <span className="text-xs">
                            {sortBy.desc ? '▼' : '▲'}
                          </span>
                        )}
                      </span>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={
                    `transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} `
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">ID</label>
            <input
              name="id"
              type="number"
              value={addForm.id}
              onChange={handleAddFormChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={addForm.email}
              onChange={handleAddFormChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <input
              name="role"
              type="text"
              value={addForm.role}
              onChange={handleAddFormChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
            disabled={addLoading}
          >
            {addLoading ? 'Adding...' : 'Add Admin'}
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">ID</label>
            <input
              name="id"
              type="number"
              value={editForm.id}
              onChange={handleEditFormChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <input
              name="role"
              type="text"
              value={editForm.role}
              onChange={handleEditFormChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={editLoading}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </Modal>

      {/* Email Search Modal */}
      <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
        {emailResult ? (
          <div>
            <div><b>ID:</b> {emailResult.id}</div>
            <div><b>Email:</b> {emailResult.email}</div>
            <div><b>Role:</b> {emailResult.role}</div>
          </div>
        ) : (
          <div className="text-red-500">{emailError || "No result found."}</div>
        )}
      </Modal>
    </div>
  );
} 