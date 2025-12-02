// components/EmployeeForm/sections/BasicInfo.jsx
import React from "react";

export default function BasicInfo({
  form,
  inputProps,
  errors,
  setField,
  isView,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="text-xs text-gray-600">First Name *</label>
        <input {...inputProps("firstName")} />
        {errors.firstName && (
          <div className="text-xs text-red-600 mt-1">{errors.firstName}</div>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-600">Last Name *</label>
        <input {...inputProps("lastName")} />
        {errors.lastName && (
          <div className="text-xs text-red-600 mt-1">{errors.lastName}</div>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-600">Date of Birth</label>
        <input {...inputProps("dateOfBirth", "date")} />
        {errors.dateOfBirth && (
          <div className="text-xs text-red-600 mt-1">{errors.dateOfBirth}</div>
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
          <div className="text-xs text-red-600 mt-1">{errors.panNumber}</div>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-600">Email</label>
        <input {...inputProps("email", "email")} />
        {errors.email && (
          <div className="text-xs text-red-600 mt-1">{errors.email}</div>
        )}
      </div>

      <div>
        <label className="text-xs text-gray-600">Phone Number</label>
        <input {...inputProps("phoneNumber")} />
        {errors.phoneNumber && (
          <div className="text-xs text-red-600 mt-1">{errors.phoneNumber}</div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="text-xs text-gray-600">Emergency Contact</label>
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
  );
}
