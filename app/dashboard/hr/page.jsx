// app/dashboard/hr/page.jsx
"use client";

import { useMemo, useState } from "react";

const initialEmployees = [
  {
    id: "E001",
    name: "Asha Rao",
    email: "asha.rao@example.com",
    role: "Software Engineer",
    status: "Active",
  },
  {
    id: "E002",
    name: "Ravi Patel",
    email: "ravi.patel@example.com",
    role: "Product Manager",
    status: "Active",
  },
  {
    id: "E003",
    name: "Meera Singh",
    email: "meera.singh@example.com",
    role: "Designer",
    status: "On Leave",
  },
  {
    id: "E004",
    name: "Arjun Kumar",
    email: "arjun.kumar@example.com",
    role: "HR Specialist",
    status: "Active",
  },
];

const initialApprovals = [
  {
    id: "A101",
    type: "Leave Request",
    employee: "Meera Singh",
    details: "Casual leave — 2 days",
    status: "Pending",
  },
  {
    id: "A102",
    type: "Role Change",
    employee: "Ravi Patel",
    details: "Request to move to Senior PM",
    status: "Pending",
  },
];

const tabs = [
  { id: "all", label: "All Employees" },
  { id: "approvals", label: "Approvals" },
];

export default function HRPage() {
  const [activeTab, setActiveTab] = useState("all");

  // employee state
  const [employees, setEmployees] = useState(initialEmployees);

  // approvals state
  const [approvals, setApprovals] = useState(initialApprovals);

  // modal/form state for adding employee
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    email: "",
    role: "",
    status: "Active",
  });

  const openAdd = () => {
    setNewEmployee({ id: "", name: "", email: "", role: "", status: "Active" });
    setIsAddOpen(true);
  };
  const closeAdd = () => setIsAddOpen(false);

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee((p) => ({ ...p, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    // Basic validation: require id and name
    if (!newEmployee.id.trim() || !newEmployee.name.trim()) return;
    setEmployees((p) => [newEmployee, ...p]);
    setIsAddOpen(false);
  };

  const handleDeleteEmployee = (id) => {
    if (!confirm("Delete employee " + id + "?")) return;
    setEmployees((p) => p.filter((x) => x.id !== id));
  };

  const handleApprove = (approvalId) => {
    setApprovals((p) =>
      p.map((a) => (a.id === approvalId ? { ...a, status: "Approved" } : a))
    );
  };
  const handleReject = (approvalId) => {
    setApprovals((p) =>
      p.map((a) => (a.id === approvalId ? { ...a, status: "Rejected" } : a))
    );
  };

  // derived counts for small badges
  const pendingCount = useMemo(
    () => approvals.filter((a) => a.status === "Pending").length,
    [approvals]
  );
  const employeeCount = employees.length;

  return (
    <div className="text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Module</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage employees and approvals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Employees</div>
          <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-medium">
            {employeeCount}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {tabs.map((t) => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    active
                      ? "bg-[#1E90FF] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {t.label}
                  {t.id === "approvals" && pendingCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center text-xs font-semibold bg-red-500 text-white rounded-full px-2 py-0.5">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Add employee button visible on All Employees tab */}
          {activeTab === "all" && (
            <div>
              <button
                onClick={openAdd}
                className="bg-[#1E90FF] text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-[#1873cc] transition"
              >
                + Add Employee
              </button>
            </div>
          )}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "all" && (
            <section>
              {/* Employee table */}
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((emp) => (
                      <tr key={emp.id} className="border-t last:border-b">
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {emp.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                          {emp.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {emp.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {emp.role}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              emp.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                alert(`Edit ${emp.name} — implement edit later`)
                              }
                              className="text-sm text-[#1E90FF] hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {employees.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-8 text-center text-sm text-gray-500"
                        >
                          No employees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {activeTab === "approvals" && (
            <section>
              <div className="space-y-4">
                {approvals.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 border rounded-md flex items-start justify-between bg-white"
                  >
                    <div>
                      <div className="text-sm text-gray-600 font-medium">
                        {a.type}
                      </div>
                      <div className="text-sm text-gray-800 font-semibold">
                        {a.employee}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {a.details}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                        {a.status}
                      </span>
                      {a.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(a.id)}
                            className="px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(a.id)}
                            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                {approvals.length === 0 && (
                  <div className="text-sm text-gray-500">
                    No approvals found.
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeAdd} />

          <form
            onSubmit={handleAddSubmit}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add Employee</h2>
              <button
                type="button"
                onClick={closeAdd}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-gray-600">
                Employee ID
                <input
                  name="id"
                  value={newEmployee.id}
                  onChange={handleAddChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm outline-none"
                  placeholder="E005"
                  required
                />
              </label>

              <label className="text-xs text-gray-600">
                Name
                <input
                  name="name"
                  value={newEmployee.name}
                  onChange={handleAddChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm outline-none"
                  placeholder="Full name"
                  required
                />
              </label>

              <label className="text-xs text-gray-600">
                Email
                <input
                  name="email"
                  value={newEmployee.email}
                  onChange={handleAddChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm outline-none"
                  placeholder="email@example.com"
                  type="email"
                />
              </label>

              <label className="text-xs text-gray-600">
                Role
                <input
                  name="role"
                  value={newEmployee.role}
                  onChange={handleAddChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm outline-none"
                  placeholder="Role / Designation"
                />
              </label>

              <label className="text-xs text-gray-600 md:col-span-2">
                Status
                <select
                  name="status"
                  value={newEmployee.status}
                  onChange={handleAddChange}
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm outline-none"
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={closeAdd}
                className="px-4 py-2 rounded-md text-sm border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md text-sm bg-[#1E90FF] text-white hover:bg-[#1873cc]"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
