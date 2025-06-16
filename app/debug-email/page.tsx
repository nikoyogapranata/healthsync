import { EmailTroubleshoot } from "@/components/email-troubleshoot"

export default function DebugEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Email Debug Center</h1>
        <EmailTroubleshoot />
      </div>
    </div>
  )
}
