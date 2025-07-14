import { SuperadminDashboard } from "@/components/superadmin-dashboard"
import { AuthGuard } from "@/components/auth-guard"

export default function SuperadminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["superadmin"]}>
      <main className="min-h-screen w-full bg-[#f9fafb]">
        <div className="w-full h-full">
          <SuperadminDashboard />
        </div>
      </main>
    </AuthGuard>
  )
}
