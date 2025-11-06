// app/dashboard/payroll/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";

/**
 * Simulated Payroll UI
 * - Tabs: Current Payroll, Previous Cycles, Salary Setup
 * - Sample employees (replace with HR API)
 * - "Process Payroll" simulates computing net pay and creates a paycycle entry
 * - Simple role simulation: set isPayrollAdmin to true to see admin actions
 */

const sampleEmployees = [
  {
    empId: "E001",
    name: "Asha Rao",
    bankAccount: "XXXX1111",
    salaryMonthly: 90000,
  },
  {
    empId: "E002",
    name: "Ravi Patel",
    bankAccount: "XXXX2222",
    salaryMonthly: 120000,
  },
  {
    empId: "E003",
    name: "Meera Singh",
    bankAccount: "XXXX3333",
    salaryMonthly: 60000,
  },
];

const samplePreviousCycles = [
  {
    cycleId: "2025-09",
    period: "September 2025",
    processedAt: "2025-09-30",
    payrollCount: 3,
    totalAmount: 270000,
  },
];

export default function PayrollPage() {
  // Toggle this in-code to simulate role access
  const isPayrollAdmin = true; // set false to hide admin actions

  const [employees, setEmployees] = useState(sampleEmployees);
  const [salaryEdits, setSalaryEdits] = useState({});
  const [activeTab, setActiveTab] = useState("current");
  const [previousCycles, setPreviousCycles] = useState(samplePreviousCycles);
  const [processing, setProcessing] = useState(false);

  // Simulated "current month" data (not yet processed)
  const currentMonth = useMemo(() => {
    const now = new Date();
    return `${now.toLocaleString("default", {
      month: "long",
    })} ${now.getFullYear()}`;
  }, []);

  // payroll status: map empId -> { status: 'Pending' | 'Processed', netPay, details }
  const [payrollStatus, setPayrollStatus] = useState(() =>
    Object.fromEntries(
      employees.map((e) => [
        e.empId,
        { status: "Pending", netPay: null, details: null },
      ])
    )
  );

  // sync payrollStatus when employees change (new hires)
  useEffect(() => {
    setPayrollStatus((prev) => {
      const out = { ...prev };
      for (const e of employees) {
        if (!out[e.empId]) {
          out[e.empId] = { status: "Pending", netPay: null, details: null };
        }
      }
      // remove entries of removed employees
      for (const k of Object.keys(out)) {
        if (!employees.find((x) => x.empId === k)) delete out[k];
      }
      return out;
    });
  }, [employees]);

  // Handlers for salary setup
  const handleSalaryChange = (empId, value) => {
    setSalaryEdits((s) => ({ ...s, [empId]: Number(value) || 0 }));
  };

  const saveSalaries = () => {
    // Save salary edits into employees state (in future -> API)
    setEmployees((prev) =>
      prev.map((p) => ({
        ...p,
        salaryMonthly: salaryEdits[p.empId] ?? p.salaryMonthly,
      }))
    );
    setSalaryEdits({});
    alert("Salaries updated (local only).");
  };

  // Simulate payroll processing
  const processPayroll = async () => {
    if (!isPayrollAdmin) {
      alert("You are not authorized to process payroll.");
      return;
    }

    if (
      !confirm(
        `Process payroll for ${currentMonth} for ${employees.length} employees?`
      )
    )
      return;

    setProcessing(true);

    // Fake compute: simple tax 10% + fixed deductions 2% and basic benefits 3%
    await new Promise((r) => setTimeout(r, 800)); // simulate latency

    const processedEntries = employees.map((e) => {
      const gross = e.salaryMonthly;
      const tax = Math.round(gross * 0.1);
      const deductions = Math.round(gross * 0.02);
      const benefits = Math.round(gross * 0.03);
      const net = gross - tax - deductions - benefits;
      return {
        empId: e.empId,
        name: e.name,
        gross,
        tax,
        deductions,
        benefits,
        net,
        bankAccount: e.bankAccount,
      };
    });

    // Update payrollStatus
    setPayrollStatus((prev) => {
      const next = { ...prev };
      for (const p of processedEntries) {
        next[p.empId] = { status: "Processed", netPay: p.net, details: p };
      }
      return next;
    });

    // Add previous cycle entry
    const totalAmount = processedEntries.reduce((s, x) => s + x.net, 0);
    const cycleId = `${new Date().getFullYear()}-${String(
      new Date().getMonth() + 1
    ).padStart(2, "0")}`;
    const newCycle = {
      cycleId,
      period: currentMonth,
      processedAt: new Date().toISOString().slice(0, 10),
      payrollCount: processedEntries.length,
      totalAmount,
      entries: processedEntries,
    };

    setPreviousCycles((p) => [newCycle, ...p]);

    setProcessing(false);
    alert(
      `Payroll processed for ${currentMonth}. Total net payout: ₹${totalAmount.toLocaleString()}`
    );
  };

  const viewPayslip = (empId, cycle) => {
    // Small simulated payslip popup
    const emp = cycle?.entries?.find((x) => x.empId === empId);
    if (!emp) {
      alert("Payslip data not found.");
      return;
    }
    const txt = `Payslip - ${cycle.period}\n\nEmployee: ${emp.name} (${emp.empId})\nGross: ₹${emp.gross}\nTax: ₹${emp.tax}\nDeductions: ₹${emp.deductions}\nBenefits: ₹${emp.benefits}\nNet: ₹${emp.net}\n\n(Export/payslip PDF can be implemented on the server.)`;
    // Using window.open + data URI for a quick text download
    const blob = new Blob([txt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    if (!win) alert(txt);
  };

  // helper: show current statuses counts
  const stats = useMemo(() => {
    const total = employees.length;
    const processed = Object.values(payrollStatus).filter(
      (s) => s.status === "Processed"
    ).length;
    const pending = total - processed;
    return { total, processed, pending };
  }, [employees.length, payrollStatus]);

  return (
    <div className="text-left">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll</h1>
          <p className="text-sm text-gray-600 mt-1">
            Process payroll, view previous cycles and manage salary setup.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">Current Period</div>
          <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-medium">
            {currentMonth}
          </div>
          <div className="text-sm text-gray-600">Employees</div>
          <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-medium">
            {stats.total}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Top controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("current")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "current"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Current Payroll
            </button>
            <button
              onClick={() => setActiveTab("previous")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "previous"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Previous Cycles
            </button>
            <button
              onClick={() => setActiveTab("setup")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "setup"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Salary Setup
            </button>
          </div>

          <div className="flex items-center gap-2">
            {isPayrollAdmin && activeTab === "current" && (
              <button
                onClick={processPayroll}
                disabled={processing}
                className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
              >
                {processing ? "Processing..." : "Process Payroll"}
              </button>
            )}
            <button
              onClick={() => {
                // quick export summary (simulated)
                const txt = `Payroll Summary - ${currentMonth}\nProcessed: ${stats.processed}\nPending: ${stats.pending}\nTotal Employees: ${stats.total}`;
                const blob = new Blob([txt], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `payroll-summary-${currentMonth}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-3 py-2 rounded-md border text-sm"
            >
              Export Summary
            </button>
          </div>
        </div>

        {/* Active tab content */}
        <div>
          {activeTab === "current" && (
            <div>
              {/* statuses */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-sm text-gray-700">Status:</div>
                <div className="text-sm">
                  Processed:{" "}
                  <span className="font-semibold">{stats.processed}</span>
                </div>
                <div className="text-sm">
                  Pending:{" "}
                  <span className="font-semibold">{stats.pending}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-4 py-2">Emp ID</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Gross</th>
                      <th className="px-4 py-2">Tax</th>
                      <th className="px-4 py-2">Deductions</th>
                      <th className="px-4 py-2">Benefits</th>
                      <th className="px-4 py-2">Net Pay</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {employees.map((e) => {
                      const st = payrollStatus[e.empId] || {
                        status: "Pending",
                        netPay: null,
                      };
                      const d = st.details;
                      return (
                        <tr key={e.empId} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{e.empId}</td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {e.name}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₹{(d?.gross ?? e.salaryMonthly).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₹{d?.tax?.toLocaleString() ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₹{d?.deductions?.toLocaleString() ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₹{d?.benefits?.toLocaleString() ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            ₹{d?.net?.toLocaleString() ?? "-"}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                st.status === "Processed"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {st.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div className="flex gap-2">
                              {st.status === "Processed" && (
                                <button
                                  onClick={() => {
                                    const latestCycle = previousCycles[0];
                                    if (latestCycle)
                                      viewPayslip(e.empId, latestCycle);
                                    else alert("No processed payslips yet.");
                                  }}
                                  className="text-sm text-[#1E90FF] hover:underline"
                                >
                                  View Payslip
                                </button>
                              )}
                              {isPayrollAdmin && st.status !== "Processed" && (
                                <button
                                  onClick={() => {
                                    // process single employee (simulate)
                                    if (
                                      !confirm(`Process payroll for ${e.name}?`)
                                    )
                                      return;
                                    processPayrollSingle(e.empId);
                                  }}
                                  className="text-sm text-green-600 hover:underline"
                                >
                                  Process
                                </button>
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

          {activeTab === "previous" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Previous Pay Cycles
              </h3>
              {previousCycles.length === 0 && (
                <div className="text-sm text-gray-500">No previous cycles.</div>
              )}
              <div className="space-y-3">
                {previousCycles.map((c) => (
                  <div
                    key={c.cycleId}
                    className="p-4 border rounded-md flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm font-medium">{c.period}</div>
                      <div className="text-xs text-gray-500">
                        {c.processedAt} • {c.payrollCount} employees • Total ₹
                        {c.totalAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          // quick view: show count and allow per-employee view
                          const list = c.entries
                            ? c.entries
                                .map(
                                  (e) => `${e.empId} ${e.name} — Net ₹${e.net}`
                                )
                                .join("\n")
                            : "No entries";
                          alert(`${c.period}\n\n${list}`);
                        }}
                        className="px-3 py-1 rounded-md border text-sm"
                      >
                        View Details
                      </button>

                      <button
                        onClick={() => {
                          // export CSV of cycle
                          if (!c.entries || c.entries.length === 0) {
                            alert("No entries to export");
                            return;
                          }
                          const rows = [
                            [
                              "EmpId",
                              "Name",
                              "Gross",
                              "Tax",
                              "Deductions",
                              "Benefits",
                              "Net",
                            ],
                          ];
                          c.entries.forEach((en) =>
                            rows.push([
                              en.empId,
                              en.name,
                              en.gross,
                              en.tax,
                              en.deductions,
                              en.benefits,
                              en.net,
                            ])
                          );
                          const csv = rows.map((r) => r.join(",")).join("\n");
                          const blob = new Blob([csv], { type: "text/csv" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `payroll-${c.cycleId}.csv`;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                        className="px-3 py-1 rounded-md bg-[#1E90FF] text-white text-sm"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "setup" && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Salary Setup</h3>

              <div className="text-sm text-gray-600 mb-4">
                Only payroll admins can edit salaries — HR should not have
                access (simulate with isPayrollAdmin flag).
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="text-left text-sm text-gray-600">
                      <th className="px-4 py-2">Emp ID</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Current Monthly Salary</th>
                      <th className="px-4 py-2">Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map((e) => (
                      <tr key={e.empId} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">{e.empId}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {e.name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          ₹{e.salaryMonthly.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {isPayrollAdmin ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder="Monthly salary"
                                value={salaryEdits[e.empId] ?? ""}
                                onChange={(ev) =>
                                  handleSalaryChange(e.empId, ev.target.value)
                                }
                                className="px-2 py-1 border rounded-md text-sm w-36"
                              />
                              <button
                                onClick={() => {
                                  // quick save single
                                  const val = salaryEdits[e.empId];
                                  if (!val) {
                                    alert("Enter salary value.");
                                    return;
                                  }
                                  setEmployees((prev) =>
                                    prev.map((p) =>
                                      p.empId === e.empId
                                        ? { ...p, salaryMonthly: Number(val) }
                                        : p
                                    )
                                  );
                                  setSalaryEdits((s) => {
                                    const copy = { ...s };
                                    delete copy[e.empId];
                                    return copy;
                                  });
                                  alert("Saved (local).");
                                }}
                                className="px-3 py-1 rounded-md bg-[#1E90FF] text-white text-sm"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No access
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {isPayrollAdmin && (
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={saveSalaries}
                      className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
                    >
                      Save All Edits
                    </button>
                    <button
                      onClick={() => setSalaryEdits({})}
                      className="px-3 py-2 rounded-md border"
                    >
                      Reset
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // helper: process single employee payroll (local simulation)
  function processPayrollSingle(empId) {
    const e = employees.find((x) => x.empId === empId);
    if (!e) return alert("Employee not found.");
    const gross = e.salaryMonthly;
    const tax = Math.round(gross * 0.1);
    const deductions = Math.round(gross * 0.02);
    const benefits = Math.round(gross * 0.03);
    const net = gross - tax - deductions - benefits;

    setPayrollStatus((p) => ({
      ...p,
      [empId]: {
        status: "Processed",
        netPay: net,
        details: { empId, name: e.name, gross, tax, deductions, benefits, net },
      },
    }));

    // add to the latest previousCycles entry or create a new temporary one (for demo)
    setPreviousCycles((prev) => {
      if (prev.length === 0) {
        const newCycle = {
          cycleId: "temp",
          period: currentMonth,
          processedAt: new Date().toISOString().slice(0, 10),
          payrollCount: 1,
          totalAmount: net,
          entries: [
            { empId, name: e.name, gross, tax, deductions, benefits, net },
          ],
        };
        return [newCycle, ...prev];
      } else {
        const first = prev[0];
        // update first
        const updatedFirst = {
          ...first,
          payrollCount: (first.payrollCount || 0) + 1,
          totalAmount: (first.totalAmount || 0) + net,
          entries: [
            ...(first.entries || []),
            { empId, name: e.name, gross, tax, deductions, benefits, net },
          ],
        };
        return [updatedFirst, ...prev.slice(1)];
      }
    });

    alert(`Processed payroll for ${e.name}: Net ₹${net}`);
  }
}
