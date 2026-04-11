"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Default admin landing page redirects to user management
    router.push("/admin/users");
  }, [router]);

  return null;
}
