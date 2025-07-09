//components\superadmin-dashboard.tsx

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import {
  Users,
  UserPlus,
  Crown,
  Search,
  Edit,
  UserX,
  Shield,
  Eye,
  EyeOff,
  Building2,
  Activity,
  TrendingUp,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { createClient } from "@/utils/supabase/client";
import { createAdminUser, createDirectorUser } from "@/app/actions/admin-actions"
import { fetchUserStats, fetchAllUsers } from "@/app/actions/superadmin-actions"

interface User {
  user_id: string
  email: string
  role: string
  created_at: string
  full_name?: string
  active_status?: boolean
  healthcare_facility?: string
  email_confirmed_at?: string
}

interface HealthcareFacility {
  healthcare_facility_id: string
  name: string
  address?: string
  contact_number?: string
  total_users?: number
}

interface SystemStats {
  totalUsers: number
  totalPatients: number
  totalDoctors: number
  totalAdmins: number
  totalDirectors: number
  totalFacilities: number
  recentRegistrations: number
  unverifiedUsers: number
}

export function SuperadminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [showCreateDirector, setShowCreateDirector] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([])
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAdmins: 0,
    totalDirectors: 0,
    totalFacilities: 0,
    recentRegistrations: 0,
    unverifiedUsers: 0,
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showDirectorPassword, setShowDirectorPassword] = useState(false)

  // Form states
  const [adminForm, setAdminForm] = useState({
    fullName: "",
    email: "",
    password: "",
    facilityId: "",
  })

  const [directorForm, setDirectorForm] = useState({
    fullName: "",
    email: "",
    password: "",
    facilityId: "",
  })

  const supabase = createClient();

  // Fetch all data on component mount
  useEffect(() => {
    fetchFacilities()
    fetchUsers()
    fetchStatsData()
  }, [])

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
  }, [searchTerm, users])

  const fetchFacilities = async () => {
    try {
      const { data, error } = await supabase
        .from("healthcare_facilities")
        .select("healthcare_facility_id, name, address, contact_number")
        .order("name")

      if (error) throw error

      // Get user count for each facility
      const facilitiesWithStats = await Promise.all(
        (data || []).map(async (facility) => {
          // Count admins for this facility
          const { count: adminCount } = await supabase
            .from("admins")
            .select("*", { count: "exact", head: true })
            .eq("healthcare_facility_id", facility.healthcare_facility_id)

          // Count directors for this facility
          const { count: directorCount } = await supabase
            .from("directors")
            .select("*", { count: "exact", head: true })
            .eq("healthcare_facility_id", facility.healthcare_facility_id)

          return {
            ...facility,
            total_users: (adminCount || 0) + (directorCount || 0),
          }
        }),
      )

      setFacilities(facilitiesWithStats)
    } catch (error) {
      console.error("Error fetching facilities:", error)
      toast({
        title: "Error",
        description: "Failed to load healthcare facilities",
        variant: "destructive",
      })
    }
  }

  const fetchUsers = async () => {
  setLoading(true);
  try {
    const usersResult = await fetchAllUsers();

    if (!usersResult.success) {
      throw new Error(usersResult.error || "An unknown error occurred while fetching users.");
    }

    const usersData = usersResult.data;

    // Add this check to ensure usersData is not null/undefined
    if (!usersData) {
      setUsers([]);
      // You can optionally throw an error or just return
      console.log("No user data was returned.");
      return; 
    }

    const enrichedUsers = await Promise.all(
      usersData.map(async (user) => {
        let profileData: any = {};

        if (user.role === "patient") {
          const { data } = await supabase.from("patients").select("full_name").eq("user_id", user.user_id).single();
          profileData = data || {};
        } else if (user.role === "doctor") {
          const { data } = await supabase
            .from("doctors")
            .select("full_name, active_status")
            .eq("user_id", user.user_id)
            .single();
          profileData = data || {};
        } else if (user.role === "admin") {
          const { data } = await supabase
            .from("admins")
            .select(`full_name, healthcare_facilities(name)`)
            .eq("user_id", user.user_id)
            .single();
          profileData = {
            full_name: data?.full_name,
            healthcare_facility: (data?.healthcare_facilities as any)?.name,
          };
        } else if (user.role === "director") {
          const { data } = await supabase
            .from("directors")
            .select(`full_name, healthcare_facilities(name)`)
            .eq("user_id", user.user_id)
            .single();
          profileData = {
            full_name: data?.full_name,
            healthcare_facility: (data?.healthcare_facilities as any)?.name,
          };
        }

        return {
          ...user,
          ...profileData,
          active_status: profileData.active_status ?? true,
        };
      })
    );

    setUsers(enrichedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    toast({
      title: "Error",
      description: "Failed to load users",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};

  const fetchStatsData = async () => {
    try {
      const result = await fetchUserStats()

      if (result.success && result.data) {
        setStats(result.data)
      } else {
        console.error("Error fetching stats:", result.error)

        // Fallback: try to get counts directly with individual queries
        try {
          const { count: patientCount } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "patient")

          const { count: doctorCount } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "doctor")

          const { count: adminCount } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "admin")

          const { count: directorCount } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true })
            .eq("role", "director")

          const { count: totalCount } = await supabase.from("users").select("*", { count: "exact", head: true })

          setStats({
            totalUsers: totalCount || 0,
            totalPatients: patientCount || 0,
            totalDoctors: doctorCount || 0,
            totalAdmins: adminCount || 0,
            totalDirectors: directorCount || 0,
            totalFacilities: 0,
            recentRegistrations: 0,
            unverifiedUsers: 0,
          })
        } catch (fallbackError) {
          console.error("Fallback stats fetch also failed:", fallbackError)
        }
      }
    } catch (error) {
      console.error("Error in fetchStatsData:", error)
    }
  }

  const handleCreateAdmin = async () => {
    if (!adminForm.fullName || !adminForm.email || !adminForm.password || !adminForm.facilityId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await createAdminUser(adminForm)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        setAdminForm({ fullName: "", email: "", password: "", facilityId: "" })
        setShowCreateAdmin(false)
        fetchUsers()
        fetchStatsData()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating admin:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create admin",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDirector = async () => {
    if (!directorForm.fullName || !directorForm.email || !directorForm.password || !directorForm.facilityId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const result = await createDirectorUser(directorForm)

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        })

        setDirectorForm({ fullName: "", email: "", password: "", facilityId: "" })
        setShowCreateDirector(false)
        fetchUsers()
        fetchStatsData()
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error: any) {
      console.error("Error creating director:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create director",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const user = users.find((u) => u.user_id === userId)
      if (!user) return

      if (user.role === "doctor") {
        const { error } = await supabase.from("doctors").update({ active_status: !currentStatus }).eq("user_id", userId)
        if (error) throw error
      }

      toast({
        title: "Success",
        description: `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
      })

      fetchUsers()
    } catch (error: any) {
      console.error("Error updating user status:", error)
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "patient":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "doctor":
        return "bg-green-100 text-green-800 border-green-200"
      case "admin":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "director":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getVerificationStatus = (user: User) => {
    if (user.email_confirmed_at) {
      return (
        <Badge className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      )
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Comprehensive system management and oversight</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="facilities">Facilities</TabsTrigger>
          <TabsTrigger value="create">Create Accounts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-[#3FB6F6]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+{stats.recentRegistrations} from last week</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-[#34D399]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Healthcare Facilities</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFacilities}</div>
                <p className="text-xs text-muted-foreground">Active facilities</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Medical Staff</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDoctors + stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground">Doctors and admins</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.recentRegistrations}</div>
                <p className="text-xs text-muted-foreground">New registrations this week</p>
              </CardContent>
            </Card>
          </div>

          {/* Role Distribution */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Patients</span>
                  </div>
                  <span className="font-semibold">{stats.totalPatients}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Doctors</span>
                  </div>
                  <span className="font-semibold">{stats.totalDoctors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Admins</span>
                  </div>
                  <span className="font-semibold">{stats.totalAdmins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Directors</span>
                  </div>
                  <span className="font-semibold">{stats.totalDirectors}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => setShowCreateAdmin(true)} className="w-full justify-start" variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Admin Account
                </Button>
                <Button onClick={() => setShowCreateDirector(true)} className="w-full justify-start" variant="outline">
                  <Crown className="mr-2 h-4 w-4" />
                  Create Director Account
                </Button>
                <Button onClick={() => setActiveTab("users")} className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
                <Button onClick={() => setActiveTab("facilities")} className="w-full justify-start" variant="outline">
                  <Building2 className="mr-2 h-4 w-4" />
                  Manage Facilities
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">User Management</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-96">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Facility</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Verification</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          Loading users...
                        </TableCell>
                      </TableRow>
                    ) : filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          No users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.user_id}>
                          <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.healthcare_facility || "N/A"}</TableCell>
                          <TableCell>
                            <Switch
                              checked={user.active_status ?? true}
                              onCheckedChange={() => handleToggleUserStatus(user.user_id, user.active_status ?? true)}
                              disabled={user.role === "patient"}
                            />
                          </TableCell>
                          <TableCell>{getVerificationStatus(user)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <UserX className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Healthcare Facilities</h2>
            <Button>
              <Building2 className="mr-2 h-4 w-4" />
              Add Facility
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility) => (
              <Card
                key={facility.healthcare_facility_id}
                className="border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span className="text-gray-900">{facility.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {facility.address && (
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="mr-2 h-4 w-4 mt-0.5 text-[#3FB6F6]" />
                      <span>{facility.address}</span>
                    </div>
                  )}
                  {facility.contact_number && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="mr-2 h-4 w-4 text-[#34D399]" />
                      <span>{facility.contact_number}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2 h-4 w-4 text-[#3FB6F6]" />
                    <span>{facility.total_users} users</span>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#3FB6F6] text-[#3FB6F6] hover:bg-[#3FB6F6] hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#34D399] text-[#34D399] hover:bg-[#34D399] hover:text-white"
                    >
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <h2 className="text-2xl font-bold">Create New Accounts</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-[#3FB6F6]"
              onClick={() => setShowCreateAdmin(true)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#3FB6F6]" />
                  Create Admin Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create a new admin user for a healthcare facility. They will receive an email verification link.
                </p>
                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-[#3FB6F6] to-[#34D399]">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Admin
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-[#34D399]"
              onClick={() => setShowCreateDirector(true)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-[#34D399]" />
                  Create Director Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create a new director user for a healthcare facility. They will receive an email verification link.
                </p>
                <div className="mt-4">
                  <Button className="w-full bg-gradient-to-r from-[#34D399] to-[#3FB6F6]">
                    <Crown className="mr-2 h-4 w-4" />
                    Create Director
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Creation Process</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Fill Account Details</h4>
                    <p className="text-sm text-gray-600">
                      Enter the user's information and select their healthcare facility
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Account Created</h4>
                    <p className="text-sm text-gray-600">The account is created but requires email verification</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Email Verification</h4>
                    <p className="text-sm text-gray-600">User receives verification email and must click the link</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Account Active</h4>
                    <p className="text-sm text-gray-600">User can now sign in and access their dashboard</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">System Analytics</h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Registration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>This Week</span>
                    <span className="font-semibold">{stats.recentRegistrations} new users</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Active</span>
                    <span className="font-semibold">{stats.totalUsers} users</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Verification Rate</span>
                    <span className="font-semibold">
                      {stats.totalUsers > 0
                        ? Math.round(((stats.totalUsers - stats.unverifiedUsers) / stats.totalUsers) * 100)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Active Facilities</span>
                    <span className="font-semibold text-green-600">{stats.totalFacilities}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Medical Staff</span>
                    <span className="font-semibold text-blue-600">{stats.totalDoctors + stats.totalAdmins}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Admin Modal */}
      <Dialog open={showCreateAdmin} onOpenChange={setShowCreateAdmin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Create Admin Account
            </DialogTitle>
            <DialogDescription>
              Create a new admin user. They will receive an email verification link before they can sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminFullName">Full Name</Label>
              <Input
                id="adminFullName"
                placeholder="Enter full name"
                value={adminForm.fullName}
                onChange={(e) => setAdminForm({ ...adminForm, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Email</Label>
              <Input
                id="adminEmail"
                type="email"
                placeholder="Enter email address"
                value={adminForm.email}
                onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminPassword">Password</Label>
              <div className="relative">
                <Input
                  id="adminPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={adminForm.password}
                  onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminFacility">Healthcare Facility</Label>
              <Select
                value={adminForm.facilityId}
                onValueChange={(value) => setAdminForm({ ...adminForm, facilityId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select healthcare facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.healthcare_facility_id} value={facility.healthcare_facility_id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateAdmin(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateAdmin}
              disabled={loading}
              className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]"
            >
              {loading ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Director Modal */}
      <Dialog open={showCreateDirector} onOpenChange={setShowCreateDirector}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Create Director Account
            </DialogTitle>
            <DialogDescription>
              Create a new director user. They will receive an email verification link before they can sign in.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="directorFullName">Full Name</Label>
              <Input
                id="directorFullName"
                placeholder="Enter full name"
                value={directorForm.fullName}
                onChange={(e) => setDirectorForm({ ...directorForm, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="directorEmail">Email</Label>
              <Input
                id="directorEmail"
                type="email"
                placeholder="Enter email address"
                value={directorForm.email}
                onChange={(e) => setDirectorForm({ ...directorForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="directorPassword">Password</Label>
              <div className="relative">
                <Input
                  id="directorPassword"
                  type={showDirectorPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={directorForm.password}
                  onChange={(e) => setDirectorForm({ ...directorForm, password: e.target.value })}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowDirectorPassword(!showDirectorPassword)}
                >
                  {showDirectorPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="directorFacility">Healthcare Facility</Label>
              <Select
                value={directorForm.facilityId}
                onValueChange={(value) => setDirectorForm({ ...directorForm, facilityId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select healthcare facility" />
                </SelectTrigger>
                <SelectContent>
                  {facilities.map((facility) => (
                    <SelectItem key={facility.healthcare_facility_id} value={facility.healthcare_facility_id}>
                      {facility.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDirector(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateDirector}
              disabled={loading}
              className="bg-gradient-to-r from-[#3FB6F6] to-[#34D399]"
            >
              {loading ? "Creating..." : "Create Director"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
