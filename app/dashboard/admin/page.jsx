// app/dashboard/admin/page.jsx
"use client";

import { useMemo, useState } from "react";

/**
 * Admin Panel (no external uuid dependency)
 * - Tabs: Users / Employees
 * - Manage users and their module-level permissions (Read/Edit/Delete)
 *
 * Local state implementation; replace with APIs later.
 */

// Modules available in the system
const MODULES = ["HR", "Payroll", "Asset Tracking"];

// helper: default permission object for all modules
const defaultPermissions = () =>
  MODULES.reduce((acc, m) => {
    acc[m] = { read: false, edit: false, delete: false };
    return acc;
  }, {});

// Sample employees (could be wired from HR)
const sampleEmployees = [
  { empId: "E001", name: "Asha Rao", email: "asha.rao@example.com" },
  { empId: "E002", name: "Ravi Patel", email: "ravi.patel@example.com" },
  { empId: "E003", name: "Meera Singh", email: "meera.singh@example.com" },
  { empId: "E004", name: "Arjun Kumar", email: "arjun.kumar@example.com" },
];

// tiny id generator (no external deps)
function generateId(prefix = "U") {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${t}-${r}`;
}

// Sample users
const initialUsers = [
  {
    id: "U-1",
    name: "System SuperAdmin",
    email: "superadmin@livik.com",
    role: "super-admin", // super-admin / admin / user
    empId: null,
    permissions: (() => {
      const p = defaultPermissions();
      // super admin all rights
      MODULES.forEach((m) => (p[m] = { read: true, edit: true, delete: true }));
      return p;
    })(),
  },
  {
    id: "U-2",
    name: "Payroll Admin",
    email: "payroll@livik.com",
    role: "admin",
    empId: null,
    permissions: (() => {
      const p = defaultPermissions();
      p["Payroll"] = { read: true, edit: true, delete: false };
      return p;
    })(),
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState(initialUsers);
  const [employees, setEmployees] = useState(sampleEmployees);

  // modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // new user form
  const [newUserForm, setNewUserForm] = useState({
    name: "",
    email: "",
    role: "user",
    empId: "",
    permissions: defaultPermissions(),
  });

  // helpers
  const openAdd = (fromEmployee = null) => {
    setNewUserForm({
      name: fromEmployee?.name ?? "",
      email: fromEmployee?.email ?? "",
      role: "user",
      empId: fromEmployee?.empId ?? "",
      permissions: defaultPermissions(),
    });
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setNewUserForm({
      name: "",
      email: "",
      role: "user",
      empId: "",
      permissions: defaultPermissions(),
    });
  };

  const togglePermission = (permObj, moduleName, key) => {
    // update nested copy
    const copy = JSON.parse(JSON.stringify(permObj));
    copy[moduleName][key] = !copy[moduleName][key];
    return copy;
  };

  const createUser = (e) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      alert("Provide name and email.");
      return;
    }
    const id = generateId("U");
    const user = { id, ...newUserForm };
    setUsers((u) => [user, ...u]);
    closeAdd();
  };

  const openEdit = (user) => {
    setEditingUser(JSON.parse(JSON.stringify(user))); // clone
    setIsEditOpen(true);
  };
  const closeEdit = () => {
    setEditingUser(null);
    setIsEditOpen(false);
  };

  const saveEdit = () => {
    if (!editingUser.name || !editingUser.email)
      return alert("Name/email required.");
    setUsers((prev) =>
      prev.map((u) => (u.id === editingUser.id ? editingUser : u))
    );
    closeEdit();
  };

  const deleteUser = (id) => {
    if (!confirm("Delete user? This cannot be undone.")) return;
    setUsers((p) => p.filter((u) => u.id !== id));
  };

  // quick derived summary: number of users per role
  const counts = useMemo(() => {
    const c = { "super-admin": 0, admin: 0, user: 0 };
    for (const u of users) c[u.role] = (c[u.role] || 0) + 1;
    return c;
  }, [users]);

  // helper to pretty-print permission summary
  const permSummary = (p) =>
    MODULES.map((m) => {
      const rights = p[m];
      const granted = Object.keys(rights).filter((k) => rights[k]);
      return `${m}: ${granted.length ? granted.join("/") : "—"}`;
    }).join(" • ");

  return (
    <div className="text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage admins, users and module-level permissions.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("users")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "users"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab("employees")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "employees"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Employees
            </button>
          </div>

          <div>
            <button
              onClick={() => openAdd(null)}
              className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
            >
              + Add User
            </button>
          </div>
        </div>

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Employee</th>
                    <th className="px-4 py-2">Permissions</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-sm">{u.email}</td>
                      <td className="px-4 py-3 text-sm capitalize">
                        {u.role.replace("-", " ")}
                      </td>
                      <td className="px-4 py-3 text-sm">{u.empId ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {permSummary(u.permissions)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEdit(u)}
                            className="text-sm text-[#1E90FF] hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteUser(u.id)}
                            className="text-sm text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* small role summary */}
            <div className="mt-4 flex gap-3">
              <div className="text-sm text-gray-600">Role counts:</div>
              <div className="text-sm">
                Super Admins: <strong>{counts["super-admin"]}</strong>
              </div>
              <div className="text-sm">
                Admins: <strong>{counts["admin"]}</strong>
              </div>
              <div className="text-sm">
                Users: <strong>{counts["user"]}</strong>
              </div>
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === "employees" && (
          <div>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-gray-600">
                    <th className="px-4 py-2">Emp ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">User Account</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {employees.map((emp) => {
                    const linkedUser = users.find((u) => u.empId === emp.empId);
                    return (
                      <tr key={emp.empId} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium">
                          {emp.empId}
                        </td>
                        <td className="px-4 py-3 text-sm">{emp.name}</td>
                        <td className="px-4 py-3 text-sm">{emp.email}</td>
                        <td className="px-4 py-3 text-sm">
                          {linkedUser ? linkedUser.email : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            {!linkedUser ? (
                              <button
                                onClick={() => openAdd(emp)}
                                className="text-sm px-3 py-1 rounded-md bg-[#1E90FF] text-white"
                              >
                                Create User
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => openEdit(linkedUser)}
                                  className="text-sm text-[#1E90FF] hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteUser(linkedUser.id)}
                                  className="text-sm text-red-600 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeAdd} />
          <form
            onSubmit={createUser}
            className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add User</h2>
              <button
                type="button"
                onClick={closeAdd}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-gray-600">
                Name
                <input
                  name="name"
                  value={newUserForm.name}
                  onChange={(e) =>
                    setNewUserForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                  required
                />
              </label>

              <label className="text-xs text-gray-600">
                Email
                <input
                  name="email"
                  value={newUserForm.email}
                  onChange={(e) =>
                    setNewUserForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                  required
                />
              </label>

              <label className="text-xs text-gray-600">
                Role
                <select
                  value={newUserForm.role}
                  onChange={(e) =>
                    setNewUserForm((p) => ({ ...p, role: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </label>

              <label className="text-xs text-gray-600">
                Link to Employee (optional)
                <select
                  value={newUserForm.empId}
                  onChange={(e) =>
                    setNewUserForm((p) => ({ ...p, empId: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="">— none —</option>
                  {employees.map((emp) => (
                    <option key={emp.empId} value={emp.empId}>
                      {emp.empId} — {emp.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-600 mb-2">
                  Permissions (per module)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {MODULES.map((m) => (
                    <div key={m} className="border rounded-md p-3">
                      <div className="font-medium mb-2">{m}</div>
                      <div className="flex gap-2 items-center">
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={newUserForm.permissions[m].read}
                            onChange={() =>
                              setNewUserForm((p) => ({
                                ...p,
                                permissions: togglePermission(
                                  p.permissions,
                                  m,
                                  "read"
                                ),
                              }))
                            }
                          />{" "}
                          <span className="ml-1">Read</span>
                        </label>
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={newUserForm.permissions[m].edit}
                            onChange={() =>
                              setNewUserForm((p) => ({
                                ...p,
                                permissions: togglePermission(
                                  p.permissions,
                                  m,
                                  "edit"
                                ),
                              }))
                            }
                          />{" "}
                          <span className="ml-1">Edit</span>
                        </label>
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={newUserForm.permissions[m].delete}
                            onChange={() =>
                              setNewUserForm((p) => ({
                                ...p,
                                permissions: togglePermission(
                                  p.permissions,
                                  m,
                                  "delete"
                                ),
                              }))
                            }
                          />{" "}
                          <span className="ml-1">Delete</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeAdd}
                className="px-4 py-2 rounded-md text-sm border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit User Modal */}
      {isEditOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeEdit} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <button onClick={closeEdit} className="text-gray-500">
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-gray-600">
                Name
                <input
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser((p) => ({ ...p, name: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="text-xs text-gray-600">
                Email
                <input
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser((p) => ({ ...p, email: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <label className="text-xs text-gray-600">
                Role
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser((p) => ({ ...p, role: e.target.value }))
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </label>

              <label className="text-xs text-gray-600">
                Linked Employee
                <input
                  value={editingUser.empId ?? ""}
                  onChange={(e) =>
                    setEditingUser((p) => ({ ...p, empId: e.target.value }))
                  }
                  placeholder="Employee ID (optional)"
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                />
              </label>

              <div className="md:col-span-2">
                <div className="text-xs text-gray-600 mb-2">Permissions</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {MODULES.map((m) => (
                    <div key={m} className="border rounded-md p-3">
                      <div className="font-medium mb-2">{m}</div>
                      <div className="flex gap-2 items-center">
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={editingUser.permissions[m].read}
                            onChange={() =>
                              setEditingUser((p) => ({
                                ...p,
                                permissions: togglePermission(
                                  p.permissions,
                                  m,
                                  "read"
                                ),
                              }))
                            }
                          />{" "}
                          <span className="ml-1">Read</span>
                        </label>
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={editingUser.permissions[m].edit}
                            onChange={() =>
                              setEditingUser((p) => ({
                                ...p,
                                permissions: togglePermission(
                                  p.permissions,
                                  m,
                                  "edit"
                                ),
                              }))
                            }
                          />{" "}
                          <span className="ml-1">Edit</span>
                        </label>
                        <label className="text-sm">
                          <input
                            type="checkbox"
                            checked={editingUser.permissions[m].delete}
                            onChange={() =>
                              setEditingUser((p) => ({
                                ...p,
                                permissions: togglePermission(
                                  p.permissions,
                                  m,
                                  "delete"
                                ),
                              }))
                            }
                          />{" "}
                          <span className="ml-1">Delete</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={closeEdit}
                className="px-4 py-2 rounded-md text-sm border"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

