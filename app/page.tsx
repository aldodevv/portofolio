"use client"
import { useAppNavigation } from "@/lib/navigation";
import LiquidGlass from "liquid-glass-react";
import Image from "next/image";
import { useState } from "react";
import { StreamButton } from "@/components/stream-button";

export default function Home() {
  const {
    router,
    pathname,
    searchParams,
    updateSearchParams,
    replaceSearchParams,
    navigateTo,
    prefetchRoute
  } = useAppNavigation();

  const [inputVal, setInputVal] = useState("");

  return (
    <div className="bg-[linear-gradient(rgba(0,0,0,.6),rgba(0,0,0,.6))] flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-10 px-4 dark:bg-black sm:items-center gap-8">

        {/* Navigation Demo Section */}
        <section className="w-full rounded-xl border border-zinc-200 bg-white/5 p-6 backdrop-blur-sm dark:border-zinc-800">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Navigation Demo</h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Current State</h3>
                <pre className="mt-2 overflow-x-auto rounded bg-zinc-100 p-2 text-xs dark:bg-zinc-900 dark:text-zinc-300">
                  {JSON.stringify({ pathname, searchParams: Object.fromEntries(searchParams.entries()) }, null, 2)}
                </pre>
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Navigation</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigateTo(`/dashboard?${searchParams.toString()}`)}
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    Go to /dashboard (Keep Params)
                  </button>
                  <button
                    onMouseEnter={() => prefetchRoute(`/about?${searchParams.toString()}`)}
                    onClick={() => navigateTo(`/about?${searchParams.toString()}`)}
                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    Prefetch & Go to /about (Keep Params)
                  </button>
                  <button
                    onClick={() => navigateTo('/edge')}
                    className="rounded bg-teal-600 px-3 py-1 text-sm text-white hover:bg-teal-700"
                  >
                    Edge Page
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-zinc-700 dark:text-zinc-300">Search Params Control</h3>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="Value for 'q' param"
                    className="rounded border border-zinc-300 px-2 py-1 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => updateSearchParams({ q: inputVal || 'test' })}
                    className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                  >
                    Update 'q'
                  </button>
                  <button
                    onClick={() => updateSearchParams({ filter: 'active', sort: 'desc' })}
                    className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                  >
                    Add Multiple
                  </button>
                  <button
                    onClick={() => updateSearchParams({ q: null, filter: null, sort: null })}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Clear All (Update)
                  </button>
                </div>

                <h4 className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">Replace (Clean History)</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => replaceSearchParams({ mode: 'view' })}
                    className="rounded bg-orange-600 px-3 py-1 text-sm text-white hover:bg-orange-700"
                  >
                    Replace with mode=view
                  </button>
                </div>

                <h4 className="mt-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">Edge Stream</h4>
                <div className="mt-2">
                  <StreamButton />
                </div>
              </div>
            </div>
          </div>
        </section>

        <LiquidGlass>
          <div className="p-2">
            <h2>Your content here</h2>
            <p>This will have the liquid glass effect</p>
          </div>
        </LiquidGlass>
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="bg-white flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-red-500 dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
