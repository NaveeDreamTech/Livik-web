// components/CustomModalForm.jsx
"use client";

import React, { useEffect, useState } from "react";
import Button from "./Button";

/**
 * CustomModalForm
 *
 * Props:
 * - open: boolean (show/hide)
 * - onCancel: () => void
 * - onSubmit: (formData) => void
 * - title: string
 * - submitLabel: string (default "Submit")
 * - initialData: object (initial values)
 * - fields: Array<{
 *     name: string,
 *     label?: string,
 *     type?: "text"|"email"|"number"|"select"|"textarea"|"date"|"checkbox",
 *     options?: Array<{value,label}> (for select),
 *     placeholder?: string,
 *     required?: boolean,
 *     className?: string,
 *     inputClassName?: string
 *   }>
 * - modalClassName / formClassName (optional)
 *
 * Notes:
 * - This component is purposely simple and unopinionated about layout.
 * - Parent controls styles via className strings in fields and buttons.
 */
export default function CustomModalForm({
  open,
  onCancel,
  onSubmit,
  title = "Form",
  submitLabel = "Submit",
  initialData = {},
  fields = [],
  modalClassName = "",
  formClassName = "",
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // when open/initialData changes, set defaults
    const defaults = {};
    fields.forEach((f) => {
      if (initialData && initialData[f.name] !== undefined) {
        defaults[f.name] = initialData[f.name];
      } else if (f.defaultValue !== undefined) {
        defaults[f.name] = f.defaultValue;
      } else if (f.type === "checkbox") {
        defaults[f.name] = Boolean(f.defaultValue);
      } else {
        defaults[f.name] = "";
      }
    });
    setFormData(defaults);
  }, [open, initialData, fields]);

  if (!open) return null;

  const handleChange = (name, value, type) => {
    if (type === "number") {
      // keep '' or numeric
      setFormData((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
    } else if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: !!value }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const submit = (e) => {
    e?.preventDefault();
    // simple required validation
    const missing = fields.filter(
      (f) =>
        f.required &&
        !formData[f.name] &&
        formData[f.name] !== 0 &&
        formData[f.name] !== false
    );
    if (missing.length > 0) {
      // Focus first missing
      const first = missing[0];
      const el = document.querySelector(`[name="${first.name}"]`);
      if (el) el.focus();
      return;
    }
    onSubmit?.(formData);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm ${modalClassName}`}
    >
      {/* click on overlay closes */}
      <div className="absolute inset-0" onClick={onCancel} />

      <form
        onSubmit={submit}
        className={`relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 ${formClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <Button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            ✕
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((f) => {
            const {
              name,
              label,
              type = "text",
              options = [],
              placeholder = "",
              required = false,
              className = "",
              inputClassName = "",
            } = f;

            const value = formData[name];

            // render input by type
            return (
              <label
                key={name}
                className={`text-xs text-gray-600 ${className}`}
              >
                {label ?? name}
                {type === "textarea" ? (
                  <textarea
                    name={name}
                    value={value ?? ""}
                    onChange={(e) => handleChange(name, e.target.value, type)}
                    placeholder={placeholder}
                    required={required}
                    className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition ${inputClassName}`}
                  />
                ) : type === "select" ? (
                  <select
                    name={name}
                    value={value ?? ""}
                    onChange={(e) => handleChange(name, e.target.value, type)}
                    required={required}
                    className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition ${inputClassName}`}
                  >
                    <option value="" disabled>
                      {placeholder || "Select..."}
                    </option>
                    {options.map((opt) =>
                      typeof opt === "object" ? (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ) : (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      )
                    )}
                  </select>
                ) : type === "checkbox" ? (
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      name={name}
                      type="checkbox"
                      checked={!!value}
                      onChange={(e) =>
                        handleChange(name, e.target.checked, type)
                      }
                      className={`h-4 w-4 ${inputClassName}`}
                    />
                    <span className="text-sm text-gray-700">{placeholder}</span>
                  </div>
                ) : (
                  <input
                    name={name}
                    type={type}
                    value={value ?? ""}
                    onChange={(e) => handleChange(name, e.target.value, type)}
                    placeholder={placeholder}
                    required={required}
                    className={`mt-2 w-full px-4 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400 transition ${inputClassName}`}
                  />
                )}
              </label>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-4 mt-6">
          <Button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
