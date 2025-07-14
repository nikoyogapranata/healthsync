import { RegionalAdminDashboard } from "@/components/regional-admin-dashboard"
import { AuthGuard } from "@/components/auth-guard"

export default function SuperadminDashboardPage() {
  return (
    <AuthGuard allowedRoles={["regional_admin"]}>
      <main className="min-h-screen w-full bg-[#f9fafb]">
        <div className="w-full h-full">
          <RegionalAdminDashboard/>
        </div>
      </main>
    </AuthGuard>
  )
}
