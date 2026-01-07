"use client";

import { useAppNavigation } from "@/lib/navigation";

export default function AboutPage() {
    const { navigateTo, searchParams } = useAppNavigation();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-black">
            <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">About Us</h1>
                <p className="mb-4 text-zinc-600 dark:text-zinc-400">
                    This is the about page. It demonstrates prefetching and navigation to a static content route.
                </p>

                <div className="mb-8 rounded bg-zinc-100 p-4 text-sm dark:bg-zinc-950">
                    <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-200">Received Params:</h3>
                    <pre className="overflow-x-auto text-zinc-600 dark:text-zinc-400">
                        {JSON.stringify(Object.fromEntries(searchParams.entries()), null, 2)}
                    </pre>
                </div>

                <button
                    onClick={() => navigateTo("/")}
                    className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
}
