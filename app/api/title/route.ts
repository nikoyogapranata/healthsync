import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not configured" }, { status: 500 });
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
try {
    const { firstUserMessage, firstAiMessage } = await req.json();
    const prompt = `Based on the following start of a conversation, create a very short, concise title (4-6 words max). The title should summarize the user's main intent. Do not use quotation marks. Respond only with the title text. User's first question: "${firstUserMessage}" AI's first response: "${firstAiMessage}" TITLE:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ title: text.trim() });
} catch (error) {
    console.error("Error generating title:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
}
