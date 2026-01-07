export const runtime = 'edge';

export async function GET() {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const messages = [
                "Starting stream from Edge...",
                "Processing chunk 1...",
                "Processing chunk 2...",
                "Getting data using fetch...",
                "Crypto operation: " + crypto.randomUUID(),
                "Stream complete!"
            ];

            for (const message of messages) {
                controller.enqueue(encoder.encode(message + "\n"));
                await new Promise((r) => setTimeout(r, 500)); // Simulate delay
            }
            controller.close();
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache, no-transform',
        },
    });
}
