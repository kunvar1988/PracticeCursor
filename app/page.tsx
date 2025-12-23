"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-blue-50/30 to-gray-100 font-sans">
      {/* Header */}
      <header className="relative w-full px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Top-left box */}
          <div className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-gray-700">
            Get started by editing{" "}
            <code className="font-semibold text-gray-900">src/app/page.js</code>
          </div>

          {/* Center NEXT.JS */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h1 className="text-7xl font-bold text-black tracking-tight">
              NEXT<span className="text-5xl relative -top-2">.JS</span>
            </h1>
          </div>

          {/* Top-right Sign In and Vercel */}
          <div className="flex items-center gap-2">
            {session?.user ? (
              <>
                {session.user.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
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

      {/* Main Content Blocks */}
      <main className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Docs Block */}
          <Link
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-2 group-hover:underline">
                Docs <span className="inline-block">-&gt;</span>
              </h2>
              <p className="text-gray-600 text-sm">
                Find in-depth information about Next.js features and API.
              </p>
            </div>
          </Link>

          {/* Learn Block */}
          <Link
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-2 group-hover:underline">
                Learn <span className="inline-block">-&gt;</span>
              </h2>
              <p className="text-gray-600 text-sm">
                Learn about Next.js in an interactive course with quizzes!
              </p>
            </div>
          </Link>

          {/* Templates Block */}
          <Link
            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-2 group-hover:underline">
                Templates <span className="inline-block">-&gt;</span>
              </h2>
              <p className="text-gray-600 text-sm">
                Explore starter templates for Next.js.
              </p>
            </div>
          </Link>

          {/* Manage API Keys Block */}
          <Link
            href="/dashboards"
            className="group"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-2 group-hover:underline">
                Manage API Keys <span className="inline-block">-&gt;</span>
              </h2>
              <p className="text-gray-600 text-sm">
                Access the dashboard to manage your API keys.
              </p>
            </div>
          </Link>
        </div>

        {/* Deploy Block - Bottom row, full width on mobile, left-aligned on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="group"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-black mb-2 group-hover:underline">
                Deploy <span className="inline-block">-&gt;</span>
              </h2>
              <p className="text-gray-600 text-sm">
                Instantly deploy your Next.js site to a shareable URL with Vercel.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
