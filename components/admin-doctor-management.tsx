"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sidebar, SidebarProvider, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from "@/components/ui/sidebar";
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
import { UserPlus, Edit, Trash2, Clock, BriefcaseMedical, LayoutDashboard, Shield } from "lucide-react";

// --- Data Types ---
interface Doctor {
  doctor_id: string;
  full_name: string;
  email: string;
  specialization: string;
  license_number: string;
  active_status: boolean;
}

// --- Mock Data ---
const initialDoctorData: Doctor[] = [
    { doctor_id: "d1", full_name: "Dr. Alan Smith", email: "alan.smith@clinic.com", specialization: "Cardiology", license_number: "LIC12345", active_status: true },
    { doctor_id: "d2", full_name: "Dr. Emily Jones", email: "emily.jones@clinic.com", specialization: "Pediatrics", license_number: "LIC67890", active_status: false },
];

// --- Doctor Management Component ---
export function AdminDoctorManagement() {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctorData);
  const [showCreateDoctorDialog, setShowCreateDoctorDialog] = useState(false);

  const handleCreateDoctor = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({ title: "Doctor Created", description: "New doctor has been successfully added." });
    setShowCreateDoctorDialog(false);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#3FB6F6] to-[#34D399]">
              <Shield className="size-5 text-white" />
            </div>
            <span className="font-semibold group-data-[collapsible=icon]:hidden">Admin Panel</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Dashboard">
                <Link href="/admin/dashboard">
                    <LayoutDashboard className="size-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Queue Management">
                <Link href="/admin/queue">
                    <Clock className="size-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Queue Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive tooltip="Doctor Management">
                <Link href="/admin/doctors">
                    <BriefcaseMedical className="size-4" />
                    <span className="group-data-[collapsible=icon]:hidden">Doctor Management</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="flex flex-col min-h-screen">
        <Header pageTitle="Doctor Management" />
        <main className="flex-1 p-4 md:p-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Doctor Accounts</CardTitle>
                  <CardDescription>Manage doctor profiles and their credentials.</CardDescription>
                </div>
                <Button onClick={() => setShowCreateDoctorDialog(true)}><UserPlus className="h-4 w-4 mr-2" />Create Doctor</Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>License Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doctor) => (
                    <TableRow key={doctor.doctor_id}>
                      <TableCell className="font-medium">{doctor.full_name}</TableCell>
                      <TableCell>{doctor.specialization}</TableCell>
                      <TableCell>{doctor.license_number}</TableCell>
                      <TableCell><Badge className={doctor.active_status ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>{doctor.active_status ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
        <Footer />

        <Dialog open={showCreateDoctorDialog} onOpenChange={setShowCreateDoctorDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Doctor Account</DialogTitle>
              <DialogDescription>Fill in the details below. An email verification will be sent.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDoctor}>
              <div className="space-y-4 py-4">
                <div className="space-y-2"><Label htmlFor="fullName">Full Name</Label><Input id="fullName" placeholder="e.g., Dr. John Smith" required /></div>
                <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="e.g., doctor@clinic.com" required /></div>
                <div className="space-y-2"><Label htmlFor="password">Temporary Password</Label><Input id="password" type="password" required /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label htmlFor="specialization">Specialization</Label><Input id="specialization" placeholder="e.g., Cardiology" required /></div>
                  <div className="space-y-2"><Label htmlFor="licenseNumber">License Number</Label><Input id="licenseNumber" placeholder="e.g., LIC123456" required /></div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDoctorDialog(false)}>Cancel</Button>
                <Button type="submit">Create Doctor</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
}
