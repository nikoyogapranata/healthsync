import { DashboardPatient } from "@/components/dashboard-patient"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f9fafb] pb-12">
      <div className="container mx-auto px-4 py-8">
        <DashboardPatient />
      </div>
    </main>
  )
}
