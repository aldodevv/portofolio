"use client";

import { useState } from "react";

export function StreamButton() {
    const [data, setData] = useState("");
    const [loading, setLoading] = useState(false);

    const startStream = async () => {
        setLoading(true);
        setData("");
        try {
            const response = await fetch("/api/edge-stream");
            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                setData((prev) => prev + chunk);
            }
        } catch (err) {
            console.error("Stream failed", err);
            setData("Error streaming data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                onClick={startStream}
                disabled={loading}
                className="rounded bg-cyan-600 px-3 py-1 text-sm text-white hover:bg-cyan-700 disabled:opacity-50"
            >
                {loading ? "Streaming..." : "Start Edge Stream"}
            </button>
            {data && (
                <pre className="mt-2 max-h-40 overflow-y-auto rounded bg-black p-2 text-xs text-green-400">
                    {data}
                </pre>
            )}
        </div>
    );
}
