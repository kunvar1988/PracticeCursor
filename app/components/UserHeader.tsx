"use client";

import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserHeader() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Practice Cursor</h1>
        </div>
        <div className="flex items-center gap-2">
        {session?.user ? (
          <>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <span className="text-blue-600 font-medium">
              {session.user.name || session.user.email?.split("@")[0] || "User"}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-600 font-medium hover:underline"
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="text-green-600 font-medium hover:underline"
          >
            Sign In
          </button>
        )}
        <span className="text-black">By</span>
        <Image
          src="/vercel.svg"
          alt="Vercel"
          width={20}
          height={20}
          className="brightness-0"
        />
        <span className="text-black font-bold">Vercel</span>
        </div>
      </div>
    </header>
  );
}

