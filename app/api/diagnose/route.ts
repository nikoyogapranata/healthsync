// src/app/api/diagnose/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

// Define the expected structure of the historical EHR data
interface EHRReferenceData {
  symptoms: string
  diagnosis_description: string
  treatment_plan: string
  similarity_score: number
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const {
      subjectiveComplaint,
      referenceEHRData,
    }: {
      subjectiveComplaint: string
      referenceEHRData: EHRReferenceData[]
    } = await request.json()

    if (!subjectiveComplaint) {
      return NextResponse.json({ error: "Subjective complaint is required." }, { status: 400 })
    }

    // --- The Magic: Prompt Engineering ---
    // This prompt instructs the AI on its role, provides the new data, and uses
    // the old EHR data as supporting evidence.
    const prompt = `
      You are a highly intelligent medical AI assistant for doctors. Your role is to provide a preliminary diagnostic analysis based on a patient's symptoms and reference similar historical cases from our EHR. Your output must be in Markdown format.

      **Your Task:**
      1. Analyze the "Current Patient Complaint".
      2. Review the "Reference Historical Cases" which have been identified as similar.
      3. Provide a "Likely Diagnosis" with a confidence level (High, Medium, Low).
      4. Suggest a "Recommended Treatment Plan" based on a synthesis of the complaint and the successful treatments from the reference cases.
      5. List 2-3 "Alternative Diagnoses" to consider.
      6. Include a section for "Important Clinical Notes" or red flags for the doctor to consider.
      7. **CRITICAL:** Conclude with the disclaimer: "This is an AI-generated analysis and is not a substitute for professional medical judgment. The final diagnosis and treatment are the doctor's responsibility."

      ---

      **Current Patient Complaint:**
      "${subjectiveComplaint}"

      ---

      **Reference Historical Cases (ordered by similarity):**
      ${
        referenceEHRData.length > 0
          ? referenceEHRData
              .map(
                (ehr) => `
                  - **Case Diagnosis:** ${ehr.diagnosis_description} (Similarity: ${Math.round(ehr.similarity_score)}%)
                  - **Symptoms:** ${ehr.symptoms}
                  - **Successful Treatment:** ${ehr.treatment_plan}
                `,
              )
              .join("\n")
          : "No similar historical cases were found in the EHR database."
      }
    `

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    return NextResponse.json({ recommendation: text })
  } catch (error) {
    console.error("Error calling Gemini API:", error)
    return NextResponse.json({ error: "Failed to get AI recommendation." }, { status: 500 })
  }
}