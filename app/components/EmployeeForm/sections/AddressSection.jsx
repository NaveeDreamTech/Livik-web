// components/EmployeeForm/sections/AddressSection.jsx
import React from "react";

export default function AddressSection({ form, setField, errors, isView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2">
        <label className="text-xs text-gray-600">Present Address *</label>
        <textarea
          value={form.presentAddress}
          onChange={(e) => setField("presentAddress", e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md"
          readOnly={isView}
          disabled={isView}
        />
        {errors.presentAddress && (
          <div className="text-xs text-red-600 mt-1">{errors.presentAddress}</div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="text-xs text-gray-600">Permanent Address</label>
        <textarea
          value={form.permanentAddress}
          onChange={(e) => setField("permanentAddress", e.target.value)}
          className="mt-1 w-full px-3 py-2 border rounded-md"
          readOnly={isView}
          disabled={isView}
        />
      </div>
    </div>
  );
}
