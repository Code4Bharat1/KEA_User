    "use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Public routes
    if (pathname === "/login" || pathname === "/register"|| pathname === "/") {
      return;
    }

    if (!token) {
      router.replace("/login");
    }
  }, [pathname]);

  return children;
}
