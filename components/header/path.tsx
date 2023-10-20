'use client'

import { UsersContext } from "@/components/provider/users";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useSelectedLayoutSegments } from 'next/navigation';
import { useContext } from "react";

export function Path() {
  const { users } = useContext(UsersContext);
  const segments = useSelectedLayoutSegments()

  return (
    <>
      {segments.map((segment, index) => (
        <>
          <Label className="mx-4 text-muted-foreground font-thin">
            /
          </Label>
          <Label key={index} asChild>
            <Link href={segment}>
              {users.find((user) => user.id === segment)?.name}
            </Link>
          </Label>
        </>
      ))}
    </>
  );
}