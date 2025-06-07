// src/pages/Protected/users/users-view/index.tsx

import React from "react";
import { User } from "~/types/types";

type UsersViewPageProps = {
  user: User;
  slug: string;
};

const UsersViewPage: React.FC<UsersViewPageProps> = ({ user, slug }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users View Page</h1>
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">User Details</h2>
        <ul className="list-disc list-inside mt-2">
          <li>
            <strong>ID:</strong> {user.UserId || user.UserId}
          </li>
          <li>
            <strong>Name:</strong> {user.firstName || user.FirstName} {user.lastName || user.LastName}
          </li>
          <li>
            <strong>Email:</strong> {user.email}
          </li>
          {/* Add more user fields as needed */}
        </ul>
      </div>
    </div>
  );
};

export default UsersViewPage;
