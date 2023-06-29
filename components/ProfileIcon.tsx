"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const ProfileIcon = () => {
  const { data: session } = useSession();
  return (
    <div>
      <Link href="profile">
        <Image src={session?.user?.image || "assets/icons/profile.svg"} width={37} height={37} alt="Profile" className="rounded-full" />
      </Link>
    </div>
  );
};

export default ProfileIcon;
