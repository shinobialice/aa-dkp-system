// hooks/useCurrentUser.ts
"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  avatar: string;
};

export default function useCurrentUser(): User | null {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  return user;
}
