"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

// Import Lucide React icons
import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  ArchiveIcon,
  SettingsIcon,
  UserCircle2Icon,
  LogOutIcon,
} from "lucide-react";

const navItems = [
  { id: "index", title: "Dashboard", href: "/dashboard", icon: <HomeIcon size={20} /> },
  { id: "hr", title: "HR Module", href: "/dashboard/hr", icon: <UsersIcon size={20} /> },
  { id: "payroll", title: "Payroll", href: "/dashboard/payroll", icon: <CreditCardIcon size={20} /> },
  { id: "asset", title: "Asset Tracking", href: "/dashboard/asset", icon: <ArchiveIcon size={20} /> },
  { id: "admin", title: "Admin Panel", href: "/dashboard/admin", icon: <SettingsIcon size={20} /> },
  { id: "employee-portal", title: "Employee Portal", href: "/dashboard/employee_portal", icon: <UserCircle2Icon size={20} /> },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    router.push("/login");
  }, [router]);

  const renderNavItem = (item) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(item.href + "/");

    const baseClasses =
      "flex items-center gap-3 px-3 py-3 rounded-3xl font-semibold text-base transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow-md shadow-blue-400/40";
    const inactiveClasses = "text-gray-700 hover:text-blue-600 hover:bg-blue-50";

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      >
        <span aria-hidden className="flex items-center justify-center">
          {item.icon}
        </span>
        <span>{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full p-3 bg-white rounded-lg shadow-md border border-gray-200">
      {/* Logo section */}
      <div className="mb-8 flex justify-center">
        <div className="w-[220px] h-[80px] bg-blue-100 rounded-md shadow flex items-center justify-center">
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
        <ul className="flex flex-col gap-4">{navItems.map(renderNavItem)}</ul>
      </nav>

      {/* Logout button */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-base bg-red-600 text-white px-5 py-3 rounded-3xl font-semibold hover:bg-red-700 transition-colors duration-200"
        >
          <LogOutIcon size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}
