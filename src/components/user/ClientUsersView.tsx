"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchUserById, UsersItem } from "@/lib/api/users/users.service";
import UsersViewPage from "@/components/user/UsersViewPage";
import { UsersSkeletonPage } from "./UsersSkeleton";

const UserViewSlugClientPage = () => {
  const params = useParams();
  const slug = params.slug as string;

  const [user, setUser] = useState<UsersItem | null>(null);
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

  if (loading) return <div><UsersSkeletonPage/></div>;


  if (!user) {
    return <p className="text-center text-red-500">No user found.</p>;
  }

  return (
    <UsersViewPage user={user} slug={slug} />
  );
};

export default UserViewSlugClientPage;
