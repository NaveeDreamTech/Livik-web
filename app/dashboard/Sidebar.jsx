// app/dashboard/Sidebar.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const navItems = [
  { id: "index", title: "Dashboard", href: "/dashboard" },
  { id: "hr", title: "HR Module", href: "/dashboard/hr" },
  { id: "payroll", title: "Payroll", href: "/dashboard/payroll" },
  { id: "asset", title: "Asset Tracking", href: "/dashboard/asset" },
  { id: "admin", title: "Admin Panel", href: "/dashboard/admin" },
  { id: "employee-portal", title: "Employee Portal", href: "/dashboard/employee_portal" },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  const renderNavItem = (item) => {
    // Highlight logic
    let isActive = false;
    if (item.href === "/dashboard") {
      isActive = pathname === "/dashboard";
    } else {
      isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    }

    const baseClasses =
      "flex items-center gap-3 text-sm px-3 py-2 rounded-md transition-all duration-150";
    const activeClasses = "bg-[#1E90FF] text-white font-medium shadow-sm";
    const inactiveClasses = "text-gray-700 hover:bg-gray-100";

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`${baseClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-white" : "bg-gray-400"
          }`}
          aria-hidden
        />
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full p-6">
      {/* Logo section */}
      <div className="mb-8 flex justify-center">
        <div className="w-[240px] h-[80px] shadow-[0_6px_18px_rgba(0,0,0,0.08)] overflow-hidden bg-white flex items-center justify-center">
          <Image
            src="/asset/Livik_Logo.png"
            alt="Livik Logo"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto">
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.id}>{renderNavItem(item)}</li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full text-sm bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-all duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
