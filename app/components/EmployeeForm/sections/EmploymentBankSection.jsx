// components/EmployeeForm/sections/EmploymentBankSection.jsx
import React from "react";

export default function EmploymentBankSection({
  form,
  setField,
  errors,
  isView,
}) {
  return (
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
          <div className="text-xs text-red-600 mt-1">{errors.ifscCode}</div>
        )}
      </div>
    </div>
  );
}
