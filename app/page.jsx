// // app/page.jsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function HomePage() {
//   const router = useRouter();

//   // Toggle this manually to test:
//   const isLoggedIn = false; // set to true to test dashboard redirect

//   useEffect(() => {
//     // make sure we are on the client
//     if (typeof window === "undefined") return;

//     // small async tick to avoid hydration/timing issues
//     const id = setTimeout(() => {
//       // use replace so user can't go "back" to the root
//       router.replace(isLoggedIn ? "/dashboard" : "/login");
//     }, 0);

//     return () => clearTimeout(id);
//     // intentionally empty deps: run once on first client render
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return null;
// }

// app/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

export default function HomePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCheckingAuth(false);
      if (user) {
        // ✅ Authenticated → go to dashboard
        router.replace("/dashboard");
      } else {
        // 🚫 Not logged in → go to login
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  // optional: show a loader while checking
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Checking authentication...
      </div>
    );
  }

  return null;
}
