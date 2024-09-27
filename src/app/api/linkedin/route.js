// app/api/linkedin/route.js
import { NextResponse } from 'next/server';
import { Client } from '@linkedin/api-client';

export async function GET() {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
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