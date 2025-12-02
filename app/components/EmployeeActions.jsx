// components/EmployeeActions.jsx
"use client";

import React from "react";
import { Edit3, Trash2 } from "lucide-react";
import Button from "./Button";

/**
 * EmployeeActions - renders Edit/Delete icon buttons for a row.
 *
 * Props:
 * - row: object (employee)
 * - onEdit: (row) => void
 * - onDelete: (rowId) => void
 */
export default function EmployeeActions({ row, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-center gap-3">
      {/* Edit Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(row);
        }}
        className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
        title="Edit Employee"
      >
        <Edit3 className="h-4 w-4" />
      </Button>

      {/* Delete Button */}
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.(row.id);
        }}
        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
        title="Delete Employee"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
