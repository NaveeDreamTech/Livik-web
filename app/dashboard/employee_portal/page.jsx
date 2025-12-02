// app/dashboard/employee_portal/page.jsx
"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

/* ---------- Config / Mock data ---------- */
const AVATAR_SRC = "/asset/avatar.png";

const currentUser = {
  empId: "E010",
  name: "Kiran Das",
  email: "kiran.das@example.com",
  designation: "Software Engineer",
  doj: "2021-04-15",
  permissions: {
    HR: { read: true },
    Payroll: { read: true },
  },
};

const initialPersonal = {
  basic: {
    empId: currentUser.empId,
    firstName: currentUser.name.split(" ")[0] ?? "",
    lastName: currentUser.name.split(" ").slice(1).join(" ") ?? "",
    dob: "1990-05-24",
    gender: "Male",
    aadhaarNumber: "123412341234",
    panNumber: "ABCDE1234F",
    phone: "+91-98765-43210",
    emergencyContact: "+91-98765-00000",
    email: currentUser.email,
    photo: "",
    bloodGroup: "A+",
  },
  address: {
    present: "12/4 MG Road, Mumbai, Maharashtra",
    permanent: "12/4 MG Road, Mumbai, Maharashtra",
  },
  bank: {
    bankName: "State Bank",
    accountNumber: "XXXX1111",
    ifsc: "SBIN0000001",
  },
  employment: {
    designation: currentUser.designation,
    department: "Engineering",
    dateOfJoining: currentUser.doj,
    workLocation: "Mumbai",
  },
  proofs: [
    { type: "Aadhar", number: "XXXX-XXXX-1234" },
    { type: "PAN", number: "ABCDE1234F" },
  ],
  payroll: {
    year: new Date().getFullYear(),
    history: [
      {
        id: "ver_2024_04",
        effectiveYear: new Date().getFullYear() - 1,
        effectiveMonth: 4,
        components: [
          { id: "basic", group: "Basic", name: "Basic Salary", amount: 28000 },
          { id: "hra", group: "HRA", name: "House Rent Allowance", amount: 7000 },
          { id: "allow1", group: "Allowances", name: "Conveyance", amount: 800 },
          { id: "ded1", group: "Deductions", name: "Professional Tax", amount: 200 },
        ],
      },
      {
        id: "ver_2025_01",
        effectiveYear: new Date().getFullYear(),
        effectiveMonth: 1,
        components: [
          { id: "basic", group: "Basic", name: "Basic Salary", amount: 30000 },
          { id: "hra", group: "HRA", name: "House Rent Allowance", amount: 8000 },
          { id: "allow1", group: "Allowances", name: "Conveyance", amount: 900 },
          { id: "ded1", group: "Deductions", name: "Professional Tax", amount: 250 },
        ],
      },
    ],
    payslips: [],
  },
};

const initialLeaves = {
  clBalance: 7,
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

/* ---------- Small UI helpers (HR-style tabs) ---------- */

function HRTabs({ tabs, active, onChange }) {
  return (
    <nav
      role="tablist"
      aria-label="HR-style tabs"
      className="flex space-x-1 border-b border-gray-300 mb-4 px-2 bg-transparent"
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={`relative flex items-center gap-2 px-5 py-2 font-semibold text-base transition rounded-t-xl ${
              isActive
                ? "bg-[#e7f0fa] text-[#173469] border-b-4 border-[#173469]"
                : "bg-transparent text-gray-500 border-b-4 border-transparent hover:text-[#173469] hover:bg-[#e7f0fa]"
            }`}
            style={{ outline: "none", boxShadow: "none" }}
          >
            {t.label}
            {t.count ? (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#ffd6db] text-[#9b303d] font-bold text-xs">
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function SimpleModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="px-3 py-1 rounded hover:bg-gray-100">
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ---------- Component ---------- */

export default function EmployeePortalPage() {
  const [activeTab, setActiveTab] = useState("personal"); // personal | leave | payroll
  const [personalTab, setPersonalTab] = useState("basic"); // basic | bank | employment | address | proofs

  const [personalData, setPersonalData] = useState(initialPersonal);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [payslipsLocal] = useState(samplePayslips);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ from: "", to: "", days: 1, type: "CL", reason: "" });
  const [avatarError, setAvatarError] = useState(false);

  // payroll data helpers (view-only)
  const payrollFromData = personalData.payroll || {};
  const componentsHistory = payrollFromData.history && payrollFromData.history.length ? payrollFromData.history.slice() : [];

  // sort history ascending by effective date
  componentsHistory.sort((a, b) => {
    const da = new Date(a.effectiveYear, (a.effectiveMonth || 1) - 1, 1);
    const db = new Date(b.effectiveYear, (b.effectiveMonth || 1) - 1, 1);
    return da - db;
  });

  // build effective options
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const effectiveOptions = componentsHistory.map((h) => ({
    id: h.id,
    year: h.effectiveYear,
    month: h.effectiveMonth || 1,
    label: `${monthNames[(h.effectiveMonth || 1) - 1]} ${h.effectiveYear}`,
  }));

  const currentYear = new Date().getFullYear();
  const payrollYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // Payroll state (view-only)
  const [selectedEffectiveId, setSelectedEffectiveId] = useState(effectiveOptions.length ? effectiveOptions[effectiveOptions.length - 1].id : null);
  const componentsForSelectedEffective = componentsHistory.find((h) => h.id === selectedEffectiveId)?.components || (componentsHistory[0]?.components || []);

  const totalGrossEffective = componentsForSelectedEffective.reduce((s, c) => s + Number(c.amount || 0), 0);
  const deductionsEffective = componentsForSelectedEffective
    .filter((c) => (c.group || "").toLowerCase().includes("deduct"))
    .reduce((s, c) => s + Number(c.amount || 0), 0);
  const netEffective = totalGrossEffective - deductionsEffective;
  const ctcEffective = totalGrossEffective * 12;

  // payslips per selected year
  const [selectedPayslipYear, setSelectedPayslipYear] = useState(payrollFromData.year || currentYear);

  const findComponentsEffectiveAt = (year, month = 1) => {
    const target = new Date(year, month - 1, 1);
    let chosen = null;
    for (const h of componentsHistory) {
      const hDate = new Date(h.effectiveYear, (h.effectiveMonth || 1) - 1, 1);
      if (hDate <= target) chosen = h;
      else break;
    }
    return chosen ? chosen.components : (componentsHistory[0]?.components || []);
  };

  const generatePayslipsForYear = (year) => {
    const comps = findComponentsEffectiveAt(year, 1);
    const gross = comps.reduce((s, c) => s + Number(c.amount || 0), 0);
    const deductions = comps.filter((c) => (c.group || "").toLowerCase().includes("deduct")).reduce((s, c) => s + Number(c.amount || 0), 0);
    const net = gross - deductions;
    return monthNames.map((m, idx) => ({
      id: `${year}-${idx+1}`,
      year,
      monthIdx: idx,
      monthName: m,
      gross,
      deductions,
      net,
      components: comps.map((c) => ({ ...c })),
    }));
  };

  const [payslipsForYear, setPayslipsForYear] = useState(() => {
    if (payrollFromData.payslips && payrollFromData.payslips.length) {
      return payrollFromData.payslips.filter((p) => p.year === selectedPayslipYear);
    }
    return generatePayslipsForYear(selectedPayslipYear);
  });

  useEffect(() => {
    if (payrollFromData.payslips && payrollFromData.payslips.length) {
      setPayslipsForYear(payrollFromData.payslips.filter((p) => p.year === selectedPayslipYear));
    } else {
      setPayslipsForYear(generatePayslipsForYear(selectedPayslipYear));
    }
  }, [selectedPayslipYear, payrollFromData]);

  // internal payroll tab
  const [activePayrollTab, setActivePayrollTab] = useState("components");
  const payrollTabs = [{ id: "components", label: "Components" }, { id: "payslips", label: "Payslips", count: payslipsForYear.length }];

  // payslip modal
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [payslipModalData, setPayslipModalData] = useState(null);
  const openPayslipModal = (p) => { setPayslipModalData(p); setPayslipModalOpen(true); };
  const closePayslipModal = () => { setPayslipModalOpen(false); setPayslipModalData(null); };

  /* ---------- Personal helpers ---------- */
  const updateField = (section, key, value) => {
    setPersonalData((p) => ({ ...p, [section]: { ...p[section], [key]: value } }));
  };

  const addProof = (proof) => setPersonalData((p) => ({ ...p, proofs: [...p.proofs, proof] }));
  const removeProof = (idx) => setPersonalData((p) => ({ ...p, proofs: p.proofs.filter((_, i) => i !== idx) }));

  /* ---------- Leave helpers ---------- */
  const openLeaveModal = () => { setLeaveForm({ from: "", to: "", days: 1, type: "CL", reason: "" }); setIsLeaveModalOpen(true); };
  const closeLeaveModal = () => setIsLeaveModalOpen(false);
  const submitLeaveRequest = (e) => {
    e.preventDefault();
    if (!leaveForm.from || !leaveForm.to) return alert("Select from and to dates.");
    const id = `L-${Date.now().toString().slice(-6)}`;
    const req = { id, from: leaveForm.from, to: leaveForm.to, days: Number(leaveForm.days), type: leaveForm.type, status: "Pending", appliedAt: new Date().toISOString().slice(0,10), reason: leaveForm.reason };
    setLeaves((l) => ({ ...l, requests: [req, ...l.requests] }));
    setIsLeaveModalOpen(false);
    alert("Leave request submitted (local).");
  };
  const deleteLeaveRequest = (id) => { if (!confirm("Delete pending leave request?")) return; setLeaves((l) => ({ ...l, requests: l.requests.filter((r) => r.id !== id) })); };

  const downloadPayslip = (p) => {
    const text = `Payslip: ${p.monthName} ${p.year}\nEmployee: ${currentUser.name} (${currentUser.empId})\nNet Pay: ₹${p.net}\n`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `payslip-${p.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  /* ---------- Main tabs config ---------- */
  const mainTabs = [
    { id: "personal", label: "Personal Details" },
    { id: "leave", label: "Leave Request", count: leaves.requests.filter(r => r.status === "Pending").length },
    { id: "payroll", label: "Payroll", count: payslipsForYear.length },
  ];

  const personalSubTabs = [
    { id: "basic", label: "Basic" },
    { id: "bank", label: "Bank" },
    { id: "employment", label: "Employment" },
    { id: "address", label: "Address" },
    { id: "proofs", label: "Proofs" },
  ];

  useEffect(() => {
    if (!personalSubTabs.some(t => t.id === personalTab)) setPersonalTab("basic");
  }, []);

  /* ---------- Render ---------- */
  return (
    <div className="text-left">
      {/* Header */}
      <div className="mb-6">
        <div className="rounded-xl px-6 py-4" style={{ background: "linear-gradient(90deg, rgba(2,6,23,0.55), rgba(8,20,25,0.55))" }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                {!avatarError ? (
                  <Image src={AVATAR_SRC} alt="avatar" width={56} height={56} className="object-cover" onError={() => setAvatarError(true)} priority />
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center bg-gray-200 text-gray-700 font-semibold">{currentUser.name.split(" ").map(n => n[0]).slice(0,2).join("")}</div>
                )}
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-white">Employee Portal</h1>
                <div className="mt-1 text-sm text-white/90">
                  <span className="font-medium">{currentUser.name}</span> • <span>{currentUser.designation}</span>
                </div>
              </div>
            </div>

            <div />
          </div>
        </div>
      </div>

      {/* main card */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="mb-4">
          <HRTabs tabs={mainTabs} active={activeTab} onChange={setActiveTab} />
        </div>

        <div className="space-y-6">
          {/* Personal Details (unchanged from earlier) */}
          {activeTab === "personal" && (
            <div>
              <div className="mb-4">
                <HRTabs tabs={personalSubTabs} active={personalTab} onChange={setPersonalTab} />
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                {personalTab === "basic" && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Basic Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-xs text-gray-600">
                        Employee ID
                        <input readOnly value={personalData.basic.empId} className="mt-1 w-full px-3 py-2 border rounded-md text-sm bg-white" />
                      </label>

                      <label className="text-xs text-gray-600">
                        First name
                        <input value={personalData.basic.firstName} onChange={(e)=>updateField("basic","firstName", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        Last name
                        <input value={personalData.basic.lastName} onChange={(e)=>updateField("basic","lastName", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        Date of Birth
                        <input type="date" value={personalData.basic.dob} onChange={(e)=>updateField("basic","dob", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        Gender
                        <select value={personalData.basic.gender} onChange={(e)=>updateField("basic","gender", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </label>

                      <label className="text-xs text-gray-600">
                        Aadhaar Number
                        <input value={personalData.basic.aadhaarNumber} onChange={(e)=>updateField("basic","aadhaarNumber", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        PAN Number
                        <input value={personalData.basic.panNumber} onChange={(e)=>updateField("basic","panNumber", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        Phone
                        <input value={personalData.basic.phone} onChange={(e)=>updateField("basic","phone", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        Emergency Contact
                        <input value={personalData.basic.emergencyContact} onChange={(e)=>updateField("basic","emergencyContact", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        Email
                        <input value={personalData.basic.email} onChange={(e)=>updateField("basic","email", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>

                      <label className="text-xs text-gray-600">
                        Blood Group
                        <input value={personalData.basic.bloodGroup} onChange={(e)=>updateField("basic","bloodGroup", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => { setPersonalData(initialPersonal); alert("Reset (local)"); }} className="px-4 py-2 rounded-md border text-sm">Reset</button>
                      <button type="button" onClick={() => alert("Saved (local). Replace with API")} className="px-4 py-2 rounded-md bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">Save</button>
                    </div>
                  </>
                )}

                {personalTab === "bank" && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Bank Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-xs text-gray-600">
                        Bank Name
                        <input value={personalData.bank.bankName} onChange={(e)=>updateField("bank","bankName", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                      <label className="text-xs text-gray-600">
                        Account Number
                        <input value={personalData.bank.accountNumber} onChange={(e)=>updateField("bank","accountNumber", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                      <label className="text-xs text-gray-600">
                        IFSC
                        <input value={personalData.bank.ifsc} onChange={(e)=>updateField("bank","ifsc", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setPersonalData(initialPersonal)} className="px-4 py-2 rounded-md border text-sm">Reset</button>
                      <button type="button" onClick={() => alert("Saved bank details (local).")} className="px-4 py-2 rounded-md bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">Save</button>
                    </div>
                  </>
                )}

                {personalTab === "employment" && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Employment Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-xs text-gray-600">
                        Designation
                        <input value={personalData.employment.designation} onChange={(e)=>updateField("employment","designation", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                      <label className="text-xs text-gray-600">
                        Department
                        <input value={personalData.employment.department} onChange={(e)=>updateField("employment","department", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                      <label className="text-xs text-gray-600">
                        Date of Joining
                        <input type="date" value={personalData.employment.dateOfJoining} onChange={(e)=>updateField("employment","dateOfJoining", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                      <label className="text-xs text-gray-600">
                        Work Location
                        <input value={personalData.employment.workLocation} onChange={(e)=>updateField("employment","workLocation", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" />
                      </label>
                    </div>

                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setPersonalData(initialPersonal)} className="px-4 py-2 rounded-md border text-sm">Reset</button>
                      <button type="button" onClick={() => alert("Saved employment details (local).")} className="px-4 py-2 rounded-md bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">Save</button>
                    </div>
                  </>
                )}

                {personalTab === "address" && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Address Details</h3>
                    <label className="text-xs text-gray-600">
                      Present Address
                      <textarea value={personalData.address.present} onChange={(e)=>updateField("address","present", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" rows={3} />
                    </label>

                    <label className="text-xs text-gray-600 mt-3">
                      Permanent Address
                      <textarea value={personalData.address.permanent} onChange={(e)=>updateField("address","permanent", e.target.value)} className="mt-1 w-full px-3 py-2 border rounded-md text-sm" rows={3} />
                    </label>

                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setPersonalData(initialPersonal)} className="px-4 py-2 rounded-md border text-sm">Reset</button>
                      <button type="button" onClick={() => alert("Saved address (local).")} className="px-4 py-2 rounded-md bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">Save</button>
                    </div>
                  </>
                )}

                {personalTab === "proofs" && (
                  <>
                    <h3 className="text-lg font-semibold mb-4">Proof Documents</h3>
                    <div className="space-y-3">
                      {personalData.proofs.map((p, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 p-3 border rounded-md">
                          <div>
                            <div className="text-sm font-medium">{p.type}</div>
                            <div className="text-xs text-gray-500">{p.number}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button type="button" onClick={() => alert("Download placeholder (implement API)")} className="text-sm text-[#173469]">Download</button>
                            <button type="button" onClick={() => removeProof(i)} className="text-sm text-red-600">Remove</button>
                          </div>
                        </div>
                      ))}

                      <div className="pt-2">
                        <label className="text-xs text-gray-600 block mb-2">Add Proof (mock)</label>
                        <div className="flex gap-2">
                          <input placeholder="Type e.g. Aadhar" id="pf-type" className="px-3 py-2 border rounded-md text-sm" />
                          <input placeholder="Number" id="pf-num" className="px-3 py-2 border rounded-md text-sm" />
                          <button type="button" onClick={() => {
                            const t = document.getElementById("pf-type").value.trim();
                            const n = document.getElementById("pf-num").value.trim();
                            if (!t || !n) return alert("Enter type & number");
                            addProof({ type: t, number: n });
                            document.getElementById("pf-type").value = "";
                            document.getElementById("pf-num").value = "";
                          }} className="px-3 py-2 rounded-md bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">Add</button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Leave Request */}
          {activeTab === "leave" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Leave Requests</h3>
                <div>
                  <button type="button" onClick={openLeaveModal} className="px-3 py-2 rounded-md bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">+ Raise Leave</button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Casual Leave (CL) Balance</div>
                  <div className="text-2xl font-semibold">{leaves.clBalance} days</div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Your Requests</h4>
                  <div className="space-y-2">
                    {leaves.requests.length === 0 && <div className="text-sm text-gray-500">No leave requests.</div>}
                    {leaves.requests.map((r) => (
                      <div key={r.id} className="p-3 border rounded-md flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium">{r.type} • {r.from} → {r.to} ({r.days} day{r.days>1?"s":""})</div>
                          <div className="text-xs text-gray-500">Applied: {r.appliedAt}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${r.status === "Pending" ? "bg-yellow-100 text-yellow-800" : r.status === "Approved" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{r.status}</span>
                          {r.status === "Pending" && <button type="button" onClick={() => deleteLeaveRequest(r.id)} className="text-sm text-red-600 hover:underline">Delete</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-sm font-medium mb-2">Company Holidays</h4>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {companyHolidays.map((h) => (
                      <li key={h.date} className="flex items-center justify-between">
                        <div>{h.name}</div>
                        <div className="text-xs text-gray-500">{h.date}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Payroll (improved layout): Components and Payslips tabs have their own selectors */}
          {activeTab === "payroll" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Payroll</h3>
                <div className="text-sm text-gray-600">View salary components & payslips</div>
              </div>

              <HRTabs tabs={payrollTabs} active={activePayrollTab} onChange={setActivePayrollTab} />

              {/* COMPONENTS tab: selector lives here */}
              {activePayrollTab === "components" && (
                <div className="bg-white border rounded p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-600">Components effective from</label>
                      <select value={selectedEffectiveId || ""} onChange={(e) => setSelectedEffectiveId(e.target.value)} className="px-3 py-2 border rounded-md">
                        {effectiveOptions.length ? (
                          effectiveOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                              {opt.label}
                            </option>
                          ))
                        ) : (
                          <option value="">No versions</option>
                        )}
                      </select>
                    </div>

                    <div className="text-sm text-gray-500">
                      <div>CTC (annually): <strong>{Number(ctcEffective).toLocaleString()}</strong></div>
                      <div className="text-xs text-gray-500">Gross / Deductions / Net highlighted below</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Component</th>
                          <th className="pb-2">Group</th>
                          <th className="pb-2 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {componentsForSelectedEffective.map((c) => (
                          <tr key={c.id} className="border-t">
                            <td className="py-2">{c.name}</td>
                            <td className="py-2 text-xs text-gray-500">{c.group}</td>
                            <td className="py-2 text-right">{Number(c.amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}

                        <tr className="border-t">
                          <td className="py-2 font-semibold">Gross</td>
                          <td />
                          <td className="py-2 text-right font-semibold">{Number(totalGrossEffective).toLocaleString()}</td>
                        </tr>

                        <tr className="border-t">
                          <td className="py-2 font-semibold">CTC (annually)</td>
                          <td />
                          <td className="py-2 text-right font-semibold">{Number(ctcEffective).toLocaleString()}</td>
                        </tr>

                        <tr className="border-t">
                          <td className="py-2 font-semibold">Deductions</td>
                          <td />
                          <td className="py-2 text-right font-semibold">{Number(deductionsEffective).toLocaleString()}</td>
                        </tr>

                        <tr className="border-t bg-green-50">
                          <td className="py-3 font-bold">Net Pay</td>
                          <td />
                          <td className="py-3 text-right font-bold text-green-700 text-lg">₹ {Number(netEffective).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PAYSLIPS tab: compact table with year selector */}
              {activePayrollTab === "payslips" && (
                <div className="bg-white border rounded p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-600">Select year</label>
                      <select value={selectedPayslipYear} onChange={(e) => setSelectedPayslipYear(Number(e.target.value))} className="px-3 py-2 border rounded-md">
                        {payrollYears.map((y) => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>

                    <div className="text-sm text-gray-500">Showing payslips for {selectedPayslipYear} — click View to open full breakdown</div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Month</th>
                          <th className="pb-2">Gross (₹)</th>
                          <th className="pb-2">Deductions (₹)</th>
                          <th className="pb-2">Net (₹)</th>
                          <th className="pb-2 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {payslipsForYear.map((p) => (
                          <tr key={p.id} className="border-t hover:bg-gray-50">
                            <td className="py-2">{p.monthName} {p.year}</td>
                            <td className="py-2">{Number(p.gross).toLocaleString()}</td>
                            <td className="py-2">{Number(p.deductions).toLocaleString()}</td>
                            <td className="py-2 font-semibold text-right">
                              <span className="px-2 py-1 rounded text-sm bg-green-50 text-green-700 inline-block">₹ {Number(p.net).toLocaleString()}</span>
                            </td>
                            <td className="py-2 text-right">
                              <div className="inline-flex items-center gap-2">
                                <button type="button" onClick={() => openPayslipModal(p)} className="px-3 py-1 rounded bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">View</button>
                                <button type="button" onClick={() => downloadPayslip(p)} className="px-3 py-1 rounded bg-white text-[#173469] border border-[#173469] text-sm">Download</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* payslip modal (unchanged) */}
              <SimpleModal open={payslipModalOpen} onClose={closePayslipModal} title={`Payslip — ${payslipModalData?.monthName} ${payslipModalData?.year}`}>
                {payslipModalData ? (
                  <div>
                    <div className="mb-4">
                      <div className="text-sm">Gross: ₹ {Number(payslipModalData.gross).toLocaleString()}</div>
                      <div className="text-sm">Deductions: ₹ {Number(payslipModalData.deductions).toLocaleString()}</div>
                      <div className="text-lg font-semibold">Net: ₹ {Number(payslipModalData.net).toLocaleString()}</div>
                    </div>

                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Component</th>
                          <th className="pb-2">Group</th>
                          <th className="pb-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payslipModalData.components.map((c) => (
                          <tr key={c.id} className="border-t">
                            <td className="py-2">{c.name}</td>
                            <td className="py-2 text-xs text-gray-500">{c.group}</td>
                            <td className="py-2 text-right">₹ {Number(c.amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>No data</div>
                )}
              </SimpleModal>
            </div>
          )}
        </div>
      </div>

      {/* Raise Leave Modal (unchanged) */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeLeaveModal} />
          <form onSubmit={submitLeaveRequest} className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Raise Leave Request</h2>
              <button type="button" onClick={closeLeaveModal} className="text-gray-500">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="text-xs text-gray-600">
                From
                <input type="date" value={leaveForm.from} onChange={(e)=>setLeaveForm(p=>({...p, from: e.target.value}))} className="mt-1 px-3 py-2 border rounded-md text-sm w-full" />
              </label>

              <label className="text-xs text-gray-600">
                To
                <input type="date" value={leaveForm.to} onChange={(e)=>setLeaveForm(p=>({...p, to: e.target.value}))} className="mt-1 px-3 py-2 border rounded-md text-sm w-full" />
              </label>

              <label className="text-xs text-gray-600">
                Days
                <input type="number" min="1" value={leaveForm.days} onChange={(e)=>setLeaveForm(p=>({...p, days: Number(e.target.value) || 1}))} className="mt-1 px-3 py-2 border rounded-md text-sm w-full" />
              </label>

              <label className="text-xs text-gray-600">
                Type
                <select value={leaveForm.type} onChange={(e)=>setLeaveForm(p=>({...p, type: e.target.value}))} className="mt-1 px-3 py-2 border rounded-md text-sm w-full">
                  <option>CL</option>
                  <option>PL</option>
                  <option>SL</option>
                </select>
              </label>

              <label className="text-xs text-gray-600 md:col-span-2">
                Reason
                <textarea value={leaveForm.reason} onChange={(e)=>setLeaveForm(p=>({...p, reason: e.target.value}))} className="mt-1 px-3 py-2 border rounded-md text-sm w-full" rows={3} />
              </label>
            </div>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button type="button" onClick={closeLeaveModal} className="px-4 py-2 rounded-md text-sm border">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded-md bg-[#e7f0fa] text-[#173469] border border-[#173469] text-sm">Submit Request</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
