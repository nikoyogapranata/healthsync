"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Users, UserPlus, Crown, BarChart3, Search, Edit, UserX, Shield, Eye, EyeOff } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface User {
  user_id: string
  email: string
  role: string
  created_at: string
  full_name?: string
  active_status?: boolean
  healthcare_facility?: string
}

interface HealthcareFacility {
  healthcare_facility_id: string
  facility_name: string
}

export function SuperadminDashboard() {
  const [showCreateAdmin, setShowCreateAdmin] = useState(false)
  const [showCreateDirector, setShowCreateDirector] = useState(false)
  const [showUsersTable, setShowUsersTable] = useState(false)
  const [showSystemOverview, setShowSystemOverview] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([])
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

  const supabase = createClientComponentClient()

  // Fetch healthcare facilities
  useEffect(() => {
    fetchFacilities()
  }, [])

  // Fetch users when users table is opened
  useEffect(() => {
    if (showUsersTable) {
      fetchUsers()
    }
  }, [showUsersTable])

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
        .select("healthcare_facility_id, facility_name")
        .order("facility_name")

      if (error) throw error
      setFacilities(data || [])
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
    setLoading(true)
    try {
      // Fetch users with their profile data
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select(`
          user_id,
          email,
          role,
          created_at
        `)
        .order("created_at", { ascending: false })

      if (usersError) throw usersError

      // Fetch additional profile data for each user
      const enrichedUsers = await Promise.all(
        (usersData || []).map(async (user) => {
          let profileData = {}

          if (user.role === "patient") {
            const { data } = await supabase.from("patients").select("full_name").eq("user_id", user.user_id).single()
            profileData = data || {}
          } else if (user.role === "doctor") {
            const { data } = await supabase
              .from("doctors")
              .select("full_name, active_status")
              .eq("user_id", user.user_id)
              .single()
            profileData = data || {}
          } else if (user.role === "admin") {
            const { data } = await supabase
              .from("admins")
              .select(`
                full_name,
                healthcare_facilities(facility_name)
              `)
              .eq("user_id", user.user_id)
              .single()
            profileData = {
              full_name: data?.full_name,
              healthcare_facility: data?.healthcare_facilities?.facility_name,
            }
          } else if (user.role === "director") {
            const { data } = await supabase
              .from("directors")
              .select(`
                full_name,
                healthcare_facilities(facility_name)
              `)
              .eq("user_id", user.user_id)
              .single()
            profileData = {
              full_name: data?.full_name,
              healthcare_facility: data?.healthcare_facilities?.facility_name,
            }
          }

          return {
            ...user,
            ...profileData,
            active_status: profileData.active_status ?? true,
          }
        }),
      )

      setUsers(enrichedUsers)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
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
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminForm.email,
        password: adminForm.password,
        options: {
          data: {
            full_name: adminForm.fullName,
            role: "admin",
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user record
        const { error: userError } = await supabase.from("users").insert({
          user_id: authData.user.id,
          email: adminForm.email,
          role: "admin",
          password: "managed_by_supabase_auth",
        })

        if (userError) throw userError

        // Create admin record
        const { error: adminError } = await supabase.from("admins").insert({
          admin_id: crypto.randomUUID(),
          user_id: authData.user.id,
          healthcare_facility_id: adminForm.facilityId,
          full_name: adminForm.fullName,
          employee_id: `ADM-${Date.now()}`,
        })

        if (adminError) throw adminError

        toast({
          title: "Success",
          description: "Admin created successfully",
        })

        setAdminForm({ fullName: "", email: "", password: "", facilityId: "" })
        setShowCreateAdmin(false)
        if (showUsersTable) fetchUsers()
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
      // Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: directorForm.email,
        password: directorForm.password,
        options: {
          data: {
            full_name: directorForm.fullName,
            role: "director",
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user record
        const { error: userError } = await supabase.from("users").insert({
          user_id: authData.user.id,
          email: directorForm.email,
          role: "director",
          password: "managed_by_supabase_auth",
        })

        if (userError) throw userError

        // Create director record
        const { error: directorError } = await supabase.from("directors").insert({
          director_id: crypto.randomUUID(),
          user_id: authData.user.id,
          healthcare_facility_id: directorForm.facilityId,
          full_name: directorForm.fullName,
        })

        if (directorError) throw directorError

        toast({
          title: "Success",
          description: "Director created successfully",
        })

        setDirectorForm({ fullName: "", email: "", password: "", facilityId: "" })
        setShowCreateDirector(false)
        if (showUsersTable) fetchUsers()
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
      // Update in the appropriate profile table
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage users, admins, directors, and system overview</p>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-[#3FB6F6]"
          onClick={() => setShowCreateAdmin(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#3FB6F6]/10 rounded-full">
                <UserPlus className="h-6 w-6 text-[#3FB6F6]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Create Admin</h3>
                <p className="text-sm text-gray-600">Add new admin users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-[#34D399]"
          onClick={() => setShowCreateDirector(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#34D399]/10 rounded-full">
                <Crown className="h-6 w-6 text-[#34D399]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Create Director</h3>
                <p className="text-sm text-gray-600">Add new director users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-[#F59E0B]"
          onClick={() => setShowUsersTable(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#F59E0B]/10 rounded-full">
                <Users className="h-6 w-6 text-[#F59E0B]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Manage Users</h3>
                <p className="text-sm text-gray-600">View and manage all users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-[#8B5CF6]"
          onClick={() => setShowSystemOverview(true)}
        >
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-[#8B5CF6]/10 rounded-full">
                <BarChart3 className="h-6 w-6 text-[#8B5CF6]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">System Overview</h3>
                <p className="text-sm text-gray-600">View system statistics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Admin Modal */}
      <Dialog open={showCreateAdmin} onOpenChange={setShowCreateAdmin}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Create Admin
            </DialogTitle>
            <DialogDescription>Create a new admin user for a healthcare facility</DialogDescription>
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
                      {facility.facility_name}
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
              Create Director
            </DialogTitle>
            <DialogDescription>Create a new director user for a healthcare facility</DialogDescription>
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
                      {facility.facility_name}
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

      {/* Users Table Modal */}
      <Dialog open={showUsersTable} onOpenChange={setShowUsersTable}>
        <DialogContent className="max-w-6xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Users
            </DialogTitle>
            <DialogDescription>View and manage all system users</DialogDescription>
          </DialogHeader>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search users by name, email, or role..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Users Table */}
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Facility</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading users...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
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
        </DialogContent>
      </Dialog>

      {/* System Overview Modal */}
      <Dialog open={showSystemOverview} onOpenChange={setShowSystemOverview}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              System Overview
            </DialogTitle>
            <DialogDescription>System statistics and overview</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Total Patients</h3>
                  <p className="text-2xl font-bold text-blue-600">{users.filter((u) => u.role === "patient").length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Total Doctors</h3>
                  <p className="text-2xl font-bold text-green-600">{users.filter((u) => u.role === "doctor").length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Total Admins</h3>
                  <p className="text-2xl font-bold text-purple-600">{users.filter((u) => u.role === "admin").length}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Total Directors</h3>
                  <p className="text-2xl font-bold text-orange-600">
                    {users.filter((u) => u.role === "director").length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
