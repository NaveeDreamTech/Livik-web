// app/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  // Toggle this manually to test:
  const isLoggedIn = true; // set to true to test dashboard redirect

  useEffect(() => {
    // make sure we are on the client
    if (typeof window === "undefined") return;

    // small async tick to avoid hydration/timing issues
    const id = setTimeout(() => {
      // use replace so user can't go "back" to the root
      router.replace(isLoggedIn ? "/dashboard" : "/login");
    }, 0);

    return () => clearTimeout(id);
    // intentionally empty deps: run once on first client render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
