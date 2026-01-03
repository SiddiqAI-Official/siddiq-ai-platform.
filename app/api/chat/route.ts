import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    // Ab hum sirf aik prompt nahi, balkay puri history (messages) le rahe hain
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI, a world-class web designer from Dubai. 
          Your task is to return ONLY plain HTML code with Tailwind CSS classes. 
          - ALWAYS return the FULL and COMPLETE updated HTML code.
          - If the user asks for a change, apply it to the previous design and return the whole thing.
          - DO NOT write React, imports, or exports.
          - DO NOT use markdown code blocks like \`\`\`html.
          - Just give the raw HTML content.`,
        },
        ...messages, // Ye line AI ko purani saari history yaad dilayegi
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}