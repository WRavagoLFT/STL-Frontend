"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User } from "~/types/types";
import { AccessGuard } from "~/components/auth/AccessGuard";
import { fetchUserById } from "~/lib/api/users.service";
import UsersViewPage from "~/components/user/UsersViewPage";

const UserSlugPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const [idStr] = slug.split("-");
    const userId = Number(idStr);

    if (isNaN(userId)) {
      console.error("Invalid user ID in slug:", slug);
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetchUserById(userId)
      .then((res) => {
        if (res.success) {
          setUser(res.data);
        } else {
          setUser(null);
        }
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
    return <p className="text-center text-red-500">No user found.</p>;
  }

  return (
    <AccessGuard allowedUserTypes={[3, 4, 5]}>
      <UsersViewPage user={user} slug={slug} />
    </AccessGuard>
  );
};

export default UserSlugPage;
