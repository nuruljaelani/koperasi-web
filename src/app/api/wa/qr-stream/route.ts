import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const deviceId = request.nextUrl.searchParams.get("deviceId");
  const apiKey = process.env.NOTIF_API_KEY;
  const apiUrl = process.env.NOTIF_API_URL;
  if (!deviceId || !apiUrl) {
    return new Response("Missing deviceId or apiUrl", { status: 400 });
  }

  try {
    
    // Hubungi service WA gateway dari server (API Key aman di server)
    const upstream = await fetch(
      `${apiUrl}/devices/${deviceId}/qr/stream?api_key=${encodeURIComponent(apiKey || '')}`,
      {
        headers: {
          Accept: 'text/event-stream',
        },
      }
    );

    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream gateway not ready", { status: 500 });
    }
    // Forward SSE stream langsung ke browser client
    return new Response(upstream.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
