// app/dashboard/hr/page.jsx
"use client";

import { useMemo, useState } from "react";
import Button from "../../components/Button";
import CustomTable from "../../components/CustomTable";
import CustomModalForm from "../../components/CustomModalForm";
import Header from "../../components/Header";
import EmployeeActions from "../../components/EmployeeActions";
import ApprovalCard from "../../components/ApprovalCard";
import { initialEmployees, initialApprovals } from "../../sampleData";

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

  const openAdd = () => setIsAddOpen(true);
  const closeAdd = () => setIsAddOpen(false);

  const handleAddSubmit = (formData) => {
    if (
      !formData?.id?.toString().trim() ||
      !formData?.name?.toString().trim()
    ) {
      return;
    }
    setEmployees((p) => [{ ...formData }, ...p]);
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

  const employeeColumns = [
    {
      key: "id",
      label: "ID",
      className: "px-5 py-3 text-left text-sm font-medium text-gray-700",
    },
    {
      key: "name",
      label: "Name",
      className: "px-5 py-3 text-left text-sm font-semibold text-gray-900",
    },
    {
      key: "email",
      label: "Email",
      className: "px-5 py-3 text-left text-sm text-gray-600",
    },
    {
      key: "role",
      label: "Role",
      className: "px-5 py-3 text-left text-sm text-gray-700",
    },
    {
      key: "status",
      label: "Status",
      className: "px-5 py-3 text-left text-sm",
      render: (row) => (
        <span
          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold select-none ${
            row.status === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const addEmployeeFields = [
    {
      name: "id",
      label: "Employee ID",
      type: "text",
      placeholder: "E005",
      required: true,
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Full name",
      required: true,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "email@example.com",
    },
    {
      name: "role",
      label: "Role",
      type: "text",
      placeholder: "Role / Designation",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      placeholder: "Select status",
      options: ["Active", "On Leave", "Inactive"],
      defaultValue: "Active",
      className: "md:col-span-2",
    },
  ];

  return (
    <div className="">
      <Header employeeCount={employeeCount} onAdd={openAdd} />

      <div
        className="bg-white rounded-3xl shadow-xl border border-gray-200 p-4"
        style={{ minHeight: "calc(100vh - 200px)" }}
      >
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

        <div
          className={`transition-all duration-400 ease-out ${
            animating
              ? "opacity-50 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
          style={{
            transitionProperty: "opacity, transform",
            overflow: "hidden",
          }}
        >
          {activeTab === "all" && (
            <section className="overflow-hidden rounded-xl border border-gray-200 shadow-inner">
              <div className="overflow-y-auto">
                <CustomTable
                  columns={[...employeeColumns]}
                  data={employees}
                  rowKey="id"
                  actions={(row) => (
                    <EmployeeActions
                      row={row}
                      onEdit={(r) =>
                        alert(`Edit ${r.name} — implement edit later`)
                      }
                      onDelete={(id) => handleDeleteEmployee(id)}
                    />
                  )}
                  actionsHeader="Actions"
                  actionsAlign="center"
                />
              </div>
            </section>
          )}

          {activeTab === "approvals" && (
            <section className="space-y-6">
              {approvals.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-10 select-none">
                  No approvals found.
                </div>
              )}

              {approvals.map((a) => (
                <ApprovalCard
                  key={a.id}
                  approval={a}
                  onApprove={(id) => handleApprove(id)}
                  onReject={(id) => handleReject(id)}
                />
              ))}
            </section>
          )}
        </div>
      </div>

      <CustomModalForm
        open={isAddOpen}
        onCancel={closeAdd}
        onSubmit={handleAddSubmit}
        title="Add Employee"
        submitLabel="Add Employee"
        fields={addEmployeeFields}
        initialData={{ status: "Active" }}
      />
    </div>
  );
}
