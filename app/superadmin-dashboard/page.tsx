import { SuperadminDashboard } from "@/components/superadmin-dashboard"
import { AuthGuard } from "@/components/auth-guard"

export default function SuperadminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["superadmin"]}>
      <main className="min-h-screen bg-[#f9fafb] pb-12">
        <div className="container mx-auto px-4 py-8">
          <SuperadminDashboard />
        </div>
      </main>
    </AuthGuard>
  )
}
