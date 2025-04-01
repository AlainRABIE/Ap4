import React, { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Redirect to the default route after ensuring the layout is mounted
      router.push("./(auth)/login");
    }, 0);

    return () => clearTimeout(timeout); // Cleanup timeout
  }, [router]);

  return null; // No UI is needed since this is just for redirection
}