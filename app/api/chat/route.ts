import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are Siddiq AI. Return ONLY plain HTML with Tailwind CSS.
          
          IMAGE RULES:
          - Use this format for images: https://loremflickr.com/800/600/[keyword]
          - Keywords should be like: dubai,luxury,villa,car,apartment.
          - Example: <img src="https://loremflickr.com/800/600/dubai,villa" class="rounded-2xl" />
          
          DESIGN RULES:
          - Use FontAwesome 6 (fas fa-...) for icons.
          - Make it look like a high-end Dubai brand.
          - Return the FULL HTML every time.`,
        },
        ...messages,
      ],
    });

    return NextResponse.json({ code: response.choices[0].message.content });
  } catch (error) {
    return NextResponse.json({ error: 'AI Error' }, { status: 500 });
  }
}