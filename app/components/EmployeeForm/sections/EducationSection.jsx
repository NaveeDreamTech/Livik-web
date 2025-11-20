// components/EmployeeForm/sections/EducationSection.jsx
import React from "react";
import { Trash2 } from "lucide-react";

export default function EducationSection({
  educations,
  addEducation,
  updateEducation,
  removeEducation,
  errors,
  isView,
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-gray-700">Education</div>
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
            <label className="text-xs text-gray-600">University / Board</label>
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
  );
}
