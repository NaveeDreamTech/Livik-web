// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import { useCallback } from "react";
// import { getAuth, signOut } from "firebase/auth";
// import {
//   HomeIcon,
//   UsersIcon,
//   CreditCardIcon,
//   ArchiveIcon,
//   SettingsIcon,
//   UserCircle2Icon,
//   LogOutIcon,
// } from "lucide-react";

// const navItems = [
//   {
//     id: "index",
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: <HomeIcon size={20} />,
//   },
//   {
//     id: "hr",
//     title: "HR Module",
//     href: "/dashboard/hr",
//     icon: <UsersIcon size={20} />,
//   },
//   {
//     id: "payroll",
//     title: "Payroll",
//     href: "/dashboard/payroll",
//     icon: <CreditCardIcon size={20} />,
//   },
//   {
//     id: "asset",
//     title: "Asset Tracking",
//     href: "/dashboard/asset",
//     icon: <ArchiveIcon size={20} />,
//   },
//   {
//     id: "admin",
//     title: "Admin Panel",
//     href: "/dashboard/admin",
//     icon: <SettingsIcon size={20} />,
//   },
//   {
//     id: "employee-portal",
//     title: "Employee Portal",
//     href: "/dashboard/employee_portal",
//     icon: <UserCircle2Icon size={20} />,
//   },
// ];

// export default function Sidebar() {
//   const pathname = usePathname() || "";
//   const router = useRouter();

//   const handleLogout = useCallback(async () => {
//     try {
//       // 1️⃣ Firebase sign out
//       const auth = getAuth();
//       await signOut(auth);

//       // 2️⃣ Clear local and session storage
//       localStorage.clear();
//       sessionStorage.clear();

//       // 3️⃣ Delete all cookies manually
//       document.cookie.split(";").forEach((cookie) => {
//         const eqPos = cookie.indexOf("=");
//         const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
//         document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
//       });

//       // 4️⃣ Redirect to login page
//       router.push("/login");
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   }, [router]);

//   const renderNavItem = (item) => {
//     const isActive =
//       item.href === "/dashboard"
//         ? pathname === "/dashboard"
//         : pathname === item.href || pathname.startsWith(item.href + "/");

//     const baseClasses =
//       "flex items-center gap-3 px-3 py-3 rounded-3xl font-semibold text-base transition-colors duration-200";
//     const activeClasses = "bg-blue-600 text-white shadow-md shadow-blue-400/40";
//     const inactiveClasses =
//       "text-gray-700 hover:text-blue-600 hover:bg-blue-50";

//     return (
//       <Link
//         key={item.id}
//         href={item.href}
//         className={`${baseClasses} ${
//           isActive ? activeClasses : inactiveClasses
//         }`}
//       >
//         <span aria-hidden className="flex items-center justify-center">
//           {item.icon}
//         </span>
//         <span>{item.title}</span>
//       </Link>
//     );
//   };

//   return (
//     <div className="flex flex-col h-full p-3 bg-white rounded-lg shadow-md border border-gray-200">
//       {/* Logo section */}
//       <div className="mb-8 flex justify-center">
//         <div className="w-[220px] h-[80px] bg-blue-100 rounded-md shadow flex items-center justify-center">
//           <Image
//             src="/asset/Livik_Logo.png"
//             alt="Livik Logo"
//             width={120}
//             height={120}
//             className="object-contain"
//             priority
//           />
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 overflow-auto">
//         <ul className="flex flex-col gap-4">{navItems.map(renderNavItem)}</ul>
//       </nav>

//       {/* Logout button */}
//       <div className="mt-8">
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center gap-2 text-base bg-red-600 text-white px-5 py-3 rounded-3xl font-semibold hover:bg-red-700 transition-colors duration-200"
//         >
//           <LogOutIcon size={20} />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebaseClient";
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
  {
    id: "index",
    title: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon size={20} />,
  },
  {
    id: "hr",
    title: "HR Module",
    href: "/dashboard/hr",
    icon: <UsersIcon size={20} />,
  },
  {
    id: "payroll",
    title: "Payroll",
    href: "/dashboard/payroll",
    icon: <CreditCardIcon size={20} />,
  },
  {
    id: "asset",
    title: "Asset Tracking",
    href: "/dashboard/asset",
    icon: <ArchiveIcon size={20} />,
  },
  {
    id: "admin",
    title: "Admin Panel",
    href: "/dashboard/admin",
    icon: <SettingsIcon size={20} />,
  },
  {
    id: "employee-portal",
    title: "Employee Portal",
    href: "/dashboard/employee_portal",
    icon: <UserCircle2Icon size={20} />,
  },
];

export default function Sidebar() {
  const pathname = usePathname() || "";
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      // 1️⃣ Call logout API to clear server-side token cookie
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
      } catch (apiError) {
        console.error("Logout API error:", apiError);
        // Continue with client-side cleanup even if API fails
      }

      // 2️⃣ Firebase sign out (if Firebase session exists)
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await signOut(auth);
        }
      } catch (firebaseError) {
        // Ignore Firebase errors - user might not have Firebase session
        console.log("Firebase sign out skipped (no active session)");
      }

      // 3️⃣ Clear local and session storage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // ignore storage errors
      }

      // 4️⃣ Clear cookies client-side as backup
      try {
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name =
            eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (!name) return;
          // Clear cookie with various path/domain combinations
          document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
          document.cookie = `${name}=; Path=/; Max-Age=0;`;
          document.cookie = `${name}=; Domain=${window.location.hostname}; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        });
      } catch (e) {
        // ignore cookie errors
      }

      // 5️⃣ Redirect to login page (replace so back doesn't return)
      router.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Force cleanup & redirect even if everything fails
      try {
        localStorage.clear();
        sessionStorage.clear();
        document.cookie.split(";").forEach((cookie) => {
          const eqPos = cookie.indexOf("=");
          const name =
            eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          if (!name) return;
          document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
          document.cookie = `${name}=; Path=/; Max-Age=0;`;
        });
      } catch (e) {
        /* ignore */
      }
      router.replace("/login");
    }
  }, [router]);

  const renderNavItem = (item) => {
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/dashboard"
        : pathname === item.href || pathname.startsWith(item.href + "/");

    const baseClasses =
      "flex items-center gap-3 px-3 py-3 rounded-3xl font-semibold text-base transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white shadow-md shadow-blue-400/40";
    const inactiveClasses =
      "text-gray-700 hover:text-blue-600 hover:bg-blue-50";

    return (
      <Link
        key={item.id}
        href={item.href}
        className={`${baseClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`}
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
