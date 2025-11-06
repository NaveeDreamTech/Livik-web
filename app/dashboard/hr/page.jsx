"use client";

import { useMemo, useState } from "react";

const initialEmployees = [
  {
    id: "E001",
    name: "Ashaa Rao",
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
  const [animating, setAnimating] = useState(false);
  const [pendingTab, setPendingTab] = useState(null);

  const [employees, setEmployees] = useState(initialEmployees);
  const [approvals, setApprovals] = useState(initialApprovals);

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

  const pendingCount = useMemo(
    () => approvals.filter((a) => a.status === "Pending").length,
    [approvals]
  );
  const employeeCount = employees.length;

  const handleTabSwitch = (tabId) => {
    if (tabId === activeTab) return;
    setAnimating(true);
    setPendingTab(tabId);
    setTimeout(() => {
      setActiveTab(tabId);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="">
      {/* Header with distinct bg */}
      <header className="bg-white rounded-lg shadow-md p-2 mb-4 border border-gray-200">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="rounded-md bg-blue-100 p-3 shadow">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-4-4h-1M7 20H2v-2a4 4 0 014-4h1m0 0a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide leading-tight">
                HR Module
              </h1>
              <p className="text-gray-600 mt-1 text-lg font-medium">
                Manage employees, approvals, and quick actions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Active employees
              </span>
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
                {employeeCount}
              </span>
            </div>
            <button
              onClick={openAdd}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:ring-4 focus:ring-blue-300 text-white px-6 py-3 rounded-3xl text-base font-semibold shadow-xl transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Employee
            </button>
          </div>
        </div>
      </header>

      {/* Card container with distinct bg */}
      <div
        className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4"
        style={{ minHeight: "calc(100vh - 200px)" }} // keeps card roughly full height minus header/padding
      >
        {/* Tabs with bg difference and tighter padding */}
        {/* <nav
          role="tablist"
          aria-label="HR tabs"
          className="flex space-x-3 border-b border-gray-300 mb-6 bg-gray-200 rounded-t-3xl px-4 py-2"
        >
          {tabs.map((t) => {
            const active = activeTab === t.id && !animating;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => handleTabSwitch(t.id)}
                className={`flex items-center gap-2 px-5 py-2 rounded-3xl font-semibold text-sm transition ${
                  active
                    ? "bg-blue-600 text-white shadow-md shadow-blue-400/40"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
                disabled={animating}
              >
                {t.label}
                {t.id === "approvals" && pendingCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-red-200 text-red-900 font-semibold text-xs shadow select-none">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav> */}

        <nav
          role="tablist"
          aria-label="HR tabs"
          className="flex space-x-1 border-b border-gray-300 mb-6 px-2 bg-transparent"
        >
          {tabs.map((t) => {
            const active = activeTab === t.id && !animating;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={active}
                onClick={() => handleTabSwitch(t.id)}
                className={`relative flex items-center gap-2 px-5 py-2 font-semibold text-base transition
          rounded-t-xl
          ${
            active
              ? "bg-[#e7f0fa] text-[#173469] border-b-4 border-[#173469]"
              : "bg-transparent text-gray-500 border-b-4 border-transparent hover:text-[#173469] hover:bg-[#e7f0fa]"
          }
        `}
                disabled={animating}
                style={{
                  outline: "none",
                  boxShadow: "none",
                }}
              >
                {t.label}
                {t.id === "approvals" && pendingCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#ffd6db] text-[#9b303d] font-bold text-xs">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Animated tab content */}
        <div
          className={`transition-all duration-400 ease-out ${
            animating
              ? "opacity-50 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            //maxHeight: "calc(100vh - 320px)",
            overflow: "hidden",
          }}
        >
          {activeTab === "all" && (
            <section className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
              <div className="overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none">
                        ID
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none">
                        Name
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none">
                        Email
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none">
                        Role
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide select-none">
                        Status
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide select-none">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((emp) => (
                      <tr
                        key={emp.id}
                        className="hover:bg-gray-50 transition-colors cursor-default"
                      >
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                          {emp.id}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {emp.name}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                          {emp.email}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-700">
                          {emp.role}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold select-none ${
                              emp.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-right text-sm font-medium space-x-6">
                          <button
                            onClick={() =>
                              alert(`Edit ${emp.name} — implement edit later`)
                            }
                            className="text-blue-600 hover:text-blue-800 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="text-red-600 hover:text-red-800 transition"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {employees.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-12 text-sm text-gray-500 select-none"
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
            <section className="space-y-6">
              {approvals.map((a) => (
                <div
                  key={a.id}
                  className="p-5 border border-gray-200 rounded-xl shadow-sm flex justify-between bg-white hover:shadow-md transition cursor-default"
                >
                  <div>
                    <div className="text-gray-600 font-medium text-base select-text">
                      {a.type}
                    </div>
                    <div className="text-gray-900 font-semibold text-lg select-text">
                      {a.employee}
                    </div>
                    <div className="text-gray-500 mt-1 text-sm select-text">
                      {a.details}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="inline-block text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium select-none">
                      {a.status}
                    </span>

                    {a.status === "Pending" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(a.id)}
                          className="px-5 py-1 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(a.id)}
                          className="px-5 py-1 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {approvals.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-10 select-none">
                  No approvals found.
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      {/* Add Employee Modal (unchanged) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={closeAdd} />

          <form
            onSubmit={handleAddSubmit}
            className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Add Employee
              </h2>
              <button
                type="button"
                onClick={closeAdd}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="text-xs text-gray-600">
                Employee ID
                <input
                  name="id"
                  value={newEmployee.id}
                  onChange={handleAddChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Role / Designation"
                />
              </label>

              <label className="text-xs text-gray-600 md:col-span-2">
                Status
                <select
                  name="status"
                  value={newEmployee.status}
                  onChange={handleAddChange}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
                >
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>

            <div className="flex items-center justify-end gap-4 mt-8">
              <button
                type="button"
                onClick={closeAdd}
                className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
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
