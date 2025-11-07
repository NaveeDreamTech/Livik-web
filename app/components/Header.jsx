// components/Header.jsx
"use client";

import React from "react";
import Button from "./Button";

/**
 * Header component for the HR module.
 * Props:
 * - employeeCount: number
 * - onAdd: () => void
 */
export default function Header({ employeeCount, onAdd }) {
  return (
    <header className="bg-white rounded-lg shadow-md p-2 mb-4 border border-gray-200">
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="rounded-md bg-blue-100 p-3 shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 20h5v-2a4 4 0 00-4-4h-1M7 20H2v-2a4 4 0 014-4h1m0 0a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide leading-tight">
              HR Module
            </h1>
            <p className="text-gray-600 mt-1 text-lg font-medium">
              Manage employees, approvals, and quick actions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Active employees
            </span>
            <span className="text-4xl font-extrabold text-gray-900 tracking-tight text-center">
              {employeeCount}
            </span>
          </div>

          <Button
            onClick={onAdd}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:ring-4 focus:ring-blue-300 text-white px-6 py-3 rounded-3xl text-base font-semibold shadow-xl transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Employee
          </Button>
        </div>
      </div>
    </header>
  );
}
