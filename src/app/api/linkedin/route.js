// app/api/linkedin/route.js
import { NextResponse } from 'next/server';
import { Client } from '@linkedin/api-client';

export async function GET(req) {
  const apiKeys = JSON.parse(req.headers.get('x-api-key') || '{}');
  const accessToken = apiKeys.LINKEDIN_ACCESS_TOKEN;

  if (!accessToken) {
    return NextResponse.json({ error: 'LinkedIn Access Token not provided' }, { status: 400 });
  }

  const client = new Client(accessToken);

  try {
    const profile = await client.people.me();
    const posts = await client.ugcPosts.getUgcPosts();
    return NextResponse.json({ profile, posts });
  } catch (error) {
    console.error('Error fetching LinkedIn data:', error);
    return NextResponse.json({ error: 'Failed to fetch LinkedIn data' }, { status: 500 });
  }
}