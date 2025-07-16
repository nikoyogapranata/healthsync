    //app\api\chat\route.ts
    
    import { GoogleGenerativeAI } from "@google/generative-ai";
    import { NextResponse } from "next/server";

    export async function POST(req: Request) {
    if (!process.env.GEMINI_API_KEY) {
        return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
        );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    try {
        const { message } = await req.json();

        const prompt = `
        You are HealthSync AI, a friendly and helpful virtual assistant for a patient dashboard. 
        Your goal is to assist patients with general health questions, provide information about hospital services, 
        or explain medical terms in a simple way. 
        
        IMPORTANT: Detect the language of the user's question (e.g., English, Indonesian) and ALWAYS respond in the same language.
        IMPORTANT SAFETY RULE: Do NOT provide medical diagnoses or prescribe medication. 
        If asked for a diagnosis, prescription, or any critical medical advice, you must gently decline and strongly advise the user to consult a real doctor.
        
        Patient's question: "${message}"
        `;
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        return NextResponse.json({ response: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
        );
    }
    }