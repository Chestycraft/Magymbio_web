"use client";

import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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

export default function MembersTable() {
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
  const [addForm, setAddForm] = useState({ full_name: '', email: '', membership_type: '', started: '', membership_end: '' });
  const [addLoading, setAddLoading] = useState(false);
  const [sortBy, setSortBy] = useState({ id: null, desc: false });
  const [expiringFilter, setExpiringFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  // For Get by Email feature
  const [searchEmail, setSearchEmail] = useState("");
  const [emailResult, setEmailResult] = useState(null);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState(null);

  // Fetch paginated members
  useEffect(() => {
    async function fetchMembers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/members?page=${page}&limit=${limit}`);
        if (!res.ok) throw new Error("Failed to fetch members");
        const json = await res.json();
        setData(json.subscriptions || []);
        setTotalPages(json.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, [page, limit]);

  // Sorting and filtering logic
  const sortedData = useMemo(() => {
    let filtered = [...data];
    if (expiringFilter) {
      const now = new Date();
      const in7 = new Date();
      in7.setDate(now.getDate() + 7);
      filtered = filtered.filter((row) => {
        if (!row.membership_end) return false;
        const end = new Date(row.membership_end);
        return end >= now && end <= in7;
      });
    }
    if (sortBy.id) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy.id];
        const bVal = b[sortBy.id];
        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortBy.desc ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
        }
        if (aVal instanceof Date && bVal instanceof Date) {
          return sortBy.desc ? bVal - aVal : aVal - bVal;
        }
        return sortBy.desc ? bVal - aVal : aVal - bVal;
      });
    }
    return filtered;
  }, [data, sortBy, expiringFilter]);

  // Table columns
  const columns = useMemo(() => [
    { accessorKey: "user_id", header: "User ID" },
    { accessorKey: "full_name", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "membership_type", header: "Membership Type" },
    { accessorKey: "started", header: "Start Date", cell: ({ getValue }) => getValue() ? new Date(getValue()).toLocaleDateString() : "-" },
    { accessorKey: "membership_end", header: "End Date", cell: ({ getValue }) => getValue() ? new Date(getValue()).toLocaleDateString() : "-" },
    { accessorKey: "created_at", header: "Created At", cell: ({ getValue }) => getValue() ? new Date(getValue()).toLocaleString() : "-" },
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
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 019 17H7v-2a2 2 0 012-2z" /></svg>
            Edit
          </button>
          <button
            className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs font-semibold shadow"
            title="Delete"
            onClick={() => handleDelete(row.original.email)}
            disabled={deleteLoading}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
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
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  // Robust and simple delete logic
  const handleDelete = async (email) => {
    const normalizedEmail = email.trim().toLowerCase();
    console.log('[DEBUG] Deleting member with email:', normalizedEmail);
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/members/${encodeURIComponent(normalizedEmail)}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete member');
      setData(prev => prev.filter(m => m.email.trim().toLowerCase() !== normalizedEmail));
      console.log('[DEBUG] Member deleted successfully.');
    } catch (err) {
      alert('Delete failed: ' + err.message);
      console.error('[DEBUG] Error deleting member:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  // CRUD: Edit
  const handleEdit = (member) => {
    // Pre-fill form, convert ISO date strings to 'YYYY-MM-DD' for date inputs
    const prefill = { ...member };
    if (prefill.started) {
      prefill.started = new Date(prefill.started).toISOString().split('T')[0];
    }
    if (prefill.membership_end) {
      prefill.membership_end = new Date(prefill.membership_end).toISOString().split('T')[0];
    }
    setEditRow(member.email); // Use email as unique key
    setEditForm(prefill);
    setEditModalOpen(true);
  };
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const member = data.find(m => m.email === editRow);
    // Prepare form data: send null for empty date fields, ISO string for filled
    const formToSend = { ...editForm };
    formToSend.started = formToSend.started ? new Date(formToSend.started).toISOString() : null;
    formToSend.membership_end = formToSend.membership_end ? new Date(formToSend.membership_end).toISOString() : null;
    console.log('[DEBUG] Updating member with data:', formToSend);
    try {
      const res = await fetch(`/api/members/${encodeURIComponent(member.email)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSend),
      });
      if (!res.ok) throw new Error('Failed to update member');
      const updated = await res.json();
      setData((prev) => prev.map((item) => (item.email === member.email ? updated : item)));
      setEditModalOpen(false);
      console.log('[DEBUG] Member updated:', updated);
    } catch (err) {
      alert(err.message);
      console.error('[DEBUG] Error updating member:', err);
    } finally {
      setEditLoading(false);
    }
  };

  // CRUD: Add
  const handleAdd = () => {
    setAddForm({ full_name: '', email: '', membership_type: '', started: '', membership_end: '' });
    setAddModalOpen(true);
  };
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    // Prepare form data, only include valid ISO dates
    const formToSend = { ...addForm };
    if (formToSend.started) {
      formToSend.started = new Date(formToSend.started).toISOString();
    } else {
      delete formToSend.started;
    }
    if (formToSend.membership_end) {
      formToSend.membership_end = new Date(formToSend.membership_end).toISOString();
    } else {
      delete formToSend.membership_end;
    }
    console.log('[DEBUG] Adding member with data:', formToSend);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formToSend),
      });
      console.log('[DEBUG] API response status:', res.status);
      let newMember = null;
      try {
        newMember = await res.json();
        console.log('[DEBUG] API response body:', newMember);
      } catch (jsonErr) {
        console.error('[DEBUG] Error parsing response JSON:', jsonErr);
      }
      if (!res.ok) throw new Error('Failed to add member');
      setData((prev) => [newMember, ...prev]);
      setAddModalOpen(false);
      console.log('[DEBUG] Member added:', newMember);
    } catch (err) {
      alert('Add failed: ' + err.message);
      console.error('[DEBUG] Error adding member:', err);
    } finally {
      setAddLoading(false);
    }
  };

  // Get by Email feature
  const handleSearchEmail = async (e) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError(null);
    setEmailResult(null);
    const normalizedEmail = searchEmail.trim().toLowerCase();
    console.log('[DEBUG] Searching for member by email:', normalizedEmail);
    try {
      const res = await fetch(`/api/members/${encodeURIComponent(normalizedEmail)}`);
      console.log('[DEBUG] API response status:', res.status);
      const result = await res.json();
      console.log('[DEBUG] API response body:', result);
      if (!res.ok || !result) throw new Error('Member not found');
      setEmailResult(result);
      setEmailModalOpen(true);
    } catch (err) {
      setEmailError(err.message);
      console.error('[DEBUG] Error searching member by email:', err);
    } finally {
      setEmailLoading(false);
    }
  };

  // Pagination controls
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };
  const handlePageInput = (e) => {
    let val = Number(e.target.value);
    if (isNaN(val) || val < 1) val = 1;
    if (val > totalPages) val = totalPages;
    setPage(val);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-white">Loading members...</div>
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
            placeholder="Search members..."
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
          <div className="flex gap-2 items-center">
            <label className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={expiringFilter}
                onChange={e => setExpiringFilter(e.target.checked)}
                className="accent-red-500"
              />
              Expiring (7 days)
            </label>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg shadow hover:from-green-600 hover:to-green-700 transition font-semibold"
            >
              ➕ Add Member
            </button>
          </div>
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
                    `transition-colors ${idx % 2 === 0 ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800'} ` +
                    'hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-800'
                  }
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-3 align-middle">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500 dark:text-gray-400">Rows per page:</label>
            <select
              value={limit}
              onChange={handleLimitChange}
              className="border rounded px-2 py-1 text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 20, 50, 100].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Prev
            </button>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={page}
              onChange={handlePageInput}
              className="w-14 px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 text-center"
            />
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Next
            </button>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Page {page} of {totalPages}
          </div>
        </div>
        {/* Edit Modal */}
        <Modal open={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Edit Member</h2>
          <form onSubmit={handleEditSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={editForm.full_name || ""}
                onChange={handleEditFormChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editForm.email || ""}
                onChange={handleEditFormChange}
                className="w-full border rounded px-2 py-1 bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Membership Type</label>
              <input
                type="text"
                name="membership_type"
                value={editForm.membership_type || ""}
                onChange={handleEditFormChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="started"
                value={editForm.started ? new Date(editForm.started).toISOString().split('T')[0] : ""}
                onChange={handleEditFormChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="membership_end"
                value={editForm.membership_end ? new Date(editForm.membership_end).toISOString().split('T')[0] : ""}
                onChange={handleEditFormChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={editLoading}
              >
                {editLoading ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setEditModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        {/* Add Modal */}
        <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Add Member</h2>
          <form onSubmit={handleAddSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                value={addForm.full_name}
                onChange={handleAddFormChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={addForm.email}
                onChange={handleAddFormChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Membership Type</label>
              <input
                type="text"
                name="membership_type"
                value={addForm.membership_type}
                onChange={handleAddFormChange}
                className="w-full border rounded px-2 py-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                name="started"
                value={addForm.started}
                onChange={handleAddFormChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                name="membership_end"
                value={addForm.membership_end}
                onChange={handleAddFormChange}
                className="w-full border rounded px-2 py-1"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                disabled={addLoading}
              >
                {addLoading ? "Adding..." : "Add"}
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setAddModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        {/* Get by Email Modal */}
        <Modal open={emailModalOpen} onClose={() => setEmailModalOpen(false)}>
          <h2 className="text-xl font-bold mb-4">Member Details</h2>
          {emailResult ? (
            <div className="space-y-2">
              <div><b>Full Name:</b> {emailResult.full_name || '-'}</div>
              <div><b>Email:</b> {emailResult.email}</div>
              <div><b>Membership Type:</b> {emailResult.membership_type || '-'}</div>
              <div><b>Start Date:</b> {emailResult.started ? new Date(emailResult.started).toLocaleDateString() : '-'}</div>
              <div><b>End Date:</b> {emailResult.membership_end ? new Date(emailResult.membership_end).toLocaleDateString() : '-'}</div>
              <div><b>Created At:</b> {emailResult.created_at ? new Date(emailResult.created_at).toLocaleString() : '-'}</div>
              <div className="flex gap-2 mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                  onClick={() => {
                    // Find index in main data array
                    const idx = data.findIndex(m => m.email === emailResult.email);
                    if (idx !== -1) {
                      setEditRow(data[idx].email);
                      setEditForm({ ...data[idx] });
                      setEditModalOpen(true);
                      setEmailModalOpen(false);
                    } else {
                      // If not in current page, allow editing in modal
                      setEditForm({ ...emailResult });
                      setEditRow(null);
                      setEditModalOpen(true);
                      setEmailModalOpen(false);
                    }
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
                  onClick={() => handleDelete(emailResult.email)}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ) : emailError ? (
            <div className="text-red-500">{emailError}</div>
          ) : (
            <div>Loading...</div>
          )}
        </Modal>
      </div>
    </div>
  );
}
