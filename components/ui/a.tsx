"use client";

import { useEffect, useState, useCallback } from "react"; // Import useCallback
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sidebar, SidebarProvider, SidebarContent, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarRail
} from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { UserPlus, Edit, Trash2, Clock, BriefcaseMedical, LayoutDashboard, UserCircle, Stethoscope, Phone, Home as HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Assuming you have a Select component

// --- Data Types ---
interface Doctor {
  doctor_id: string;
  user_id: string;
  full_name: string;
  license_number: string;
  specialization: string;
  phone_number: string | null;
  gender: 'Male' | 'Female' | 'Other' | null; // Use a specific set of values for gender
  address: string | null;
  active_status: boolean;
  employee_id: string | null;
  users: { email: string } | null; // For fetching email from the related users table
}

const navigationItems = [
  { title: "Dashboard", url: "/admin-dashboard", icon: LayoutDashboard },
  { title: "Queue Management", url: "/admin-queue", icon: Clock },
  { title: "Doctor Management", url: "/admin-doctor-management", icon: BriefcaseMedical },
];

export function AdminDoctorManagement() {
  const pathname = usePathname();
  const supabase = createClient();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateDoctorDialog, setShowCreateDoctorDialog] = useState(false);
  const [showEditDoctorDialog, setShowEditDoctorDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Doctor>>({});

  // --- REFACTORED DATA FETCHING ---
  const fetchInitialData = useCallback(async () => {
    // No need to set loading to true here for refreshes, only for initial load.
    // This provides a smoother UX.
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        users ( email )
      `);
    
    if (error) {
      toast({ title: "Error", description: "Could not fetch doctor data.", variant: "destructive" });
    } else {
      setDoctors(data as Doctor[]);
    }
    setLoading(false); // Ensure loading is false after fetch completes
  }, [supabase]);


  // --- Data Fetching and Realtime Subscription ---
  useEffect(() => {
    // Set loading to true only on the initial mount
    setLoading(true);
    fetchInitialData();

    const channel = supabase
      .channel('doctors-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'doctors' },
        (payload) => {
          console.log('Change received!', payload);
          // Re-fetch data on any change
          fetchInitialData();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchInitialData]); // Add fetchInitialData to dependency array

  // --- CRUD Handlers ---
  const handleCreateDoctor = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newDoctorData = {
      fullName: formData.get('fullName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      specialization: formData.get('specialization') as string,
      licenseNumber: formData.get('licenseNumber') as string,
    };
    
    // NOTE: This is a placeholder. You should replace this with your actual
    // server-side logic to create a user and a doctor profile.
    // The realtime listener will automatically refresh the list upon success.
    console.log("Creating doctor:", newDoctorData);
    toast({ title: "Doctor Created", description: "New doctor has been successfully added." });
    setShowCreateDoctorDialog(false);
  };

  const handleUpdateDoctor = async () => {
    if (!selectedDoctor) return;

    // Destructure to remove the nested 'users' object before updating
    const { users, ...updateData } = editFormData;

    const { error } = await supabase
      .from('doctors')
      .update(updateData) // Use the cleaned data object
      .eq('doctor_id', selectedDoctor.doctor_id);

    if (error) {
      toast({ title: "Error", description: `Failed to update doctor: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Doctor information has been updated." });
      setShowEditDoctorDialog(false);
      // No need to manually refetch, the realtime listener will handle it.
    }
  };

  // Dummy delete handler to demonstrate refresh
  const handleDeleteDoctor = async () => {
      if (!selectedDoctor) return;
      
      const { error } = await supabase
          .from('doctors')
          .delete()
          .eq('doctor_id', selectedDoctor.doctor_id);

      if (error) {
          toast({ title: "Error", description: `Failed to delete doctor: ${error.message}`, variant: "destructive" });
      } else {
          toast({ title: "Success", description: "Doctor has been deleted." });
          setShowEditDoctorDialog(false);
      }
  };

  const openEditModal = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setEditFormData(doctor);
    setShowEditDoctorDialog(true);
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r-0">
        <SidebarHeader className="border-b border-border/40 pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="hover:bg-transparent">
                <Link href="/admin/dashboard" className="flex items-center gap-3 px-2 group-data-[collapsible=icon]:justify-center">
                  <div className="flex aspect-square size-10 items-center justify-center rounded-xl pl-2 pt-2">
                    <Image src="/illustrations/logo.png" alt="HealthSync Logo" width={28} height={28} onError={(e) => { e.currentTarget.src = 'https://placehold.co/28x28/34D399/FFFFFF?text=HS'; }} />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                    <span className="font-bold text-lg text-foreground">HealthSync</span>
                    <span className="text-xs text-muted-foreground font-medium">Admin Panel</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider mb-2 px-2">Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}
                      className={cn("h-11 px-3 rounded-lg font-medium transition-all duration-200", "hover:bg-accent/50 hover:text-accent-foreground", "data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#3FB6F6]/10 data-[active=true]:to-[#34D399]/10", "data-[active=true]:border data-[active=true]:border-[#3FB6F6]/20", "data-[active=true]:text-[#3FB6F6] data-[active=true]:font-semibold", "data-[active=true]:shadow-sm")}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="size-5" />
                        <span className="text-sm group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="Doctor Management" />
        <main className="flex-1 p-4 md:p-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Doctor Accounts</CardTitle>
                  <CardDescription>Manage doctor profiles. The list will auto-refresh on changes.</CardDescription>
                </div>
                <Button onClick={() => setShowCreateDoctorDialog(true)}><UserPlus className="h-4 w-4 mr-2" />Create Doctor</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="text-center">Loading doctors...</TableCell></TableRow>
                  ) : doctors.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center">No doctors found.</TableCell></TableRow>
                  ) : (
                    doctors.map((doctor) => (
                      <TableRow key={doctor.doctor_id} onClick={() => openEditModal(doctor)} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-medium">{doctor.full_name}</TableCell>
                        <TableCell>{doctor.users?.email ?? 'N/A'}</TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>
                          <Badge variant={doctor.active_status ? "default" : "destructive"}>
                            {doctor.active_status ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </SidebarInset>

      {/* Create Doctor Dialog remains the same */}
      <Dialog open={showCreateDoctorDialog} onOpenChange={setShowCreateDoctorDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Doctor Account</DialogTitle>
            <DialogDescription>Fill in the details below. An email verification will be sent.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateDoctor}>
            <div className="space-y-4 py-4">
              <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input name="fullName" required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input name="email" type="email" required /></div>
              <div className="space-y-2"><Label htmlFor="password">Temporary Password</Label><Input name="password" type="password" required /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="specialization">Specialization</Label><Input name="specialization" required /></div>
                <div className="space-y-2"><Label htmlFor="licenseNumber">License Number</Label><Input name="licenseNumber" required /></div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowCreateDoctorDialog(false)}>Cancel</Button>
              <Button type="submit">Create Doctor</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* --- UPDATED EDIT DOCTOR DIALOG --- */}
      <Dialog open={showEditDoctorDialog} onOpenChange={setShowEditDoctorDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Doctor Information</DialogTitle>
            <DialogDescription>Update the details for {selectedDoctor?.full_name}.</DialogDescription>
          </DialogHeader>
          {selectedDoctor && (
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_full_name">Full Name</Label>
                  <Input id="edit_full_name" value={editFormData.full_name ?? ''} onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_specialization">Specialization</Label>
                  <Input id="edit_specialization" value={editFormData.specialization ?? ''} onChange={(e) => setEditFormData({...editFormData, specialization: e.target.value})} />
                </div>
              </div>
               <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_license_number">License Number</Label>
                  <Input id="edit_license_number" value={editFormData.license_number ?? ''} onChange={(e) => setEditFormData({...editFormData, license_number: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_phone_number">Phone Number</Label>
                  <Input id="edit_phone_number" value={editFormData.phone_number ?? ''} onChange={(e) => setEditFormData({...editFormData, phone_number: e.target.value})} />
                </div>
              </div>
              
              {/* --- NEW GENDER AND EMPLOYEE ID INPUTS --- */}
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="edit_gender">Gender</Label>
                      <Select
                          value={editFormData.gender ?? undefined}
                          onValueChange={(value) => setEditFormData({ ...editFormData, gender: value as Doctor['gender'] })}
                      >
                          <SelectTrigger id="edit_gender">
                              <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                   <div className="space-y-2">
                      <Label htmlFor="edit_employee_id">Employee ID</Label>
                      <Input id="edit_employee_id" value={editFormData.employee_id ?? ''} onChange={(e) => setEditFormData({...editFormData, employee_id: e.target.value})} />
                  </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit_address">Address</Label>
                <Input id="edit_address" value={editFormData.address ?? ''} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="edit_active_status" checked={editFormData.active_status} onCheckedChange={(checked) => setEditFormData({...editFormData, active_status: checked})} />
                <Label htmlFor="edit_active_status">Active Status</Label>
              </div>
            </div>
          )}
          <DialogFooter className="justify-between">
              <div>
                  <Button type="button" variant="destructive" onClick={handleDeleteDoctor}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Doctor
                  </Button>
              </div>
              <div className="flex gap-2">
                 <Button type="button" variant="outline" onClick={() => setShowEditDoctorDialog(false)}>Cancel</Button>
                 <Button onClick={handleUpdateDoctor}>Save Changes</Button>
              </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}