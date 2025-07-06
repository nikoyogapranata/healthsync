import UserProfile, { type UserProfile as UserProfileType } from "@/components/user-profile"

// Sample data berdasarkan form pendaftaran
const sampleUserData: UserProfileType = {
fullName: "John Doe",
nationalId: "1234567890123456",
email: "john.doe@example.com",
phoneNumber: "+62 812 3456 7890",
dateOfBirth: "1990-05-15",
gender: "Male",
bloodType: "A+",
address: "Jl. Kesehatan No. 123, Jakarta Selatan, DKI Jakarta 12345, Indonesia",
}

export default function ProfilePage() {
return (
    <div className="min-h-screen bg-gray-50 py-8">
    <div className="container mx-auto">
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profile</h1>
        <p className="text-gray-600">Complete healthcare profile information</p>
        </div>

        <UserProfile user={sampleUserData} />
    </div>
    </div>
)
}
