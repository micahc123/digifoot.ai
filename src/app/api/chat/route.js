import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
  const { message, socialData } = await req.json();
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not provided' }, { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
  });

  try {
    const systemMessage = "You are a helpful assistant that provides insights about a user's digital presence based on their social media data. You have access to their username, posts, and bio from Instagram.";
    
    let userMessage = `Here's my social media data: ${JSON.stringify(socialData)}. `;
    
    if (socialData.Instagram) {
      const instagramData = socialData.Instagram;
      userMessage += `My Instagram username is ${instagramData.username}. `;
      userMessage += `My Instagram bio is: ${instagramData.bio}. `;
      userMessage += `Here are my Instagram posts: ${JSON.stringify(instagramData.posts)}. `;
    }
    
    userMessage += message;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage }
      ],
    });

    return NextResponse.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    
    if (error.code === 'insufficient_quota') {
      return NextResponse.json({ error: 'You have exceeded your quota for the OpenAI API.' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}