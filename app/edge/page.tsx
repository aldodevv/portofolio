import { useAppNavigation } from "@/lib/navigation";
import Link from "next/link";

export const runtime = "edge";

export default function EdgePage() {
    const uuid = crypto.randomUUID();
    const date = new Date().toISOString();
    const encodedText = new TextEncoder().encode("Hello Edge").toString();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-black">
            <div className="w-full max-w-2xl rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">Edge Runtime</h1>
                <p className="mb-8 text-zinc-600 dark:text-zinc-400">
                    This page is rendered using the Edge Runtime. It demonstrates standardized web APIs.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded bg-zinc-100 p-4 dark:bg-zinc-950">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">Crypto API</h3>
                        <p className="mt-1 text-xs text-zinc-500">crypto.randomUUID()</p>
                        <code className="text-sm text-blue-600 dark:text-blue-400">{uuid}</code>
                    </div>
                    <div className="rounded bg-zinc-100 p-4 dark:bg-zinc-950">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">Date</h3>
                        <p className="mt-1 text-xs text-zinc-500">new Date().toISOString()</p>
                        <code className="text-sm text-green-600 dark:text-green-400">{date}</code>
                    </div>
                    <div className="rounded bg-zinc-100 p-4 dark:bg-zinc-950">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">TextEncoder</h3>
                        <p className="mt-1 text-xs text-zinc-500">Encoded &quot;Hello Edge&quot;</p>
                        <code className="text-sm text-purple-600 dark:text-purple-400 break-all">{encodedText}</code>
                    </div>
                    <div className="rounded bg-zinc-100 p-4 dark:bg-zinc-950">
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-200">URL API</h3>
                        <p className="mt-1 text-xs text-zinc-500">new URL(...)</p>
                        <code className="text-sm text-orange-600 dark:text-orange-400">
                            {new URL('https://example.com/edge?foo=bar').toString()}
                        </code>
                    </div>
                </div>

                <div className="mt-8">
                    <Link
                        href="/"
                        className="inline-block w-full text-center rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
