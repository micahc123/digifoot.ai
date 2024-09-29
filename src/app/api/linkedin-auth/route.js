import { NextResponse } from 'next/server';

export async function POST(req) {
  const { code } = await req.json();

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
  const redirectUri = 'https://localhost:3000/dashboard';

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error(`LinkedIn token exchange failed: ${tokenResponse.statusText}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error in LinkedIn authentication:', error);
    return NextResponse.json({ error: 'Failed to authenticate with LinkedIn' }, { status: 500 });
  }
}