import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req) {
  try {
    const { message, socialData } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'OpenAI API key is not provided' }, { status: 500 });
    }

    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const systemMessage = "You are a helpful assistant that provides insights about a user's digital presence based on their social media data. You have access to their username, posts, and bio from Instagram and Facebook. Do not respond to anything that is not related to the user's social media data. The goal of your talking is to describe what is happening in the images, nothing personal that can't be found in the images. also, your goal is to make sure their digital footprint is ok, meaning that there is nothing bad in it, your not trying to elevate their digital presence, your just making sure nothings wrong with it. Things like drinking alcohol, smoking, would result in a bad digital footprint.";
    
    let userMessage = `Here's my social media data: ${JSON.stringify(socialData)}. `;
    
    if (socialData.Instagram) {
      const instagramData = socialData.Instagram;
      userMessage += `My Instagram username is ${instagramData.username}. `;
      userMessage += `My Instagram bio is: ${instagramData.bio}. `;
      
      // Log the Instagram posts to check their structure
      console.log("Instagram Posts Data:", instagramData.posts);

      // Create posts_images directory if it doesn't exist
      const dir = path.join(process.cwd(), 'posts_images');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      // Format posts and download images
      const formattedPosts = await Promise.all(instagramData.posts.map(async post => {
          const caption = post.caption || "No caption available"; // Fallback if no caption
          const imageUrl = post.media_url || post.imageUrl || ""; // Adjust based on your data structure

          // Download the image
          let imagePath;
          if (imageUrl) {
            const imageResponse = await fetch(imageUrl);
            const buffer = await imageResponse.buffer();
            imagePath = path.join(dir, `${post.id}.png`); // Save as PNG

            // Write image to file system
            fs.writeFileSync(imagePath, buffer);
          }

          return { id: post.id, caption, imagePath };
      }));

      userMessage += `Here are my Instagram posts:\n${formattedPosts.map(post => `Post ID: ${post.id}, Caption: "${post.caption}", Image Path: ${post.imagePath}`).join('\n')}. `;
      
      // Prepare images for GPT-4 input
      const imageInputs = formattedPosts.map(post => ({
        role: "user",
        content: `![Image](${post.imagePath})`, // Markdown format for images
      }));
      
      // Send images and user message to GPT-4
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemMessage },
          ...imageInputs,
          { role: "user", content: userMessage }
        ],
      });

      return NextResponse.json({ response: completion.choices[0].message.content });
    }
    
    if (socialData.Facebook) {
      const facebookData = socialData.Facebook;
      userMessage += `My Facebook name is ${facebookData.name}. `;
      userMessage += `Here are my Facebook posts: ${JSON.stringify(facebookData.posts)}. `;
    }
    
    userMessage += message;

    return NextResponse.json({ response: 'No Instagram data found.' });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request' }, { status: 500 });
  }
}