// app/api/chat/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai'; // Correct import statement

export async function POST(req) {
  const { message, socialData } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY; // Accessing the API key

  console.log("Received message:", message); // Log received message
  console.log("Received social data:", socialData); // Log social data
  console.log("API Key:", apiKey); // Log API key for debugging

  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not provided' }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides insights about a user's digital presence based on their social media data." },
        { role: "user", content: `Here's my social media data: ${JSON.stringify(socialData)}. ${message}` }
      ],
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    // Handle rate limit error specifically
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ error: 'You have exceeded your quota for the OpenAI API.' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}