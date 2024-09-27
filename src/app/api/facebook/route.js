// app/api/facebook/route.js
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
  const apiVersion = 'v16.0';
  const fields = 'id,name,posts{message,created_time,likes.summary(true)}';

  try {
    const response = await axios.get(`https://graph.facebook.com/${apiVersion}/me?fields=${fields}&access_token=${accessToken}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching Facebook data:', error);
    return NextResponse.json({ error: 'Failed to fetch Facebook data' }, { status: 500 });
  }
}