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
    <div className="min-h-screen bg-gray-50">
    <UserProfile user={sampleUserData} />
    </div>
)
}
