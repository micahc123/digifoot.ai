import { NextResponse } from 'next/server';

export async function POST(req) {
  const { code } = await req.json();

  const response = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID,
      client_secret: process.env.INSTAGRAM_APP_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: 'https://localhost:3000/dashboard',
      code: code,
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    return NextResponse.json({ accessToken: data.access_token });
  } else {
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
  }
}