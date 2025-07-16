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

  /*
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
  */


      if (dataType === "Diagnosis" && ehr.patients) {
      payload.patient_id = ehr.patients.patient_id;
    }