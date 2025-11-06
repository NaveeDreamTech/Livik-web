// app/dashboard/employee_portal/page.jsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

/**
 * Employee Portal (updated)
 *
 * - Header uses a dark translucent banner so text is visible over gradient.
 * - Company Holidays moved into Leave Request tab.
 * - Removed Quick Actions.
 * - Pending leave requests can be deleted by employee.
 * - Employee card includes avatar, designation, DOJ and email.
 *
 * Local state only. Replace with API calls as needed.
 */

/* ---------- Config / Mock data ---------- */
const AVATAR_SRC = "/asset/avatar.png"; // adjust if your avatar path is different

const currentUser = {
  empId: "E010",
  name: "Kiran Das",
  email: "kiran.das@example.com",
  designation: "Software Engineer",
  doj: "2021-04-15",
  // module read permissions (controls nav visibility)
  permissions: {
    HR: { read: true, edit: false, delete: false },
    Payroll: { read: true, edit: false, delete: false },
    "Asset Tracking": { read: false },
  },
};

const initialPersonal = {
  basic: {
    empId: currentUser.empId,
    name: currentUser.name,
    dob: "1990-05-24",
    phone: "+91-98765-43210",
    email: currentUser.email,
  },
  bank: {
    bankName: "State Bank",
    accountNumber: "XXXX1111",
    ifsc: "SBIN0000001",
  },
  address: {
    present: "12/4 MG Road, Mumbai, Maharashtra",
    permanent: "12/4 MG Road, Mumbai, Maharashtra",
  },
  proofs: [
    { type: "Aadhar", number: "XXXX-XXXX-1234" },
    { type: "PAN", number: "ABCDE1234F" },
  ],
};

const initialLeaves = {
  clBalance: 7, // casual leave
  requests: [
    {
      id: "L-1",
      from: "2025-10-10",
      to: "2025-10-12",
      days: 3,
      type: "CL",
      status: "Approved",
      appliedAt: "2025-09-20",
    },
    {
      id: "L-2",
      from: "2025-11-02",
      to: "2025-11-02",
      days: 1,
      type: "CL",
      status: "Pending",
      appliedAt: "2025-10-20",
    },
  ],
};

const samplePayslips = [
  { id: "P-2025-08", period: "Aug 2025", date: "2025-08-31", net: 75000 },
  { id: "P-2025-07", period: "Jul 2025", date: "2025-07-31", net: 75000 },
];

const companyHolidays = [
  { date: "2025-01-26", name: "Republic Day" },
  { date: "2025-08-15", name: "Independence Day" },
  { date: "2025-10-02", name: "Gandhi Jayanti" },
];

/* ---------- Component ---------- */
export default function EmployeePortalPage() {
  const [activeTab, setActiveTab] = useState("personal");
  const [personalTab, setPersonalTab] = useState("basic");

  const [personalData, setPersonalData] = useState(initialPersonal);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [payslips] = useState(samplePayslips);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    from: "",
    to: "",
    days: 1,
    type: "CL",
    reason: "",
  });

  // avatar fallback
  const [avatarError, setAvatarError] = useState(false);

  const moduleNav = useMemo(() => {
    return Object.keys(currentUser.permissions || {}).filter(
      (m) => currentUser.permissions[m]?.read
    );
  }, []);

  /* ---------- Helpers ---------- */
  const updatePersonalField = (section, key, value) => {
    setPersonalData((p) => ({
      ...p,
      [section]: { ...p[section], [key]: value },
    }));
  };

  const addProof = (proof) => {
    setPersonalData((p) => ({ ...p, proofs: [...p.proofs, proof] }));
  };
  const removeProof = (idx) => {
    setPersonalData((p) => ({
      ...p,
      proofs: p.proofs.filter((_, i) => i !== idx),
    }));
  };

  const openLeaveModal = () => {
    setLeaveForm({ from: "", to: "", days: 1, type: "CL", reason: "" });
    setIsLeaveModalOpen(true);
  };
  const closeLeaveModal = () => setIsLeaveModalOpen(false);

  const submitLeaveRequest = (e) => {
    e.preventDefault();
    if (!leaveForm.from || !leaveForm.to)
      return alert("Select from and to dates.");
    const id = `L-${Date.now().toString().slice(-6)}`;
    const req = {
      id,
      from: leaveForm.from,
      to: leaveForm.to,
      days: Number(leaveForm.days),
      type: leaveForm.type,
      status: "Pending",
      appliedAt: new Date().toISOString().slice(0, 10),
      reason: leaveForm.reason,
    };
    setLeaves((l) => ({ ...l, requests: [req, ...l.requests] }));
    setIsLeaveModalOpen(false);
    alert("Leave request submitted (local).");
  };

  const deleteLeaveRequest = (id) => {
    if (!confirm("Delete pending leave request?")) return;
    setLeaves((l) => ({
      ...l,
      requests: l.requests.filter((r) => r.id !== id),
    }));
  };

  const downloadPayslip = (p) => {
    const text = `Payslip: ${p.period}\nEmployee: ${currentUser.name} (${currentUser.empId})\nNet Pay: ₹${p.net}\nDate: ${p.date}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `payslip-${p.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="text-left">
      {/* Header banner (dark translucent so text is visible on gradient background) */}
      <div className="mb-6">
        <div
          className="rounded-xl px-6 py-4"
          style={{
            background:
              "linear-gradient(90deg, rgba(2,6,23,0.55), rgba(8,20,25,0.55))",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-white">
                Employee Portal
              </h1>
              <div className="mt-1 text-sm text-white/90">
                {currentUser.name} •{" "}
                <span className="font-medium">{currentUser.empId}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {moduleNav.map((m) => (
                <a
                  key={m}
                  href={`/dashboard/${m.toLowerCase().replace(/\s+/g, "")}`}
                  className="px-3 py-1 rounded-md bg-white text-sm font-medium text-gray-800 hover:opacity-95"
                >
                  {m}
                </a>
              ))}

              <div className="bg-white px-3 py-1 rounded-full shadow text-sm font-medium text-gray-800">
                {currentUser.empId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* portal main card */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* tabs */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "personal"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Personal Details
            </button>
            <button
              onClick={() => setActiveTab("leave")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "leave"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Leave Request
            </button>
            <button
              onClick={() => setActiveTab("payslips")}
              className={`px-3 py-2 rounded-md text-sm ${
                activeTab === "payslips"
                  ? "bg-[#1E90FF] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Payslips
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Logged in as <strong>{currentUser.name}</strong>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left / Main */}
          <div className="md:col-span-2">
            {/* Personal Details tab */}
            {activeTab === "personal" && (
              <>
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPersonalTab("basic")}
                      className={`px-3 py-2 rounded-md text-sm ${
                        personalTab === "basic"
                          ? "bg-[#1E90FF] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Basic
                    </button>
                    <button
                      onClick={() => setPersonalTab("bank")}
                      className={`px-3 py-2 rounded-md text-sm ${
                        personalTab === "bank"
                          ? "bg-[#1E90FF] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Bank
                    </button>
                    <button
                      onClick={() => setPersonalTab("address")}
                      className={`px-3 py-2 rounded-md text-sm ${
                        personalTab === "address"
                          ? "bg-[#1E90FF] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Address
                    </button>
                    <button
                      onClick={() => setPersonalTab("proofs")}
                      className={`px-3 py-2 rounded-md text-sm ${
                        personalTab === "proofs"
                          ? "bg-[#1E90FF] text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      Proofs
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  {personalTab === "basic" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Basic Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="text-xs text-gray-600">
                          Employee ID
                          <input
                            readOnly
                            value={personalData.basic.empId}
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm bg-white"
                          />
                        </label>
                        <label className="text-xs text-gray-600">
                          Name
                          <input
                            value={personalData.basic.name}
                            onChange={(e) =>
                              updatePersonalField(
                                "basic",
                                "name",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </label>

                        <label className="text-xs text-gray-600">
                          Date of Birth
                          <input
                            type="date"
                            value={personalData.basic.dob}
                            onChange={(e) =>
                              updatePersonalField(
                                "basic",
                                "dob",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </label>

                        <label className="text-xs text-gray-600">
                          Phone
                          <input
                            value={personalData.basic.phone}
                            onChange={(e) =>
                              updatePersonalField(
                                "basic",
                                "phone",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </label>

                        <label className="text-xs text-gray-600 md:col-span-2">
                          Email
                          <input
                            value={personalData.basic.email}
                            onChange={(e) =>
                              updatePersonalField(
                                "basic",
                                "email",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            setPersonalData(initialPersonal);
                            alert("Reset (local)");
                          }}
                          className="px-4 py-2 rounded-md border text-sm"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() =>
                            alert("Saved (local). Replace with API")
                          }
                          className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  {personalTab === "bank" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Bank Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <label className="text-xs text-gray-600">
                          Bank Name
                          <input
                            value={personalData.bank.bankName}
                            onChange={(e) =>
                              updatePersonalField(
                                "bank",
                                "bankName",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </label>
                        <label className="text-xs text-gray-600">
                          Account Number
                          <input
                            value={personalData.bank.accountNumber}
                            onChange={(e) =>
                              updatePersonalField(
                                "bank",
                                "accountNumber",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </label>
                        <label className="text-xs text-gray-600">
                          IFSC
                          <input
                            value={personalData.bank.ifsc}
                            onChange={(e) =>
                              updatePersonalField(
                                "bank",
                                "ifsc",
                                e.target.value
                              )
                            }
                            className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          />
                        </label>
                      </div>

                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                          onClick={() => setPersonalData(initialPersonal)}
                          className="px-4 py-2 rounded-md border text-sm"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => alert("Saved bank details (local).")}
                          className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  {personalTab === "address" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Address Details
                      </h3>
                      <label className="text-xs text-gray-600">
                        Present Address
                        <textarea
                          value={personalData.address.present}
                          onChange={(e) =>
                            updatePersonalField(
                              "address",
                              "present",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          rows={3}
                        />
                      </label>

                      <label className="text-xs text-gray-600 mt-3">
                        Permanent Address
                        <textarea
                          value={personalData.address.permanent}
                          onChange={(e) =>
                            updatePersonalField(
                              "address",
                              "permanent",
                              e.target.value
                            )
                          }
                          className="mt-1 w-full px-3 py-2 border rounded-md text-sm"
                          rows={3}
                        />
                      </label>

                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                          onClick={() => setPersonalData(initialPersonal)}
                          className="px-4 py-2 rounded-md border text-sm"
                        >
                          Reset
                        </button>
                        <button
                          onClick={() => alert("Saved address (local).")}
                          className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  )}

                  {personalTab === "proofs" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        Proof Documents
                      </h3>

                      <div className="space-y-3">
                        {personalData.proofs.map((p, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between gap-3 p-3 border rounded-md"
                          >
                            <div>
                              <div className="text-sm font-medium">
                                {p.type}
                              </div>
                              <div className="text-xs text-gray-500">
                                {p.number}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  alert("Download placeholder (implement API)")
                                }
                                className="text-sm text-[#1E90FF]"
                              >
                                Download
                              </button>
                              <button
                                onClick={() => removeProof(i)}
                                className="text-sm text-red-600"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}

                        <div className="pt-2">
                          <label className="text-xs text-gray-600 block mb-2">
                            Add Proof (mock)
                          </label>
                          <div className="flex gap-2">
                            <input
                              placeholder="Type e.g. Aadhar"
                              id="pf-type"
                              className="px-3 py-2 border rounded-md text-sm"
                            />
                            <input
                              placeholder="Number"
                              id="pf-num"
                              className="px-3 py-2 border rounded-md text-sm"
                            />
                            <button
                              onClick={() => {
                                const t = document
                                  .getElementById("pf-type")
                                  .value.trim();
                                const n = document
                                  .getElementById("pf-num")
                                  .value.trim();
                                if (!t || !n)
                                  return alert("Enter type & number");
                                addProof({ type: t, number: n });
                                document.getElementById("pf-type").value = "";
                                document.getElementById("pf-num").value = "";
                              }}
                              className="px-3 py-2 rounded-md bg-[#1E90FF] text-white text-sm"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Leave Request tab */}
            {activeTab === "leave" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Leave Requests</h3>
                  <div>
                    <button
                      onClick={openLeaveModal}
                      className="px-3 py-2 rounded-md bg-[#1E90FF] text-white text-sm"
                    >
                      + Raise Leave
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-5">
                  <div className="mb-4">
                    <div className="text-sm text-gray-600">
                      Casual Leave (CL) Balance
                    </div>
                    <div className="text-2xl font-semibold">
                      {leaves.clBalance} days
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Your Requests</h4>
                    <div className="space-y-2">
                      {leaves.requests.length === 0 && (
                        <div className="text-sm text-gray-500">
                          No leave requests.
                        </div>
                      )}
                      {leaves.requests.map((r) => (
                        <div
                          key={r.id}
                          className="p-3 border rounded-md flex items-center justify-between"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {r.type} • {r.from} → {r.to} ({r.days} day
                              {r.days > 1 ? "s" : ""})
                            </div>
                            <div className="text-xs text-gray-500">
                              Applied: {r.appliedAt}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                r.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : r.status === "Approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {r.status}
                            </span>

                            {/* allow delete only for pending requests */}
                            {r.status === "Pending" && (
                              <button
                                onClick={() => deleteLeaveRequest(r.id)}
                                className="text-sm text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payslips tab */}
            {activeTab === "payslips" && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Payslips</h3>
                <div className="bg-gray-50 rounded-xl p-5">
                  {payslips.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No payslips available.
                    </div>
                  )}
                  <div className="space-y-2">
                    {payslips.map((p) => (
                      <div
                        key={p.id}
                        className="p-3 border rounded-md flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-medium">{p.period}</div>
                          <div className="text-xs text-gray-500">
                            Processed: {p.date}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-medium">
                            ₹{p.net.toLocaleString()}
                          </div>
                          <button
                            onClick={() => downloadPayslip(p)}
                            className="px-3 py-1 rounded-md bg-[#1E90FF] text-white text-sm"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column: Employee Card + Holidays (Holidays visible only on Leave tab) */}
          <aside className="space-y-4">
            {/* Employee Card with avatar and job details */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                  {!avatarError ? (
                    <Image
                      src={AVATAR_SRC}
                      alt="avatar"
                      width={64}
                      height={64}
                      className="object-cover"
                      onError={() => setAvatarError(true)}
                      priority
                    />
                  ) : (
                    // fallback: initials SVG
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-200 text-gray-700 font-semibold">
                      {currentUser.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-sm text-gray-500">EMPLOYEE</div>
                  <div className="mt-1 font-semibold">{currentUser.name}</div>
                  <div className="text-xs text-gray-500">
                    {currentUser.empId}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    {currentUser.email}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm space-y-1">
                <div>
                  <span className="text-xs text-gray-500">Designation</span>
                  <div className="font-medium">{currentUser.designation}</div>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Date of Joining</span>
                  <div className="font-medium">{currentUser.doj}</div>
                </div>
              </div>
            </div>

            {/* Company Holidays (show only on Leave tab) */}
            {activeTab === "leave" && (
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">Company Holidays</div>
                  <div className="text-xs text-gray-500">2025</div>
                </div>
                <ul className="text-sm text-gray-700 space-y-2">
                  {companyHolidays.map((h) => (
                    <li
                      key={h.date}
                      className="flex items-center justify-between"
                    >
                      <div>{h.name}</div>
                      <div className="text-xs text-gray-500">{h.date}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Raise Leave Modal */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeLeaveModal}
          />
          <form
            onSubmit={submitLeaveRequest}
            className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Raise Leave Request</h2>
              <button
                type="button"
                onClick={closeLeaveModal}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-gray-600">
                From
                <input
                  type="date"
                  value={leaveForm.from}
                  onChange={(e) =>
                    setLeaveForm((p) => ({ ...p, from: e.target.value }))
                  }
                  className="mt-1 px-3 py-2 border rounded-md text-sm w-full"
                />
              </label>

              <label className="text-xs text-gray-600">
                To
                <input
                  type="date"
                  value={leaveForm.to}
                  onChange={(e) =>
                    setLeaveForm((p) => ({ ...p, to: e.target.value }))
                  }
                  className="mt-1 px-3 py-2 border rounded-md text-sm w-full"
                />
              </label>

              <label className="text-xs text-gray-600">
                Days
                <input
                  type="number"
                  min="1"
                  value={leaveForm.days}
                  onChange={(e) =>
                    setLeaveForm((p) => ({
                      ...p,
                      days: Number(e.target.value) || 1,
                    }))
                  }
                  className="mt-1 px-3 py-2 border rounded-md text-sm w-full"
                />
              </label>

              <label className="text-xs text-gray-600">
                Type
                <select
                  value={leaveForm.type}
                  onChange={(e) =>
                    setLeaveForm((p) => ({ ...p, type: e.target.value }))
                  }
                  className="mt-1 px-3 py-2 border rounded-md text-sm w-full"
                >
                  <option>CL</option>
                  <option>PL</option>
                  <option>SL</option>
                </select>
              </label>

              <label className="text-xs text-gray-600 md:col-span-2">
                Reason
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) =>
                    setLeaveForm((p) => ({ ...p, reason: e.target.value }))
                  }
                  className="mt-1 px-3 py-2 border rounded-md text-sm w-full"
                  rows={3}
                />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeLeaveModal}
                className="px-4 py-2 rounded-md text-sm border"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-[#1E90FF] text-white"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
