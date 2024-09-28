// app/api/chat/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { message, socialData } = await req.json();
  const apiKey = process.env.HUGGINGFACE_API_KEY; // Access the Hugging Face API key

  console.log("Received message:", message); // Log received message
  console.log("Received social data:", socialData); // Log social data
  console.log("API Key:", apiKey); // Log API key for debugging

  if (!apiKey) {
    return NextResponse.json({ error: 'Hugging Face API key is not provided' }, { status: 400 });
  }

  // You can replace this with the specific ChatGPT-like model you want to use
  const model = "facebook/blenderbot-400M-distill";

  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        method: "POST",
        body: JSON.stringify({
          inputs: {
            text: `System: You are a helpful assistant that provides insights about a user's digital presence based on their social media data.
User: Here's my social media data: ${JSON.stringify(socialData)}. ${message}`
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // The structure of the response may vary depending on the model
    // Adjust this part based on the actual response structure
    const aiResponse = result[0].generated_text;

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
    
    // Handle rate limit error
    if (error.message.includes('429')) {
      return NextResponse.json({ error: 'You have exceeded your quota for the Hugging Face API.' }, { status: 429 });
    }

    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
}