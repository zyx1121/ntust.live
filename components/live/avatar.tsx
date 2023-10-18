'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useContext } from "react";
import { UsersContext } from "../provider/users";

export default function MyAvatar({ name }: { name: string | undefined }) {
  let { users } = useContext(UsersContext);

  const userImage = users.find((user) => user.name === name)?.image;

  return (
    <Avatar className="h-6 w-6">
      {userImage ? (
        <AvatarImage src={userImage} alt={name} />
      ) : (
        <></>
      )}
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
}