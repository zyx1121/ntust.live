'use client'

import { User } from "@prisma/client";
import { createContext } from "react";

export const UsersContext = createContext<{ users: User[] }>({ users: [] });

export function MyUsersProvider({ children, users }: { children: React.ReactNode, users: User[] }): React.ReactNode {
  return (
    <UsersContext.Provider value={{ users }}>
      {children}
    </UsersContext.Provider>
  );
}