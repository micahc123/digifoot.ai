// app/api/chat/route.js
import { NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

export async function POST(req) {
  const { message, socialData, apiKey } = await req.json();

  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not provided' }, { status: 400 });
  }

  const configuration = new Configuration({
    apiKey: apiKey,
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that provides insights about a user's digital presence based on their social media data." },
        { role: "user", content: `Here's my social media data: ${JSON.stringify(socialData)}. ${message}` }
      ],
    });

    return NextResponse.json({ response: completion.data.choices[0].message.content });
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}
