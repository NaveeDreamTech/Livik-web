// components/CustomModalForm.jsx
"use client";

import React from "react";

/**
 * Generic modal wrapper.
 *
 * Props:
 * - open: boolean
 * - onCancel: fn
 * - title: string
 * - children: React nodes (modal content)
 * - footer: React nodes (optional footer actions)
 * - widthClass: tailwind width class (default max-w-3xl)
 */
export default function CustomModalForm({
  open,
  onCancel,
  title = "Form",
  children,
  footer = null,
  widthClass = "max-w-3xl",
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
    >
      <div className="absolute inset-0" onClick={onCancel} />

      <div
        className={`relative z-10 w-full ${widthClass} bg-white rounded-2xl shadow-2xl overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 px-3 py-1 rounded-md"
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body (children) */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer ? (
          <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
