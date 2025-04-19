import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request) {
  const key = process.env.GOOGLE_API_KEY;

  const { prompt } = await request.json();
  

  // Ensure the CORS headers are set
  const responseHeaders = new Headers();
  responseHeaders.set("Access-Control-Allow-Origin", "*"); // Allow all origins
  responseHeaders.set("Access-Control-Allow-Methods", "POST");
  responseHeaders.set("Access-Control-Allow-Headers", "Content-Type");

  // If it's a preflight (OPTIONS) request, return 200 status with CORS headers
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 200,
      headers: responseHeaders,
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const enhancedPrompt = `Rewrite the following prompt to make it more clear, detailed, and useful for both humans and AI. Focus on improving structure, grammar, and precision without changing the original intent. Do not add creative flair or excessive tone. Do not return multiple options. Do not include any explanation or labels — only return the enhanced prompt. Prompt: "${prompt}"`;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Adjust as necessary
      contents: enhancedPrompt,
    });

    const text = aiResponse.candidates[0].content.parts[0].text;

    // Return the response with the appropriate CORS headers
    return new NextResponse(
      JSON.stringify({ text }),
      { status: 200, headers: responseHeaders }
    );
  } catch (error) {
    console.error("Error during API request:", error);
    return new NextResponse(
      JSON.stringify({ error: 'An error occurred while processing the prompt.' }),
      { status: 500, headers: responseHeaders }
    );
  }
}
