// components/EmployeeForm/sections/ReviewSection.jsx
import React from "react";

export default function ReviewSection({
  form,
  educations,
  generateTemp,
  tempPasswordValue,
  handleCopyTemp,
  regenerate,
}) {
  return (
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

      {/* Temporary password area */}
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
                onClick={regenerate}
                className="h-10 px-3 rounded-md border hover:bg-gray-50 flex items-center justify-center"
              >
                Regenerate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
