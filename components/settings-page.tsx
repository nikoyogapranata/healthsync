import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Settings, Bell, Shield, User, Mail, Phone, Lock, Eye, Download, Trash2, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
return (
    <div className="min-h-screen bg-gray-50">
    {/* Header */}
    <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Button>
            </Link>
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
            </div>
        </div>
        </div>
    </div>

    <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Account Settings */}
        <Card className="border-l-4 border-l-[#3FB6F6]">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
            <User className="w-5 h-5 text-[#3FB6F6]" />
            Account Settings
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue="John Smith" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.smith@email.com" />
            </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" defaultValue="+62 812 3456 7890" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="nik">National ID (NIK)</Label>
                <Input id="nik" defaultValue="1234567890123456" disabled />
            </div>
            </div>
            <Button className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399] hover:from-[#34D399] hover:to-[#3FB6F6] text-white gap-2">
            <Save className="w-4 h-4" />
            Save Changes
            </Button>
        </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="border-l-4 border-l-[#34D399]">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
            <Shield className="w-5 h-5 text-[#34D399]" />
            Security & Privacy
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Change Password</h4>
                <p className="text-sm text-gray-500">Update your account password</p>
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                <Lock className="w-4 h-4" />
                Change Password
                </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Not Enabled
                </Badge>
                <Button variant="outline" size="sm">
                    Enable
                </Button>
                </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Login Activity</h4>
                <p className="text-sm text-gray-500">View recent login attempts</p>
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                <Eye className="w-4 h-4" />
                View Activity
                </Button>
            </div>
            </div>
        </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
            <Bell className="w-5 h-5 text-[#3FB6F6]" />
            Notification Preferences
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Email Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-gray-500">Receive updates via SMS</p>
                </div>
                <Switch />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Appointment Reminders</h4>
                <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
                </div>
                <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Health Tips</h4>
                <p className="text-sm text-gray-500">Receive personalized health tips</p>
                </div>
                <Switch defaultChecked />
            </div>
            </div>
        </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
            <Download className="w-5 h-5 text-[#34D399]" />
            Data & Privacy
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Download Your Data</h4>
                <p className="text-sm text-gray-500">Export all your medical records and data</p>
                </div>
                <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                Download
                </Button>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium">Data Sharing</h4>
                <p className="text-sm text-gray-500">Control how your data is shared</p>
                </div>
                <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                <h4 className="font-medium text-red-600">Delete Account</h4>
                <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Account
                </Button>
            </div>
            </div>
        </CardContent>
        </Card>

        {/* Support */}
        <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
            <Settings className="w-5 h-5 text-gray-600" />
            Support & Help
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Mail className="w-6 h-6 text-[#3FB6F6]" />
                <span className="font-medium">Contact Support</span>
                <span className="text-xs text-gray-500">Get help from our team</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Phone className="w-6 h-6 text-[#34D399]" />
                <span className="font-medium">Call Support</span>
                <span className="text-xs text-gray-500">+62 21 1234 5678</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 bg-transparent">
                <Settings className="w-6 h-6 text-gray-600" />
                <span className="font-medium">Help Center</span>
                <span className="text-xs text-gray-500">Browse FAQ & guides</span>
            </Button>
            </div>
        </CardContent>
        </Card>
    </div>
    </div>
)
}
