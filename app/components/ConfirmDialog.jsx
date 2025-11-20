// components/ConfirmDialog.jsx
"use client";

import React from "react";
import CustomModalForm from "./CustomModalForm";

/**
 * ConfirmDialog - small reusable confirmation modal (uses CustomModalForm)
 *
 * Props:
 * - open (bool)
 * - title (string)
 * - description (string | ReactNode)
 * - confirmLabel (string)
 * - cancelLabel (string)
 * - destructive (bool)
 * - onConfirm (fn)
 * - onCancel (fn)
 */
export default function ConfirmDialog({
  open,
  title = "Confirm",
  description = "Are you sure?",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <CustomModalForm
      open={open}
      onCancel={onCancel}
      title={title}
      widthClass="max-w-xl"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <svg
              className="w-6 h-6 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 9v4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <div className="text-sm text-gray-700">{description}</div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-white border text-sm font-medium hover:bg-gray-50"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium border focus:outline-none ${
              destructive
                ? "bg-red-600 text-white hover:bg-red-700 border-red-600"
                : "bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
            }`}
            autoFocus
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </CustomModalForm>
  );
}
