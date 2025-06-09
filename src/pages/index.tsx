import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Only run on client
    if (typeof window !== "undefined") {
      router.replace("/auth/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen text-gray-600">
      Redirecting...
    </div>
  );
}
