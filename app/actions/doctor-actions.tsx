// app/actions/doctor-actions.ts

"use server"

// Keep the user-level client for auth actions
import { createClient as createServerClient } from "@/utils/supabase/server"; 
// Import the base client to create a service role client
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

export async function createDoctorUser(formData: {
  email: string
  password: string
  full_name: string
  specialization: string
  license_number: string
  phone_number: string | null
  gender: 'Male' | 'Female' | 'Other' | null
  employee_id: string | null
  address: string | null
  facilityId: string
}) {
  // This client acts AS THE LOGGED-IN USER
  const supabase = createServerClient();

  // This client acts AS THE SYSTEM ADMIN (bypasses RLS)
  // Ensure your environment variables are set up correctly
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Step 1: Create the user in Supabase Auth
  const { data: { user }, error: authError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.full_name,
        role: "doctor",
      },
    },
  });

  if (authError) {
    console.error("Error creating doctor auth user:", authError.message);
    return { success: false, message: authError.message };
  }
  if (!user) {
    return { success: false, message: "User not created in auth." };
  }

  // --- Use the supabaseAdmin client for all database writes ---
  
  const newDoctorId = randomUUID();

  // Use the admin client to write to the 'users' table
  const { error: publicUserError } = await supabaseAdmin.from("users").insert({
    user_id: user.id,
    email: user.email,
    role: "doctor",
  });

  if (publicUserError) {
    console.error("Error creating public user record for doctor:", publicUserError.message);
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return { success: false, message: "Failed to create user record." };
  }
  
  // Use the admin client to write to the 'doctors' table
  const { error: doctorProfileError } = await supabaseAdmin.from("doctors").insert({
    doctor_id: newDoctorId,
    user_id: user.id,
    full_name: formData.full_name,
    specialization: formData.specialization,
    license_number: formData.license_number,
    phone_number: formData.phone_number,
    gender: formData.gender,
    employee_id: formData.employee_id,
    address: formData.address,
    active_status: true,
  });

  if (doctorProfileError) {
    console.error("Error creating doctor profile:", doctorProfileError.message);
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return { success: false, message: `Failed to create doctor profile: ${doctorProfileError.message}` };
  }
  
  // Use the admin client to write to the junction table
  const { error: facilityLinkError } = await supabaseAdmin.from("doctor_healthcare_facility").insert({
      doctor_healthcare_facility_id: randomUUID(),
      doctor_id: newDoctorId,
      healthcare_facility_id: formData.facilityId,
  });

  if (facilityLinkError) {
      console.error("Error linking doctor to facility:", facilityLinkError.message);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { success: false, message: "Failed to link doctor to facility." };
  }

  return {
    success: true,
    message: `Doctor account for ${formData.email} created successfully. A verification email has been sent.`,
  };
}