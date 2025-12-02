// components/ApprovalCard.jsx
"use client";

import React from "react";
import Button from "./Button";

/**
 * ApprovalCard - renders an approval item used in the Approvals tab.
 *
 * Props:
 * - approval: { id, type, employee, details, status }
 * - onApprove: (id) => void
 * - onReject: (id) => void
 */
export default function ApprovalCard({ approval, onApprove, onReject }) {
  return (
    <div className="p-5 border border-gray-200 rounded-xl shadow-sm flex justify-between bg-white hover:shadow-md transition cursor-default">
      <div>
        <div className="text-gray-600 font-medium text-base select-text">
          {approval.type}
        </div>
        <div className="text-gray-900 font-semibold text-lg select-text">
          {approval.employee}
        </div>
        <div className="text-gray-500 mt-1 text-sm select-text">
          {approval.details}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="inline-block text-sm px-3 py-1 rounded-md bg-gray-100 text-gray-700 font-medium select-none">
          {approval.status}
        </span>

        {approval.status === "Pending" && (
          <div className="flex gap-3">
            <Button
              onClick={() => onApprove?.(approval.id)}
              className="px-5 py-1 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
            >
              Approve
            </Button>
            <Button
              onClick={() => onReject?.(approval.id)}
              className="px-5 py-1 rounded-md bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition"
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
