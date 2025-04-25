import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface DashboardPlaceholderProps {
  title: string
}

export function DashboardPlaceholder({ title }: DashboardPlaceholderProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">Halaman ini sedang dalam pengembangan</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi</CardTitle>
          <CardDescription>Halaman ini masih dalam tahap pengembangan dan akan segera tersedia.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="rounded-full bg-gradient-to-r from-[#3FB6F6]/20 to-[#34D399]/20 p-6 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3FB6F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 20h9"></path>
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
            </svg>
          </div>
          <p className="text-center mb-6">
            Tim pengembang kami sedang bekerja keras untuk menyelesaikan halaman ini. Silakan kembali lagi nanti.
          </p>
          <Link href="/" passHref>
            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#3FB6F6] hover:to-[#2ebb85]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Halaman Utama
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
