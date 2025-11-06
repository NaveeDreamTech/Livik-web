// app/dashboard/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderUser from './../components/HeaderUser';

/**
 * Admin Dashboard (overview)
 * - Shows summary cards, module quick links, recent activity and small tables
 * - Local sample data; replace with API calls when ready
 */

const sampleEmployees = [
  { empId: "E001", name: "Asha Rao", role: "Engineer", joined: "2024-01-15" },
  { empId: "E002", name: "Ravi Patel", role: "PM", joined: "2023-07-12" },
  {
    empId: "E003",
    name: "Meera Singh",
    role: "Designer",
    joined: "2025-03-02",
  },
  { empId: "E004", name: "Arjun Kumar", role: "HR", joined: "2022-10-28" },
];

const sampleLeaves = [
  {
    id: "L-1",
    emp: "Meera Singh",
    type: "CL",
    days: 2,
    status: "Pending",
    date: "2025-11-01",
  },
  {
    id: "L-2",
    emp: "Asha Rao",
    type: "PL",
    days: 1,
    status: "Approved",
    date: "2025-10-25",
  },
];

const samplePayrollCycles = [
  {
    cycleId: "2025-10",
    period: "Oct 2025",
    processedAt: "2025-10-31",
    totalNet: 225000,
  },
];

const sampleAssets = [
  {
    id: "ASSET-001",
    tag: "LT-2024-001",
    type: "Laptop",
    assignedTo: "E001",
    status: "Active",
  },
  {
    id: "ASSET-002",
    tag: "PH-2024-004",
    type: "Mobile",
    assignedTo: null,
    status: "Available",
  },
];

const sampleUsers = [
  { id: "U-1", name: "System SuperAdmin", role: "super-admin" },
  { id: "U-2", name: "Payroll Admin", role: "admin" },
];

export default function DashboardIndex() {
  const router = useRouter();

  // local state (replace with fetch from APIs)
  const [employees] = useState(sampleEmployees);
  const [leaves] = useState(sampleLeaves);
  const [payrollCycles] = useState(samplePayrollCycles);
  const [assets] = useState(sampleAssets);
  const [users] = useState(sampleUsers);

  // computed stats
  const stats = useMemo(() => {
    const pendingLeaves = leaves.filter((l) => l.status === "Pending").length;
    const latestPayrollPending = payrollCycles.length === 0 ? 0 : 0; // 0 means none pending (we show processed cycles)
    const assetsCount = assets.length;
    const usersCount = users.length;
    return {
      totalEmployees: employees.length,
      pendingLeaves,
      payrollPending: latestPayrollPending,
      assetsCount,
      usersCount,
    };
  }, [employees, leaves, payrollCycles, assets, users]);

  // sample recent activity
  const recentActivity = [
    {
      id: 1,
      text: "New employee added: Meera Singh (E003)",
      time: "2 days ago",
    },
    { id: 2, text: "Payroll processed for Sep 2025", time: "5 days ago" },
    { id: 3, text: "Asset LT-2024-001 assigned to E001", time: "6 days ago" },
    { id: 4, text: "New admin created: Payroll Admin", time: "10 days ago" },
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">
            Overview of system health and activities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="px-3 py-2 rounded-md border text-sm"
          >
            Sign out
          </button>
          <Link
            href="/dashboard/admin"
            className="px-3 py-2 rounded-md bg-[#1E90FF] text-white text-sm"
          >
            Admin Panel
          </Link>
        </div>
      </div>

      {/* top summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Employees"
          value={stats.totalEmployees}
          subtitle="Total active employees"
          to="/dashboard/hr"
        />
        <SummaryCard
          title="Pending Leaves"
          value={stats.pendingLeaves}
          subtitle="Requests awaiting approval"
          to="/dashboard/hr"
        />
        <SummaryCard
          title="Payroll"
          value={payrollCycles.length}
          subtitle="Recent payroll cycles"
          to="/dashboard/payroll"
        />
        <SummaryCard
          title="Assets"
          value={stats.assetsCount}
          subtitle="Tracked assets"
          to="/dashboard/asset"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* left: quick actions & modules */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModuleCard
                title="HR Module"
                description="Manage employees, leaves and personal data."
                to="/dashboard/hr"
                stats={{
                  employees: employees.length,
                  pendingLeaves: leaves.length,
                }}
              />
              <ModuleCard
                title="Payroll"
                description="Configure salaries and process payroll runs."
                to="/dashboard/payroll"
                stats={{ cycles: payrollCycles.length }}
              />
              <ModuleCard
                title="Asset Tracking"
                description="Track company assets and assignments."
                to="/dashboard/asset"
                stats={{ assets: assets.length }}
              />
              <ModuleCard
                title="Admin Panel"
                description="Manage system users and permissions."
                to="/dashboard/admin"
                stats={{ users: users.length }}
              />
            </div>
          </div>

          {/* recent hires */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Recent Hires</h3>
              <Link href="/dashboard/hr" className="text-sm text-[#1E90FF]">
                View all
              </Link>
            </div>

            <div className="divide-y">
              {employees.slice(0, 4).map((e) => (
                <div
                  key={e.empId}
                  className="py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{e.name}</div>
                    <div className="text-xs text-gray-500">
                      {e.role} • Joined {e.joined}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">{e.empId}</div>
                </div>
              ))}
            </div>
          </div>

          {/* recent payroll runs */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Payroll Activity</h3>
              <Link
                href="/dashboard/payroll"
                className="text-sm text-[#1E90FF]"
              >
                Go to payroll
              </Link>
            </div>

            <div className="space-y-3">
              {payrollCycles.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No payroll cycles yet.
                </div>
              ) : (
                payrollCycles.map((c) => (
                  <div
                    key={c.cycleId}
                    className="p-3 border rounded-md flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{c.period}</div>
                      <div className="text-xs text-gray-500">
                        Processed: {c.processedAt}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{c.totalNet.toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* right column: activity + assets snapshot */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {recentActivity.map((a) => (
                <li key={a.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1E90FF] mt-2" />
                  <div>
                    <div className="font-medium">{a.text}</div>
                    <div className="text-xs text-gray-500">{a.time}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Assets Snapshot</h3>
              <Link href="/dashboard/asset" className="text-sm text-[#1E90FF]">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {assets.slice(0, 5).map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <div className="font-medium">{a.assetTag}</div>
                    <div className="text-xs text-gray-500">
                      {a.type} • {a.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {a.assignedTo ?? "Unassigned"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- Small presentational components ----------------- */

function SummaryCard({ title, value, subtitle, to }) {
  return (
    <Link href={to ?? "#"} className="block">
      <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
          {subtitle && (
            <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
          )}
        </div>
        <div className="text-3xl text-gray-200">▦</div>
      </div>
    </Link>
  );
}

function ModuleCard({ title, description, to, stats = {} }) {
  return (
    <Link href={to} className="block">
      <div className="border rounded-lg p-4 h-full hover:shadow-md transition bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-semibold">{title}</div>
            <div className="text-xs text-gray-500 mt-1">{description}</div>
          </div>
          <div className="text-xs text-gray-400">{/* icon placeholder */}</div>
        </div>

        <div className="mt-4 flex items-center gap-3 flex-wrap">
          {Object.keys(stats).map((k) => (
            <div
              key={k}
              className="bg-white border px-3 py-1 rounded-full text-xs text-gray-700"
            >
              {k}: <strong className="ml-1">{stats[k]}</strong>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <button className="px-3 py-2 rounded-md bg-[#1E90FF] text-white text-sm">
            Open
          </button>
        </div>
      </div>
    </Link>
  );
}
