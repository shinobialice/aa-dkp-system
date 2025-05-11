"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  avatar: string;
};

export default function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => (res.ok ? res.json() : null))
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  return user;
}
