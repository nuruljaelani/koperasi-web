import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  const apiKey = process.env.NOTIF_API_KEY;
  const apiUrl = process.env.NOTIF_API_URL;
    try {
        const body = await req.json();
        const res = await fetch(`${apiUrl}/devices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
            return NextResponse.json({ message: 'Gagal menyimpan device' }, { status: 500 });
        }
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}