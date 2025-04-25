import { DashboardPasien } from "@/components/dashboard-pasien"

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        <DashboardPasien />
      </div>
    </main>
  )
}
