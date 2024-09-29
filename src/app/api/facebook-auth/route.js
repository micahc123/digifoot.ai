import { NextResponse } from 'next/server';

export async function POST(req) {
  const { code } = await req.json();

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    client_secret: process.env.FACEBOOK_APP_SECRET,
    redirect_uri: 'https://localhost:3000/dashboard',
    code: code,
  });

  const response = await fetch(`https://graph.facebook.com/v12.0/oauth/access_token?${params.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();

  if (data.access_token) {
    return NextResponse.json({ accessToken: data.access_token });
  } else {
    return NextResponse.json({ error: 'Failed to get access token' }, { status: 400 });
  }
}