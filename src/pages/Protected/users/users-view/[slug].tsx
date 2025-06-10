import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User } from "~/types/types";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { fetchUserById } from "~/utils/api/users";
import UsersViewPage from ".";

const UserSlugPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //console.log("UserSlugPage useEffect triggered, slug:", slug);

    if (!slug || typeof slug !== "string") {
      console.log("Slug is not ready or not a string yet");
      return;
    }

    // Extract user ID from slug
    const [idStr] = slug.split("-");
    const userId = Number(idStr);

    if (isNaN(userId)) {
      console.error("Invalid user ID in slug:", slug);
      setUser(null);
      setLoading(false);
      return;
    }

    //console.log("Fetching user by ID:", userId);
    setLoading(true);

    fetchUserById(userId)
      .then((data) => {
        //console.log("User data fetched:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("Error fetching user by ID:", err);
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-10">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    console.warn("No user found for slug:", slug);
    return <p className="text-center text-red-500">No user found.</p>;
  }

  //console.log("Rendering UpdateUser for user:", user);

  return (
    <AccessGuard allowedUserTypes={[3, 4, 5]}>
      <UsersViewPage user={user} slug={slug as string} />
    </AccessGuard>
  );
};

export default UserSlugPage;
