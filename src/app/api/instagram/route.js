// app/api/instagram/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;

  try {
    const response = await axios.get(`https://graph.instagram.com/v12.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    return NextResponse.json({ error: 'Failed to fetch Instagram data' }, { status: 500 });
  }
}