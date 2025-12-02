// components/EmployeeForm.jsx
"use client";

import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { generateTempPass } from "../../utils/generateTempPass"; // adjust path if needed

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
const aadhaarRegex = /^\d{12}$/;
const phoneRegex = /^\d{10,14}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
const accountRegex = /^[0-9]{6,20}$/;

function toISODateIfValid(v) {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  const s = String(v).trim();
  if (s === "") return null;
  const needsTime = !/T|\+|\-/.test(s);
  const iso = needsTime ? `${s}T00:00:00.000Z` : s;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function EmployeeForm({
  mode = "create",
  initialData = {},
  onCancel,
  onSubmit,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  const steps = [
    "Basic Info",
    "Address",
    "Education",
    "Employment & Bank",
    "Review",
  ];
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    empId: initialData.empId ?? "",
    firstName: initialData.firstName ?? "",
    lastName: initialData.lastName ?? "",
    dateOfBirth:
      initialData.dateOfBirth && !isNaN(Date.parse(initialData.dateOfBirth))
        ? new Date(initialData.dateOfBirth).toISOString().slice(0, 10)
        : "",
    gender: initialData.gender ?? "",
    aadhaarNumber: initialData.aadhaarNumber ?? "",
    panNumber: initialData.panNumber ?? "",
    email: initialData.email ?? "",
    phoneNumber: initialData.phoneNumber ?? "",
    emergencyContact: initialData.emergencyContact ?? "",
    photo: initialData.photo ?? "",
    bloodGroup: initialData.bloodGroup ?? "",
    presentAddress: initialData.presentAddress ?? "",
    permanentAddress: initialData.permanentAddress ?? "",
    designation: initialData.designation ?? "",
    department: initialData.department ?? "",
    dateOfJoining:
      initialData.dateOfJoining && !isNaN(Date.parse(initialData.dateOfJoining))
        ? new Date(initialData.dateOfJoining).toISOString().slice(0, 10)
        : "",
    workLocation: initialData.workLocation ?? "",
    bankName: initialData.bankName ?? "",
    accountNumber: initialData.accountNumber ?? "",
    ifscCode: initialData.ifscCode ?? "",
  });

  const [educations, setEducations] = useState(
    (initialData.educationDetails || initialData.education || []).length
      ? (initialData.educationDetails || initialData.education || []).map(
          (e) => ({
            university: e.university ?? "",
            institution: e.institution ?? "",
            qualification: e.qualification ?? "",
            yearCompleted: e.yearCompleted ?? "",
          })
        )
      : [
          {
            university: "",
            institution: "",
            qualification: "",
            yearCompleted: "",
          },
        ]
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // whether HR wants a temp password generated and shown
  const [generateTemp, setGenerateTemp] = useState(true);

  // store temp plaintext in memory only
  const [tempPasswordValue, setTempPasswordValue] = useState("");

  useEffect(() => {
    setErrors({});
  }, [step]);

  useEffect(() => {
    // if HR unchecks generateTemp, clear any generated password
    if (!generateTemp) {
      setTempPasswordValue("");
    }
  }, [generateTemp]);

  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const addEducation = () =>
    setEducations((p) => [
      ...p,
      { university: "", institution: "", qualification: "", yearCompleted: "" },
    ]);

  const updateEducation = (idx, field, value) =>
    setEducations((p) =>
      p.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
    );

  const removeEducation = (idx) =>
    setEducations((p) => p.filter((_, i) => i !== idx));

  const validators = {
    firstName: (v) => (!v || !v.trim() ? "First name is required." : null),
    lastName: (v) => (!v || !v.trim() ? "Last name is required." : null),
    email: (v) => (v && !emailRegex.test(v) ? "Invalid email." : null),
    phoneNumber: (v) =>
      v && !phoneRegex.test(v.replace(/\D/g, ""))
        ? "Phone should be digits (10-14)."
        : null,
    aadhaarNumber: (v) =>
      v && !aadhaarRegex.test(v) ? "Aadhaar must be 12 digits." : null,
    panNumber: (v) =>
      v && !panRegex.test(v) ? "PAN format invalid (e.g. ABCDE1234F)." : null,
    ifscCode: (v) => (v && !ifscRegex.test(v) ? "IFSC invalid." : null),
    accountNumber: (v) =>
      v && !accountRegex.test(v) ? "Account number seems invalid." : null,
    dateOfBirth: (v) => {
      if (!v) return null;
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return "Invalid date.";
      if (d > new Date()) return "DOB can't be in the future.";
      return null;
    },
    dateOfJoining: (v) => {
      if (!v) return null;
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return "Invalid date.";
      return null;
    },
  };

  const validateStep = (s = step) => {
    const newErrors = {};
    if (s === 0) {
      [
        "firstName",
        "lastName",
        "email",
        "phoneNumber",
        "aadhaarNumber",
        "panNumber",
        "dateOfBirth",
      ].forEach((k) => {
        const msg = validators[k]?.(form[k]);
        if (msg) newErrors[k] = msg;
      });
    } else if (s === 1) {
      if (!form.presentAddress || !form.presentAddress.trim())
        newErrors.presentAddress = "Present address is required.";
    } else if (s === 2) {
      const hasValid = educations.some(
        (e) =>
          e.institution &&
          e.institution.trim() &&
          e.qualification &&
          e.qualification.trim()
      );
      if (!hasValid)
        newErrors.educations =
          "Add at least one education record (institution + qualification).";
      educations.forEach((e, i) => {
        if (
          e.yearCompleted &&
          !/^\d{4}$/.test(String(e.yearCompleted).trim())
        ) {
          (newErrors.education_years = newErrors.education_years || {})[i] =
            "Enter 4-digit year (e.g. 2020)";
        }
      });
    } else if (s === 3) {
      const ifscMsg = validators.ifscCode(form.ifscCode);
      if (ifscMsg) newErrors.ifscCode = ifscMsg;
      const accMsg = validators.accountNumber(form.accountNumber);
      if (accMsg) newErrors.accountNumber = accMsg;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    // allow navigation even in view mode — fields remain readOnly/disabled
    const ok = validateStep(step);
    if (!ok) return;

    const nextStep = Math.min(steps.length - 1, step + 1);

    // If moving to Review step, generate temp if needed,
    // but DO NOT generate when simply viewing (no side-effects for view).
    if (!isView && nextStep === steps.length - 1 && generateTemp && !tempPasswordValue) {
      // generate it client-side and keep in memory only
      try {
        const tmp = generateTempPass(12);
        setTempPasswordValue(tmp);
      } catch (e) {
        // fallback: simple random (should not happen in modern browsers)
        setTempPasswordValue(
          Math.random().toString(36).slice(2, 14).toUpperCase()
        );
      }
    }

    setStep(nextStep);
  };

  const goPrev = () => {
    // allow navigation even in view mode
    setStep((s) => Math.max(0, s - 1));
  };

  const inputProps = (name, type = "text", opts = {}) => ({
    name,
    value: form[name] ?? "",
    onChange: (e) => setField(name, e.target.value),
    type,
    readOnly: isView,
    disabled: isView,
    className:
      "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400",
    ...opts,
  });

  // final submit
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (isView) {
      onCancel?.();
      return;
    }

    // validate all steps
    for (let i = 0; i < steps.length - 1; i++) {
      const ok = validateStep(i);
      if (!ok) {
        setStep(i);
        return;
      }
    }

    const payload = {
      empId: form.empId || undefined,
      firstName: form.firstName?.trim() || undefined,
      lastName: form.lastName?.trim() || undefined,
      dateOfBirth: toISODateIfValid(form.dateOfBirth),
      gender: form.gender || undefined,
      aadhaarNumber: form.aadhaarNumber?.trim() || undefined,
      panNumber: form.panNumber?.trim() || undefined,
      email: form.email?.trim() || undefined,
      phoneNumber: form.phoneNumber?.replace(/\D/g, "") || undefined,
      emergencyContact: form.emergencyContact?.trim() || undefined,
      photo: form.photo || undefined,
      bloodGroup: form.bloodGroup ?? undefined,
      presentAddress: form.presentAddress?.trim() || undefined,
      permanentAddress: form.permanentAddress?.trim() || undefined,
      designation: form.designation?.trim() || undefined,
      department: form.department?.trim() || undefined,
      dateOfJoining: toISODateIfValid(form.dateOfJoining),
      workLocation: form.workLocation?.trim() || undefined,
      bankName: form.bankName?.trim() || undefined,
      accountNumber: form.accountNumber?.trim() || undefined,
      ifscCode: form.ifscCode?.trim() || undefined,
      education: educations
        .filter(
          (e) =>
            (e.institution && e.institution.trim()) ||
            (e.qualification && e.qualification.trim())
        )
        .map((e) => ({
          university: e.university?.trim() || undefined,
          institution: e.institution?.trim() || undefined,
          qualification: e.qualification?.trim() || undefined,
          yearCompleted: e.yearCompleted?.toString().trim() || undefined,
        })),
      // include whether we intended to generate temp (server may ignore)
      generateTemp: !!generateTemp,
      // include the plaintext temp if already generated client-side (server will hash)
      tempPassword: generateTemp ? tempPasswordValue || undefined : undefined,
    };

    if (!payload.firstName || !payload.lastName) {
      setErrors({
        firstName: "First name required.",
        lastName: "Last name required.",
      });
      return;
    }

    try {
      setSubmitting(true);
      const result = await Promise.resolve(onSubmit ? onSubmit(payload) : null);

      // If backend returns created employee / temp (we don't rely on that now)
      // you can optionally redirect or close form here.
      // We'll just clear temp after successful creation to avoid lingering plaintext.
      setTempPasswordValue("");
      return result;
    } catch (err) {
      setErrors((p) => ({ ...p, submit: err?.message ?? "Submit failed" }));
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // copy helper
  const handleCopyTemp = async () => {
    try {
      if (!tempPasswordValue) return;
      await navigator.clipboard.writeText(tempPasswordValue);
      // small feedback
      alert("Temp password copied to clipboard");
    } catch (e) {
      alert("Copy failed — please select and copy manually.");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step indicator */}
        <div className="flex gap-3 overflow-auto pb-2">
          {steps.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div
                key={s}
                // allow clicking step even in view mode so user can navigate
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 cursor-pointer select-none ${
                  active
                    ? "text-blue-600"
                    : done
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    active ? "bg-blue-100" : done ? "bg-green-100" : "bg-white"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </div>
                <div className="text-sm font-semibold">{s}</div>
              </div>
            );
          })}
        </div>

        {/* Step contents (keep your existing fields) */}
        <div>
          {step === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600">First Name *</label>
                <input {...inputProps("firstName")} />
                {errors.firstName && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.firstName}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">Last Name *</label>
                <input {...inputProps("lastName")} />
                {errors.lastName && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.lastName}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">Date of Birth</label>
                <input {...inputProps("dateOfBirth", "date")} />
                {errors.dateOfBirth && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setField("gender", e.target.value)}
                  disabled={isView}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-600">Aadhaar Number</label>
                <input {...inputProps("aadhaarNumber")} />
                {errors.aadhaarNumber && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.aadhaarNumber}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">PAN Number</label>
                <input {...inputProps("panNumber")} />
                {errors.panNumber && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.panNumber}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">Email</label>
                <input {...inputProps("email", "email")} />
                {errors.email && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">Phone Number</label>
                <input {...inputProps("phoneNumber")} />
                {errors.phoneNumber && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.phoneNumber}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">
                  Emergency Contact
                </label>
                <input {...inputProps("emergencyContact")} />
              </div>

              <div>
                <label className="text-xs text-gray-600">Photo (URL)</label>
                <input {...inputProps("photo", "text")} />
              </div>

              <div>
                <label className="text-xs text-gray-600">Blood Group</label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setField("bloodGroup", e.target.value)}
                  disabled={isView}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">
                  Present Address *
                </label>
                <textarea
                  value={form.presentAddress}
                  onChange={(e) => setField("presentAddress", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  readOnly={isView}
                  disabled={isView}
                />
                {errors.presentAddress && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.presentAddress}
                  </div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-gray-600">
                  Permanent Address
                </label>
                <textarea
                  value={form.permanentAddress}
                  onChange={(e) => setField("permanentAddress", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                  readOnly={isView}
                  disabled={isView}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-700">
                  Education
                </div>
                {!isView && (
                  <button
                    type="button"
                    onClick={addEducation}
                    className="text-sm px-3 py-1 rounded-md border hover:bg-gray-100"
                  >
                    + Add
                  </button>
                )}
              </div>

              {errors.educations && (
                <div className="text-xs text-red-600">{errors.educations}</div>
              )}

              {educations.map((edu, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center p-3 border rounded-md"
                >
                  <div className="md:col-span-4">
                    <label className="text-xs text-gray-600">
                      University / Board
                    </label>
                    <input
                      value={edu.university}
                      onChange={(e) =>
                        updateEducation(idx, "university", e.target.value)
                      }
                      readOnly={isView}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="text-xs text-gray-600">
                      Institution / School / College
                    </label>
                    <input
                      value={edu.institution}
                      onChange={(e) =>
                        updateEducation(idx, "institution", e.target.value)
                      }
                      readOnly={isView}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-600">
                      Qualification / Degree
                    </label>
                    <input
                      value={edu.qualification}
                      onChange={(e) =>
                        updateEducation(idx, "qualification", e.target.value)
                      }
                      readOnly={isView}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-xs text-gray-600">Year</label>
                    <input
                      value={edu.yearCompleted}
                      onChange={(e) =>
                        updateEducation(idx, "yearCompleted", e.target.value)
                      }
                      readOnly={isView}
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                      style={{ width: "80px" }}
                      maxLength={4}
                      placeholder="2023"
                    />
                    {errors.education_years && errors.education_years[idx] && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.education_years[idx]}
                      </div>
                    )}
                  </div>
                  {!isView && (
                    <div className="md:col-span-1 flex items-center justify-end h-full">
                      <button
                        type="button"
                        onClick={() => removeEducation(idx)}
                        className="border border-gray-300 bg-white text-red-600 hover:text-red-700 w-10 h-10 rounded-md flex items-center justify-center mt-6 cursor-pointer"
                        aria-label="Delete education row"
                      >
                        <Trash2 size={20} strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-600">Designation</label>
                <input
                  value={form.designation}
                  onChange={(e) => setField("designation", e.target.value)}
                  {...(isView ? { readOnly: true, disabled: true } : {})}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Department</label>
                <input
                  value={form.department}
                  onChange={(e) => setField("department", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Date of Joining</label>
                <input
                  type="date"
                  value={form.dateOfJoining}
                  onChange={(e) => setField("dateOfJoining", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
                {errors.dateOfJoining && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.dateOfJoining}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">Work Location</label>
                <input
                  value={form.workLocation}
                  onChange={(e) => setField("workLocation", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Bank Name</label>
                <input
                  value={form.bankName}
                  onChange={(e) => setField("bankName", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Account Number</label>
                <input
                  value={form.accountNumber}
                  onChange={(e) => setField("accountNumber", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
                {errors.accountNumber && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.accountNumber}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-600">IFSC Code</label>
                <input
                  value={form.ifscCode}
                  onChange={(e) => setField("ifscCode", e.target.value)}
                  className="mt-1 w-full px-3 py-2 border rounded-md"
                />
                {errors.ifscCode && (
                  <div className="text-xs text-red-600 mt-1">
                    {errors.ifscCode}
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="font-semibold">Basic Info</h4>
                <div className="text-sm text-gray-700">
                  {form.firstName} {form.lastName}
                </div>
                <div className="text-xs text-gray-500">{form.email}</div>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-semibold">Address</h4>
                <div className="text-sm text-gray-700">
                  Present: {form.presentAddress}
                </div>
                <div className="text-sm text-gray-700">
                  Permanent: {form.permanentAddress}
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-semibold">Education</h4>
                <div className="space-y-2">
                  {educations.map((e, i) => (
                    <div key={i} className="text-sm text-gray-700">
                      <strong>{e.qualification}</strong> — {e.institution} (
                      {e.yearCompleted})
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-semibold">Employment & Bank</h4>
                <div className="text-sm text-gray-700">
                  Designation: {form.designation}
                </div>
                <div className="text-sm text-gray-700">
                  Department: {form.department}
                </div>
                <div className="text-sm text-gray-700">
                  Bank: {form.bankName} • {form.accountNumber}
                </div>
              </div>

              {/* If we generated a temp, show it here for HR to copy */}
              {generateTemp && tempPasswordValue && (
                <div className="flex p-4 border rounded-md bg-gray-50">
                  <div className="flex-1">
                    <div className="text-xs text-gray-600 mb-1">
                      Temporary password (copy and share — shown only here)
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="px-3 py-2 bg-white border rounded font-mono text-sm flex items-center h-10">
                        {tempPasswordValue}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyTemp}
                        className="h-10 px-3 rounded-md border hover:bg-gray-50 flex items-center justify-center"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTempPasswordValue(generateTempPass(12));
                        }}
                        className="h-10 px-3 rounded-md border hover:bg-gray-50 flex items-center justify-center"
                      >
                        Regenerate
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {errors.submit && (
          <div className="text-sm text-red-600">{errors.submit}</div>
        )}

        {/* navigation */}
        <div className="flex items-center justify-between gap-3">
          <div>
            {step > 0 && (
              <button
                type="button"
                onClick={goPrev}
                className="px-4 py-2 rounded-md border hover:bg-gray-50"
              >
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border hover:bg-gray-50"
            >
              Cancel
            </button>

            {step < steps.length - 1 && (
              <button
                type="button"
                onClick={goNext}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </button>
            )}

            {step === steps.length - 1 && !isView && (
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                {submitting
                  ? "Saving..."
                  : isEdit
                  ? "Save Changes"
                  : "Create Employee"}
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
