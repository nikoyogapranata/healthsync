// app/actions/admin-actions.ts

"use server"

import { createClient } from "@/utils/supabase/server";

export async function createAdminUser(formData: {
  fullName: string
  email: string
  password: string
  facilityId: string
}) {
  const supabase = createClient();

  // Step 1: Create the user in Supabase's authentication system.
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        role: "admin", // Metadata for the auth user
      },
    },
  });

  if (signUpError) {
    console.error("Error signing up admin:", signUpError.message);
    return { success: false, message: signUpError.message };
  }

  if (user) {
    // Step 2: Create a corresponding record in your public 'users' table to satisfy the foreign key.
    const { error: publicUserError } = await supabase.from("users").insert({
        user_id: user.id,
        email: user.email,
        role: "admin",
    });

    if (publicUserError) {
        console.error("Error creating public user record:", publicUserError.message);
        // Clean up the auth user if this step fails
        await supabase.auth.admin.deleteUser(user.id);
        return { success: false, message: "Failed to create user record." };
    }

    // Step 3: Now that the public user exists, create the admin profile.
    const { error: adminError } = await supabase.from("admins").insert({
      admin_id: crypto.randomUUID(),
      user_id: user.id,
      healthcare_facility_id: formData.facilityId,
      full_name: formData.fullName,
    });

    if (adminError) {
      console.error("Error creating admin profile:", adminError.message);
      // Clean up both the auth user and the public user record
      await supabase.auth.admin.deleteUser(user.id);
      return { success: false, message: "Failed to create admin profile." };
    }

    return {
      success: true,
      message: `Admin account for ${formData.email} created. A verification email has been sent.`,
    };
  }

  return { success: false, message: "An unknown error occurred." };
}

export async function createDirectorUser(formData: {
  fullName:string
  email: string
  password: string
  facilityId: string
}) {
  const supabase = createClient();

  // Step 1: Create the user in Supabase's authentication system.
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        role: "director",
      },
    },
  });

  if (signUpError) {
    console.error("Error signing up director:", signUpError.message);
    return { success: false, message: signUpError.message };
  }

  if (user) {
    // Step 2: Create a corresponding record in your public 'users' table.
    const { error: publicUserError } = await supabase.from("users").insert({
        user_id: user.id,
        email: user.email,
        role: "director",
    });

    if (publicUserError) {
        console.error("Error creating public user record:", publicUserError.message);
        await supabase.auth.admin.deleteUser(user.id);
        return { success: false, message: "Failed to create user record." };
    }

    // Step 3: Now that the public user exists, create the director profile.
    const { error: directorError } = await supabase.from("directors").insert({
      director_id: crypto.randomUUID(),
      user_id: user.id,
      healthcare_facility_id: formData.facilityId,
      full_name: formData.fullName,
    });

    if (directorError) {
      console.error("Error creating director profile:", directorError.message);
      await supabase.auth.admin.deleteUser(user.id);
      return { success: false, message: "Failed to create director profile." };
    }

    return {
      success: true,
      message: `Director account for ${formData.email} created. A verification email has been sent.`,
    };
  }

  return { success: false, message: "An unknown error occurred." };
}