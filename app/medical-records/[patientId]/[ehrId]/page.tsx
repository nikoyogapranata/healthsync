"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useParams, useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { cn } from "@/lib/utils"

// PDF Generation Imports
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// Import ReactMarkdown
import ReactMarkdown from "react-markdown"

// --- Icon Imports ---
import {
  FileText,
  Plus,
  ArrowLeft,
  Edit,
  Loader2,
  Users,
  LayoutDashboard,
  CalendarDays,
  Phone,
  Mail,
  AlertCircle,
  Database,
  Brain,
} from "lucide-react"

// --- UI Component Imports ---
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"

// --- TypeScript Interfaces ---
interface DoctorProfile {
  doctor_id: string
  full_name: string
}

interface PatientProfile {
  patient_id: string
  full_name: string
  date_of_birth: string
  gender: string
  address: string
  users: { email: string } | null
  phone_number: string
  patient_allergies: { allergy_type: { name: string } }[]
}

interface DiagnosisHistory {
  diagnosis_description: string
  treatment_plan: string
  created_at: string
  symptoms: string
  symptoms_duration: string
  doctor_name: string
  ehr_id: string
}

interface DetailedEHR {
  ehr_id: string
  patient_id: string
  doctor_id: string
  created_at: string
  visit_reason: string
  patients: PatientProfile | null
  doctors: { full_name: string } | null
  healthcare_facilities: { name: string; healthcare_facility_id: string } | null
  diagnosis: any[]
  prescriptions: any[]
  examinations: any[]
  physical_examinations: any[]
  doctor_notes: any[]
  vaccinations: any[]
}

interface EHRReferenceData {
  ehr_id: string
  symptoms: string
  diagnosis_description: string
  treatment_plan: string
  symptoms_duration: string
  doctor_name: string
  created_at: string
  similarity_score: number
}

// --- [ENHANCED] Dialog Component for AI Diagnosis ---
function AddDiagnosisDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: any, dataType: string) => Promise<void>
  isSubmitting: boolean
}) {
  const [isAILoading, setIsAILoading] = useState(false)
  const [aiRecommendation, setAiRecommendation] = useState("")
  const [aiError, setAiError] = useState("")
  const [subjectiveComplaint, setSubjectiveComplaint] = useState("")
  const [referenceEHRData, setReferenceEHRData] = useState<EHRReferenceData[]>([])
  const [analysisStats, setAnalysisStats] = useState<{
    totalRecords: number
    matchingRecords: number
    topMatch: EHRReferenceData | null
  }>({ totalRecords: 0, matchingRecords: 0, topMatch: null })
  const supabase = createClient()

  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      setSubjectiveComplaint("")
      setAiRecommendation("")
      setAiError("")
      setReferenceEHRData([])
      setAnalysisStats({ totalRecords: 0, matchingRecords: 0, topMatch: null })
    }
  }, [open])

  const fetchAllEHRDiagnosisData = async (): Promise<EHRReferenceData[]> => {
    try {
      const { data: allDiagnosis, error: diagnosisError } = await supabase
        .from("diagnosis")
        .select(
          `
          ehr_id,
          symptoms,
          diagnosis_description,
          treatment_plan,
          symptoms_duration,
          created_at,
          doctors!inner(full_name)
        `,
        )
        .not("symptoms", "is", null)
        .not("diagnosis_description", "is", null)
        .order("created_at", { ascending: false })

      if (diagnosisError) {
        throw new Error(`Error fetching diagnosis data: ${diagnosisError.message}`)
      }

      if (!allDiagnosis || allDiagnosis.length === 0) {
        throw new Error("Tidak ada data diagnosis yang tersedia di database untuk referensi AI.")
      }

      const referenceData: EHRReferenceData[] = allDiagnosis.map((record: any) => ({
        ehr_id: record.ehr_id,
        symptoms: record.symptoms || "",
        diagnosis_description: record.diagnosis_description || "",
        treatment_plan: record.treatment_plan || "",
        symptoms_duration: record.symptoms_duration || "",
        doctor_name: record.doctors?.full_name || "Unknown Doctor",
        created_at: record.created_at,
        similarity_score: 0,
      }))

      console.log(`Successfully fetched ${referenceData.length} diagnosis records for AI analysis`)
      return referenceData
    } catch (error: any) {
      console.error("Error fetching EHR diagnosis data:", error)
      throw error
    }
  }

  const calculateSymptomSimilarity = (currentComplaint: string, referenceSymptoms: string): number => {
    if (!currentComplaint || !referenceSymptoms) return 0
    const currentLower = currentComplaint.toLowerCase()
    const referenceLower = referenceSymptoms.toLowerCase()
    const symptomKeywords = [
      { terms: ["batuk", "cough"], weight: 3 },
      { terms: ["pilek", "rhinorrhea", "runny nose", "ingus"], weight: 3 },
      { terms: ["hidung tersumbat", "nasal congestion", "tersumbat"], weight: 3 },
      { terms: ["bersin", "sneezing"], weight: 2 },
      { terms: ["sesak", "shortness of breath", "dyspnea"], weight: 4 },
      { terms: ["mata berair", "watery eyes", "mata gatal", "itchy eyes"], weight: 2 },
      { terms: ["sakit tenggorokan", "sore throat", "throat pain"], weight: 3 },
      { terms: ["demam", "fever", "panas"], weight: 4 },
      { terms: ["gatal", "itchy", "pruritus"], weight: 2 },
      { terms: ["nyeri", "pain", "sakit"], weight: 3 },
      { terms: ["mual", "nausea"], weight: 2 },
      { terms: ["muntah", "vomiting"], weight: 3 },
      { terms: ["pusing", "dizziness", "vertigo"], weight: 2 },
      { terms: ["lelah", "fatigue", "tired"], weight: 1 },
      { terms: ["alergi", "allergy", "allergic"], weight: 4 },
      { terms: ["asma", "asthma"], weight: 4 },
    ]
    let totalScore = 0
    let maxPossibleScore = 0
    symptomKeywords.forEach((symptomGroup) => {
      const foundInCurrent = symptomGroup.terms.some((term) => currentLower.includes(term))
      const foundInReference = symptomGroup.terms.some((term) => referenceLower.includes(term))
      maxPossibleScore += symptomGroup.weight
      if (foundInCurrent && foundInReference) {
        totalScore += symptomGroup.weight
      }
    })
    const similarityPercentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0
    const currentWords = currentLower.split(/\s+/)
    const referenceWords = referenceLower.split(/\s+/)
    const commonWords = currentWords.filter((word) => word.length > 3 && referenceWords.includes(word))
    const bonusScore = Math.min(commonWords.length * 5, 20)
    return Math.min(similarityPercentage + bonusScore, 100)
  }

  const detectLanguage = (text: string): "id" | "en" => {
    const enKeywords = ["fever", "cough", "pain", "headache", "sore throat", "and", "the", "is", "for"]
    const idKeywords = ["demam", "batuk", "nyeri", "sakit kepala", "sakit tenggorokan", "dan", "yang", "adalah", "selama"]
    const lowerText = text.toLowerCase()
    let enScore = 0
    let idScore = 0
    enKeywords.forEach((k) => {
      if (lowerText.includes(k)) enScore++
    })
    idKeywords.forEach((k) => {
      if (lowerText.includes(k)) idScore++
    })
    return enScore > idScore ? "en" : "id"
  }

  const templates = {
    id: {
      noMatchTitle: "### 🤖 Analisis AI Tidak Menemukan Kecocokan Signifikan",
      noMatchStatus: "#### 📊 Status Analisis",
      noMatchRecommendation: "#### 💡 Rekomendasi",
      noMatchImportantNote: "#### ⚠️ Catatan Penting",
      noMatchRecoText:
        "Berdasarkan keluhan yang disampaikan, diperlukan evaluasi klinis yang komprehensif. Disarankan untuk:\n- Melakukan anamnesis mendalam.\n- Melaksanakan pemeriksaan fisik yang relevan.\n- Mempertimbangkan pemeriksaan penunjang jika diperlukan.",
      noMatchNoteText: "Diagnosis akhir harus selalu didasarkan pada evaluasi klinis langsung oleh dokter.",
      matchTitle: "### 🤖 Hasil Analisis AI & Referensi EHR",
      analysisSummary: "#### 📊 Ringkasan Analisis",
      totalAnalyzed: "Total Rekam Medis Dianalisis",
      matchingRecords: "Rekam Medis dengan Kecocokan",
      topMatchScore: "Tingkat Kecocokan Tertinggi",
      mostLikelyDiagnosis: "### 🎯 Diagnosis Paling Mungkin",
      confidence: "Tingkat Kepercayaan",
      high: "Tinggi",
      medium: "Sedang",
      low: "Rendah",
      similarCase: "#### 📋 Referensi Kasus Serupa",
      referenceSymptoms: "Gejala",
      referenceDuration: "Durasi",
      referenceDoctor: "Dokter",
      referenceDate: "Tanggal",
      recommendedActions: "#### 💊 Rekomendasi Rencana Tindakan",
      actionIntro: "Berdasarkan protokol dari kasus serupa yang terbukti efektif:",
      alternativeDiagnosis: "### 🔍 Diagnosis Alternatif",
      importantClinicalNotes: "### ⚠️ Catatan Klinis Penting",
      clinicalNotesList: [
        "Lakukan pemeriksaan fisik untuk konfirmasi temuan diagnosis.",
        "Selalu pertimbangkan riwayat alergi pasien dan potensi kontraindikasi obat.",
        "Evaluasi kembali respons pasien terhadap pengobatan pada sesi follow-up.",
        "**Keputusan final diagnosis dan perawatan tetap menjadi tanggung jawab klinis dokter.**",
      ],
    },
    en: {
      noMatchTitle: "### 🤖 AI Analysis Found No Significant Match",
      noMatchStatus: "#### 📊 Analysis Status",
      noMatchRecommendation: "#### 💡 Recommendation",
      noMatchImportantNote: "#### ⚠️ Important Note",
      noMatchRecoText:
        "Based on the complaint, a comprehensive clinical evaluation is required. It is recommended to:\n- Conduct a thorough anamnesis.\n- Perform a relevant physical examination.\n- Consider ancillary tests if clinically indicated.",
      noMatchNoteText: "The final diagnosis must always be based on a direct clinical evaluation by the doctor.",
      matchTitle: "### 🤖 AI Analysis & EHR Reference",
      analysisSummary: "#### 📊 Analysis Summary",
      totalAnalyzed: "Total Records Analyzed",
      matchingRecords: "Matching Records",
      topMatchScore: "Highest Match Score",
      mostLikelyDiagnosis: "### 🎯 Most Likely Diagnosis",
      confidence: "Confidence Level",
      high: "High",
      medium: "Medium",
      low: "Low",
      similarCase: "#### 📋 Similar Case Reference",
      referenceSymptoms: "Symptoms",
      referenceDuration: "Duration",
      referenceDoctor: "Doctor",
      referenceDate: "Date",
      recommendedActions: "#### 💊 Recommended Action Plan",
      actionIntro: "Based on protocols from proven similar cases:",
      alternativeDiagnosis: "### 🔍 Alternative Diagnoses",
      importantClinicalNotes: "### ⚠️ Important Clinical Notes",
      clinicalNotesList: [
        "Perform a physical examination to confirm the diagnostic findings.",
        "Always consider the patient's allergy history and potential drug contraindications.",
        "Re-evaluate the patient's response to treatment in a follow-up session.",
        "**The final diagnosis and treatment decisions remain the clinical responsibility of the doctor.**",
      ],
    },
  }

  const generateEnhancedAIRecommendation = (
    complaint: string,
    referenceData: EHRReferenceData[],
    stats: typeof analysisStats,
  ): string => {
    const lang = detectLanguage(complaint)
    const T = templates[lang]

    const topMatches = referenceData.filter((record) => record.similarity_score > 20).slice(0, 3)

    if (topMatches.length === 0) {
      return `${T.noMatchTitle}\n\n> *"${complaint}"*\n\n---\n\n${T.noMatchStatus}\n- **${T.totalAnalyzed}:** ${stats.totalRecords}\n- **Matching Records (>20%):** 0\n\n${T.noMatchRecommendation}\n${T.noMatchRecoText}\n\n---\n\n${T.noMatchImportantNote}\n- ${T.noMatchNoteText}`
    }

    const primaryMatch = topMatches[0]
    const score = primaryMatch.similarity_score
    const confidenceLevel = score >= 70 ? T.high : score >= 50 ? T.medium : T.low

    const formattedTreatmentPlan = primaryMatch.treatment_plan
      .split(/\d+\.\s*|\n\s*-\s*/)
      .filter((plan) => plan.trim() !== "")
      .map((plan) => `- ${plan.trim()}`)
      .join("\n")

    let recommendationText = `${T.matchTitle}\n\n> *"${complaint}"*\n\n---\n\n${T.analysisSummary}\n- **${T.totalAnalyzed}:** ${stats.totalRecords}\n- **${T.matchingRecords}:** ${stats.matchingRecords}\n- **${T.topMatchScore}:** ${Math.round(score)}%\n\n---\n\n${T.mostLikelyDiagnosis}\n**${primaryMatch.diagnosis_description}**\n*(${T.confidence}: **${confidenceLevel} - ${Math.round(score)}%**)*\n\n${T.similarCase} (EHR: \`${primaryMatch.ehr_id.substring(0, 8)}...\`)\n- **${T.referenceSymptoms}:** ${primaryMatch.symptoms}\n- **${T.referenceDuration}:** ${primaryMatch.symptoms_duration}\n- **${T.referenceDoctor}:** ${primaryMatch.doctor_name}\n- **${T.referenceDate}:** ${new Date(primaryMatch.created_at).toLocaleDateString(lang === "en" ? "en-CA" : "id-ID")}\n\n${T.recommendedActions}\n${T.actionIntro}\n${formattedTreatmentPlan}`

    if (topMatches.length > 1) {
      recommendationText += `\n\n---\n\n${T.alternativeDiagnosis}\n`
      topMatches.slice(1).forEach((match, index) => {
        recommendationText += `${index + 1}. **${match.diagnosis_description}** (${Math.round(match.similarity_score)}% match)\n`
      })
    }

    recommendationText += `\n\n---\n\n${T.importantClinicalNotes}\n`
    T.clinicalNotesList.forEach((note) => {
      recommendationText += `- ${note}\n`
    })

    return recommendationText.trim()
  }

  const handleGetAIRecommendation = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !sessionData.session) {
      setAiError("Gagal memverifikasi sesi pengguna. Pastikan Anda sudah login.")
      return
    }
    if (!subjectiveComplaint.trim()) {
      toast({
        title: "Informasi Kurang",
        description: "Silakan isi keluhan pasien terlebih dahulu untuk mendapatkan rekomendasi AI.",
        variant: "destructive",
      })
      return
    }
    setIsAILoading(true)
    setAiRecommendation("")
    setAiError("")
    try {
      const allReferenceData = await fetchAllEHRDiagnosisData()
      const scoredData = allReferenceData.map((record) => ({
        ...record,
        similarity_score: calculateSymptomSimilarity(subjectiveComplaint, record.symptoms),
      }))
      const sortedData = scoredData.sort((a, b) => b.similarity_score - a.similarity_score)
      const relevantMatches = sortedData.filter((record) => record.similarity_score > 20)
      const stats = {
        totalRecords: allReferenceData.length,
        matchingRecords: relevantMatches.length,
        topMatch: sortedData[0] || null,
      }
      setReferenceEHRData(sortedData)
      setAnalysisStats(stats)
      const recommendation = generateEnhancedAIRecommendation(subjectiveComplaint, sortedData, stats)
      setAiRecommendation(recommendation)
    } catch (error: any) {
      setAiError(error.message || "Gagal mendapatkan rekomendasi dari Asisten AI.")
    } finally {
      setIsAILoading(false)
    }
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    const finalData = {
      ...data,
      symptoms: subjectiveComplaint,
      symptoms_duration: data.symptoms_duration || "Tidak disebutkan",
    }
    onSubmit(finalData, "Diagnosis")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Diagnosis Baru dengan AI Assistant
          </DialogTitle>
          <DialogDescription>
            Masukkan keluhan pasien untuk mendapatkan rekomendasi diagnosis berbasis AI dari database EHR lengkap.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Form Diagnosis</h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subjective_complaint">
                  Keluhan Pasien (Anamnesis) <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="subjective_complaint"
                  name="symptoms"
                  required
                  placeholder="Contoh: Pasien datang dengan keluhan hidung tersumbat, pilek, bersin-bersin, dan mata berair..."
                  className="min-h-[120px]"
                  value={subjectiveComplaint}
                  onChange={(e) => setSubjectiveComplaint(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms_duration">Durasi Gejala</Label>
                <Input id="symptoms_duration" name="symptoms_duration" placeholder="Contoh: 3 bulan, memburuk dalam 2 minggu" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diagnosis_description">
                  Diagnosis Dokter (Final) <span className="text-red-500">*</span>
                </Label>
                <Input id="diagnosis_description" name="diagnosis_description" required placeholder="Contoh: Allergic Rhinitis" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="treatment_plan">
                  Rencana Perawatan <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="treatment_plan"
                  name="treatment_plan"
                  required
                  rows={6}
                  placeholder="Contoh: 1. Berikan antihistamin dan nasal spray..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="needs_followup">Perlu Follow-up?</Label>
                <select id="needs_followup" name="needs_followup" className="w-full p-2 border rounded-md">
                  <option value="false">Tidak</option>
                  <option value="true">Ya</option>
                </select>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Batal
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Simpan Diagnosis
                </Button>
              </DialogFooter>
            </form>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Assistant
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGetAIRecommendation}
                disabled={isAILoading || !subjectiveComplaint.trim()}
                className="shrink-0 bg-transparent"
              >
                {isAILoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                {isAILoading ? "Menganalisis..." : "Analisis AI"}
              </Button>
            </div>

            {analysisStats.totalRecords > 0 && (
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="font-semibold text-blue-700">{analysisStats.totalRecords}</div>
                  <div className="text-blue-600">Total EHR</div>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className="font-semibold text-green-700">{analysisStats.matchingRecords}</div>
                  <div className="text-green-600">Cocok</div>
                </div>
                <div className="bg-purple-50 p-2 rounded text-center">
                  <div className="font-semibold text-purple-700">
                    {analysisStats.topMatch ? Math.round(analysisStats.topMatch.similarity_score) : 0}%
                  </div>
                  <div className="text-purple-600">Akurasi</div>
                </div>
              </div>
            )}

            <div className="border rounded-lg p-4 min-h-[500px] bg-gradient-to-br from-blue-50/50 to-indigo-50/30 text-sm max-h-[600px] overflow-y-auto">
              {isAILoading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Loader2 className="h-8 w-8 animate-spin mb-3 text-blue-500" />
                  <p className="font-medium">Menganalisis keluhan pasien...</p>
                  <p className="text-xs mt-1">Memproses database EHR lengkap</p>
                </div>
              )}

              {aiError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{aiError}</AlertDescription>
                </Alert>
              )}

              {aiRecommendation && (
                <div className="prose prose-sm max-w-none prose-headings:font-semibold prose-h3:mb-3 prose-h4:mb-2 prose-p:my-1 prose-ul:my-2 prose-li:my-1.5 prose-blockquote:not-italic prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:text-gray-600">
                  <ReactMarkdown>{aiRecommendation}</ReactMarkdown>
                  {analysisStats.totalRecords > 0 && (
                    <div className="mt-4 p-3 bg-green-100 rounded-md border-l-4 border-green-500 not-prose">
                      <p className="text-xs text-green-700 font-medium">
                        ✅ Analisis berhasil menggunakan {analysisStats.totalRecords} rekam medis dari database
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!isAILoading && !aiRecommendation && !aiError && (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <Brain className="h-12 w-12 text-blue-300 mb-3" />
                  <p className="font-semibold text-gray-700">AI Diagnosis Assistant</p>
                  <p className="mt-2 text-sm">
                    Masukkan keluhan pasien di form sebelah kiri, lalu klik "Analisis AI" untuk mendapatkan rekomendasi.
                  </p>
                  <div className="mt-3 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Analisis berbasis seluruh data EHR
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AddEhrDataDialog({
  dataType,
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: {
  dataType: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (formData: any, dataType: string) => Promise<void>
  isSubmitting: boolean
}) {
  if (!dataType) return null

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const data = Object.fromEntries(formData.entries())
    onSubmit(data, dataType)
  }

  const renderFormFields = () => {
    switch (dataType) {
      case "Prescription":
        return (
          <>
            <Label htmlFor="medication_name">Medication Name</Label>
            <Input id="medication_name" name="medication_name" required />
            <Label htmlFor="dosage">Dosage</Label>
            <Input id="dosage" name="dosage" required />
            <Label htmlFor="duration">Duration</Label>
            <Input id="duration" name="duration" required />
            <Label htmlFor="instruction">Instruction</Label>
            <Textarea id="instruction" name="instruction" required />
          </>
        )
      case "Examination":
        return (
          <>
            <Label htmlFor="examination_name">Examination Name</Label>
            <Input id="examination_name" name="examination_name" required />
            <Label htmlFor="examination_type">Type (e.g., Blood Test, X-Ray)</Label>
            <Input id="examination_type" name="examination_type" required />
            <Label htmlFor="note">Result / Note</Label>
            <Textarea id="note" name="note" required />
          </>
        )
      case "Note":
        return (
          <>
            <Label htmlFor="note">Doctor's Note</Label>
            <Textarea id="note" name="note" required className="min-h-[150px]" />
          </>
        )
      case "Vaccination":
        return (
          <>
            <Label htmlFor="vaccine_name">Vaccine Name</Label>
            <Input id="vaccine_name" name="vaccine_name" required />
            <Label htmlFor="vaccine_type">Vaccine Type</Label>
            <Input id="vaccine_type" name="vaccine_type" />
            <Label htmlFor="dose_number">Dose Number</Label>
            <Input id="dose_number" name="dose_number" required />
          </>
        )
      default:
        return <p>Form not available for this data type.</p>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New {dataType}</DialogTitle>
          <DialogDescription>Fill out the details below to add a new entry to the record.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">{renderFormFields()}</div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const generateEHR_PDF = (patient: PatientProfile, ehr: DetailedEHR) => {
  const doc = new jsPDF()
  let y = 15

  const addSection = (title: string, content: () => void) => {
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage()
      y = 15
    }
    doc.setFontSize(16)
    doc.text(title, 14, y)
    y += 8
    doc.setFontSize(11)
    content()
  }

  doc.setFontSize(22)
  doc.text("HealthSync Medical Record Summary", 14, y)
  y += 10

  addSection("Patient Information", () => {
    autoTable(doc, {
      startY: y,
      body: [
        ["Name", patient.full_name],
        ["Date of Birth", new Date(patient.date_of_birth).toLocaleDateString()],
        ["Gender", patient.gender],
        ["Contact", `${patient.phone_number || "N/A"} | ${patient.users?.email || "N/A"}`],
        ["Address", patient.address || "N/A"],
      ],
      theme: "grid",
      styles: { cellPadding: 2, fontSize: 10 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  })

  addSection("Visit Information", () => {
    autoTable(doc, {
      startY: y,
      body: [
        ["Facility", ehr.healthcare_facilities?.name || "N/A"],
        ["Attending Doctor", ehr.doctors?.full_name || "N/A"],
        ["Date of Visit", new Date(ehr.created_at).toLocaleDateString()],
      ],
      theme: "grid",
    })
    y = (doc as any).lastAutoTable.finalY + 10
  })

  if (ehr.diagnosis.length > 0) {
    addSection("Diagnoses", () => {
      autoTable(doc, {
        startY: y,
        head: [["Date", "Diagnosis", "Doctor", "Treatment Plan"]],
        body: ehr.diagnosis.map((d: any) => [
          new Date(d.created_at).toLocaleDateString(),
          d.diagnosis_description,
          d.doctors.full_name,
          d.treatment_plan,
        ]),
        theme: "striped",
      })
      y = (doc as any).lastAutoTable.finalY + 10
    })
  }

  if (ehr.prescriptions.length > 0) {
    addSection("Medications Prescribed", () => {
      autoTable(doc, {
        startY: y,
        head: [["Date", "Medication", "Dosage", "Instructions"]],
        body: ehr.prescriptions.map((p: any) => [
          new Date(p.created_at).toLocaleDateString(),
          p.medication_name,
          p.dosage,
          p.instruction,
        ]),
        theme: "striped",
      })
      y = (doc as any).lastAutoTable.finalY + 10
    })
  }

  doc.save(
    `HealthSync_Record_${patient.full_name.replace(" ", "_")}_${new Date(ehr.created_at).toLocaleDateString(
      "en-CA",
    )}.pdf`,
  )
}

const doctorNavigationItems = [
  { title: "Dashboard", url: "/doctor-dashboard", icon: LayoutDashboard },
  { title: "Patient Queue", url: "/doctor-queue", icon: Users },
  {
    title: "Medical Records",
    url: "/medical-records",
    icon: FileText,
    isActive: true,
  },
  { title: "My Schedule", url: "/doctor-schedule", icon: CalendarDays },
]

function DoctorSidebar() {
  const pathname = usePathname()
  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="border-b border-border/40 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
              <Link
                href="/doctor-dashboard"
                className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center"
              >
                <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                  <Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28} />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-bold text-lg text-foreground">HealthSync</span>
                  <span className="text-xs text-muted-foreground font-medium">Doctor Panel</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {doctorNavigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.url === pathname}
                    tooltip={item.title}
                    className={cn(
                      "h-11 px-3 rounded-lg font-medium transition-all duration-200",
                      "hover:bg-accent/50 hover:text-accent-foreground",
                      "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#3FB6F6]/10 data-[active=true]:to-[#34D399]/10",
                      "data-[active=true]:border data-[active=true]:border-[#3FB6F6]/20",
                      "data-[active=true]:text-[#3FB6F6] data-[active=true]:font-semibold",
                      "data-[active=true]:shadow-sm",
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="size-5" />
                      <span className="text-sm group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default function DoctorSingleEHRDetail() {
  const supabase = createClient()
  const router = useRouter()
  const { ehrId } = useParams<{ ehrId: string }>()

  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null)
  const [ehr, setEhr] = useState<DetailedEHR | null>(null)
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingEHR, setEditingEHR] = useState<DetailedEHR | null | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showDownloadDialog, setShowDownloadDialog] = useState(false)
  const [addingDataType, setAddingDataType] = useState<string | null>(null)
  const [isDiagnosisDialogOpen, setIsDiagnosisDialogOpen] = useState(false)

  useEffect(() => {
    const fetchEHRDetails = async () => {
      if (!ehrId) return
      setLoading(true)
      setError(null)
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Authentication failed.")

        const { data: doctor, error: doctorError } = await supabase
          .from("doctors")
          .select("doctor_id, full_name")
          .eq("user_id", user.id)
          .single()
        if (doctorError) throw new Error("Could not find your doctor profile.")
        setDoctorProfile(doctor)

        const { data: ehrData, error: ehrError } = await supabase
          .from("ehr")
          .select(`
            *, 
            patients!inner(*, users(email), patient_allergies(*, allergy_type(name))), 
            doctors(full_name), 
            healthcare_facilities(*), 
            diagnosis(*, doctors(full_name)), 
            prescriptions(*), 
            examinations(*), 
            physical_examinations(*), 
            doctor_notes(*), 
            vaccinations(*)
          `)
          .eq("ehr_id", ehrId)
          .single()
        if (ehrError) throw new Error(`Could not fetch EHR record: ${ehrError.message}`)

        const detailedEhrData = ehrData as DetailedEHR
        setEhr(detailedEhrData)

        if (detailedEhrData?.patients?.patient_id) {
          const { data: historyData, error: historyError } = await supabase
            .from("diagnosis")
            .select(`
              diagnosis_description, 
              treatment_plan, 
              created_at, 
              symptoms, 
              symptoms_duration, 
              ehr_id,
              doctors(full_name)
            `)
            .eq("patient_id", detailedEhrData.patients.patient_id)
            .neq("ehr_id", ehrId)
            .order("created_at", { ascending: false })
          
          if (historyError) {
            console.warn("Could not fetch diagnosis history:", historyError.message)
          } else {
            const formattedHistory: DiagnosisHistory[] = (historyData || []).map((record: any) => ({
              diagnosis_description: record.diagnosis_description,
              treatment_plan: record.treatment_plan,
              created_at: record.created_at,
              symptoms: record.symptoms || "",
              symptoms_duration: record.symptoms_duration || "",
              doctor_name: record.doctors?.full_name || "Unknown Doctor",
              ehr_id: record.ehr_id,
            }))
            setDiagnosisHistory(formattedHistory)
          }
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchEHRDetails()
  }, [ehrId, supabase])

  const handleUpdateVisitReason = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!editingEHR) return
    setIsSubmitting(true)
    const formData = new FormData(event.currentTarget)
    const visitReason = formData.get("visit_reason") as string
    try {
      const { error } = await supabase.from("ehr").update({ visit_reason: visitReason }).eq("ehr_id", editingEHR.ehr_id)
      if (error) throw error
      toast({ title: "Success", description: "Visit reason updated successfully." })
      setEhr((prev) => (prev ? { ...prev, visit_reason: visitReason } : null))
      setEditingEHR(undefined)
    } catch (err: any) {
      toast({ title: "Update Failed", description: err.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddNewData = async (formData: any, dataType: string) => {
    if (!ehr || !doctorProfile || !ehr.healthcare_facilities) {
      toast({ title: "Error", description: "Critical data missing.", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    let tableName = ""
    switch (dataType) {
      case "Diagnosis":
        tableName = "diagnosis"
        break
      case "Prescription":
        tableName = "prescriptions"
        break
      case "Examination":
        tableName = "examinations"
        break
      case "Physical Examination":
        tableName = "physical_examinations"
        break
      case "Note":
        tableName = "doctor_notes"
        break
      case "Vaccination":
        tableName = "vaccinations"
        break
      default:
        toast({ title: "Submission Failed", description: `Invalid data type: ${dataType}`, variant: "destructive" })
        setIsSubmitting(false)
        return
    }
    
    const payload = {
      ...formData,
      ehr_id: ehr.ehr_id,
      doctor_id: doctorProfile.doctor_id,
      healthcare_facility_id: ehr.healthcare_facilities.healthcare_facility_id,
    }

    if (dataType === "Diagnosis" && ehr.patients) {
      payload.patient_id = ehr.patients.patient_id
    }

    try {
      const { data: newRecord, error } = await supabase
        .from(tableName)
        .insert(payload)
        .select("*, doctors(full_name)")
        .single()
      if (error) throw error
      setEhr((prev) => {
        if (!prev) return null
        type EhrArrayKey =
          | "diagnosis"
          | "prescriptions"
          | "examinations"
          | "physical_examinations"
          | "doctor_notes"
          | "vaccinations"
        const keyMap: { [key: string]: EhrArrayKey } = {
          Diagnosis: "diagnosis",
          Prescription: "prescriptions",
          Examination: "examinations",
          "Physical Examination": "physical_examinations",
          Note: "doctor_notes",
          Vaccination: "vaccinations",
        }
        const ehrKey = keyMap[dataType]
        const existingRecords = prev[ehrKey] || []
        return { ...prev, [ehrKey]: [...existingRecords, newRecord] }
      })
      toast({ title: "Success!", description: `${dataType} has been added successfully.` })
      setAddingDataType(null)
      setIsDiagnosisDialogOpen(false)
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: `Could not add ${dataType}: ${err.message}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDownload = () => {
    if (ehr && ehr.patients) {
      toast({ title: "Generating PDF...", description: "Your record is being prepared." })
      generateEHR_PDF(ehr.patients, ehr)
    }
    setShowDownloadDialog(false)
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-4 text-lg">Loading Medical Record...</p>
      </div>
    )
  }

  if (error || !ehr || !ehr.patients) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error Fetching Record</AlertTitle>
          <AlertDescription>{error || "The requested health record could not be found."}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const { patients: patient } = ehr
  const canEdit = ehr?.doctor_id === doctorProfile?.doctor_id

  return (
    <SidebarProvider>
      <DoctorSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="EHR Details" />
        <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Patient's EHR List
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{patient.full_name}</CardTitle>
              <CardDescription>Patient ID: {patient.patient_id}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Demographics</h4>
                  <div>
                    <p className="text-sm text-muted-foreground">Date of Birth</p>
                    <p className="font-medium">
                      {new Date(patient.date_of_birth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age</p>
                    <p className="font-medium">
                      {(() => {
                        const birthDate = new Date(patient.date_of_birth)
                        const today = new Date()
                        let age = today.getFullYear() - birthDate.getFullYear()
                        const m = today.getMonth() - birthDate.getMonth()
                        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                          age--
                        }
                        return age
                      })()} years old
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Gender</p>
                    <p className="font-medium">{patient.gender}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Contact</h4>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Address</p>
                    <p className="font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {patient.users?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {patient.phone_number || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 border-b pb-2">Known Allergies</h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.patient_allergies.length > 0 ? (
                      patient.patient_allergies.map((allergy, i) => (
                        <Badge key={i} variant="destructive">
                          {allergy.allergy_type.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No known allergies recorded.</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2">
                    Visit Details: {ehr.healthcare_facilities?.name || "N/A"}
                  </CardTitle>
                  <CardDescription>
                    Date: {new Date(ehr.created_at).toLocaleString()} | Attending: {ehr.doctors?.full_name || "N/A"}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingEHR(ehr)}
                  disabled={!canEdit}
                  title={!canEdit ? "You can only edit records you created" : "Edit Visit Reason"}
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Visit Reason
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                <strong className="font-medium">Reason for Visit:</strong> {ehr.visit_reason}
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="diagnosis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
              <TabsTrigger value="prescriptions">Medications</TabsTrigger>
              <TabsTrigger value="examinations">Lab Results</TabsTrigger>
              <TabsTrigger value="physical_examinations">Physical Exam</TabsTrigger>
              <TabsTrigger value="doctor_notes">Doctor's Notes</TabsTrigger>
              <TabsTrigger value="vaccinations">Vaccinations</TabsTrigger>
            </TabsList>

            <TabsContent value="diagnosis" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Diagnosis</CardTitle>
                  <Button size="sm" onClick={() => setIsDiagnosisDialogOpen(true)} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.diagnosis.length > 0 ? (
                    ehr.diagnosis.map((d: any) => (
                      <div key={d.diagnosis_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">{d.diagnosis_description}</h4>
                        <p className="text-sm mt-1 text-gray-700">{d.treatment_plan}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          By {d.doctors.full_name} on {new Date(d.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-8">
                      No diagnosis records for this visit.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="prescriptions" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Prescriptions</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Prescription")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.prescriptions.length > 0 ? (
                    ehr.prescriptions.map((p: any) => (
                      <div key={p.prescription_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">{p.medication_name}</h4>
                        <p className="text-sm text-gray-700">
                          {p.dosage} - {p.duration}
                        </p>
                        <p className="text-sm text-muted-foreground">{p.instruction}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-8">No prescriptions for this visit.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examinations" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Lab & Examinations</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Examination")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.examinations.length > 0 ? (
                    ehr.examinations.map((e: any) => (
                      <div key={e.examination_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">
                          {e.examination_name}{" "}
                          <span className="text-sm font-normal text-muted-foreground">({e.examination_type})</span>
                        </h4>
                        <p className="text-sm text-gray-700">{e.note}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-8">No examinations for this visit.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="physical_examinations" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Physical Examination</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Physical Examination")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  {ehr.physical_examinations.length > 0 ? (
                    ehr.physical_examinations.map((p: any) => (
                      <div key={p.physical_examination_id} className="space-y-4 text-sm">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <strong className="block">Heart Rate</strong>
                            {p.heart_rate} bpm
                          </div>
                          <div>
                            <strong className="block">Blood Pressure</strong>
                            {p.blood_pressure} mmHg
                          </div>
                          <div>
                            <strong className="block">Temperature</strong>
                            {p.temperature} °C
                          </div>
                          <div>
                            <strong className="block">Oxygen Sat.</strong>
                            {p.oxygen_saturation} %
                          </div>
                        </div>
                        <div className="pt-4 mt-4 border-t">
                          <strong className="block">Findings:</strong>
                          <p className="text-muted-foreground">{p.findings}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-8">
                      No physical exam recorded for this visit.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="doctor_notes" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Doctor's Notes</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Note")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.doctor_notes.length > 0 ? (
                    ehr.doctor_notes.map((n: any) => (
                      <p key={n.doctor_note_id} className="text-sm text-gray-700 border-l-4 pl-4">
                        {n.note}
                      </p>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-8">No notes for this visit.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vaccinations" className="pt-4">
              <Card>
                <CardHeader className="flex-row justify-between items-center">
                  <CardTitle>Vaccinations</CardTitle>
                  <Button size="sm" onClick={() => setAddingDataType("Vaccination")} disabled={!canEdit}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {ehr.vaccinations.length > 0 ? (
                    ehr.vaccinations.map((v: any) => (
                      <div key={v.vaccination_id} className="p-4 rounded-md border bg-slate-50">
                        <h4 className="font-semibold">
                          {v.vaccine_name}{" "}
                          <span className="text-sm font-normal text-muted-foreground">({v.vaccine_type})</span>
                        </h4>
                        <p className="text-sm text-muted-foreground">Dose: {v.dose_number}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-center text-muted-foreground py-8">
                      No vaccinations administered during this visit.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <Footer />
      </SidebarInset>

      <Dialog open={showDownloadDialog} onOpenChange={setShowDownloadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Download</DialogTitle>
            <DialogDescription>
              This will generate a PDF of the selected health record. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDownloadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmDownload}>Confirm & Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editingEHR !== undefined} onOpenChange={(isOpen) => !isOpen && setEditingEHR(undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Visit Reason</DialogTitle>
            <DialogDescription>Update the primary reason for this patient encounter.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateVisitReason} className="space-y-4 pt-4">
            <div>
              <Label htmlFor="visit_reason">Reason for Visit</Label>
              <Textarea
                id="visit_reason"
                name="visit_reason"
                defaultValue={editingEHR?.visit_reason ?? ""}
                required
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setEditingEHR(undefined)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AddDiagnosisDialog
        open={isDiagnosisDialogOpen}
        onOpenChange={setIsDiagnosisDialogOpen}
        onSubmit={handleAddNewData}
        isSubmitting={isSubmitting}
      />

      <AddEhrDataDialog
        dataType={addingDataType}
        open={addingDataType !== null}
        onOpenChange={(isOpen) => !isOpen && setAddingDataType(null)}
        onSubmit={handleAddNewData}
        isSubmitting={isSubmitting}
      />
    </SidebarProvider>
  )
}