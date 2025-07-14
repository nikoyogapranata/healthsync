"use server";

// Import the base creator for the admin client
import { createClient as createAdminClient } from '@supabase/supabase-js';
// This is your standard server client that acts on behalf of the user
import { createClient } from "@/utils/supabase/server";

/**
 * Creates a special Supabase client with admin privileges using the service_role key.
 * This is necessary for performing actions like creating or deleting users.
 */
function getAdminClient() {
  // Ensure the required environment variables are set.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing Supabase URL or Service Role Key for admin client.");
  }
  
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function createAdminUser(formData: {
  fullName: string;
  email: string;
  password: string;
  facilityId: string;
}) {
  const supabase = createClient();
  const supabaseAdmin = getAdminClient(); // Use the privileged client for auth actions

  // Step 1: Create the user with the admin client
  const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    user_metadata: {
      full_name: formData.fullName,
      role: "admin",
    },
    email_confirm: false,
  });

  if (authError) {
    console.error("Error creating admin auth user:", authError.message);
    return { success: false, message: authError.message };
  }

  if (user) {
    // Step 2: Create a corresponding record in your public 'users' table.
    const { error: publicUserError } = await supabase.from("users").insert({
      user_id: user.id,
      email: user.email,
      role: "admin",
    });

    if (publicUserError) {
      console.error("Error creating public user record for admin:", publicUserError.message);
      await supabaseAdmin.auth.admin.deleteUser(user.id); // Cleanup with admin client
      return { success: false, message: "Failed to create user record." };
    }

    // Step 3: Create the admin profile.
    const { error: adminError } = await supabase.from("admins").insert({
      user_id: user.id,
      healthcare_facility_id: formData.facilityId,
      full_name: formData.fullName,
    });

    if (adminError) {
      console.error("Error creating admin profile:", adminError.message);
      await supabaseAdmin.auth.admin.deleteUser(user.id); // Cleanup with admin client
      return { success: false, message: "Failed to create admin profile." };
    }

    return {
      success: true,
      message: `Admin account for ${formData.email} created successfully.`,
    };
  }

  return { success: false, message: "An unknown error occurred." };
}

export async function createDirectorUser(formData: {
  fullName: string;
  email: string;
  password: string;
  facilityId: string;
}) {
  const supabase = createClient();
  const supabaseAdmin = getAdminClient(); // Use the privileged client for auth actions

  const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    user_metadata: {
      full_name: formData.fullName,
      role: "director",
    },
    email_confirm: false,
  });

  if (authError) {
    console.error("Error creating director auth user:", authError.message);
    return { success: false, message: authError.message };
  }

  if (user) {
    const { error: publicUserError } = await supabase.from("users").insert({
      user_id: user.id,
      email: user.email,
      role: "director",
    });

    if (publicUserError) {
      console.error("Error creating public user record for director:", publicUserError.message);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { success: false, message: "Failed to create user record." };
    }

    const { error: directorError } = await supabase.from("directors").insert({
      user_id: user.id,
      healthcare_facility_id: formData.facilityId,
      full_name: formData.fullName,
    });

    if (directorError) {
      console.error("Error creating director profile:", directorError.message);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { success: false, message: "Failed to create director profile." };
    }

    return {
      success: true,
      message: `Director account for ${formData.email} created successfully.`,
    };
  }

  return { success: false, message: "An unknown error occurred." };
}

export async function createRegionalAdminUser(formData: {
  fullName: string;
  email: string;
  password: string;
  nationalId: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  phoneNumber: string;
  provinceId: string;
  regencyId: string;
  districtId: string;
  streetAddress?: string; // Can be optional
}) {
  const supabase = createClient();
  const supabaseAdmin = getAdminClient(); // Use the privileged client for auth actions

  const { data: { user }, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: formData.email,
    password: formData.password,
    user_metadata: {
      full_name: formData.fullName,
      role: "regional_admin",
    },
    email_confirm: false,
  });

  if (authError) {
    console.error("Error creating regional admin auth user:", authError.message);
    return { success: false, message: authError.message };
  }

  if (user) {
    const { error: publicUserError } = await supabase.from("users").insert({
      user_id: user.id,
      email: user.email,
      role: "regional_admin",
    });

    if (publicUserError) {
      console.error("Error creating public user record for regional admin:", publicUserError.message);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { success: false, message: "Failed to create user record." };
    }

    const { error: profileError } = await supabase.from("regional_admins").insert({
      user_id: user.id,
      full_name: formData.fullName,
      national_id: formData.nationalId,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      blood_type: formData.bloodType,
      phone_number: formData.phoneNumber,
      province_id: parseInt(formData.provinceId, 10),
      regency_id: parseInt(formData.regencyId, 10),
      district_id: parseInt(formData.districtId, 10),
      street_address: formData.streetAddress,
    });

    if (profileError) {
      console.error("Error creating regional admin profile:", profileError.message);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { success: false, message: "Failed to create regional admin profile." };
    }

    return {
      success: true,
      message: `Regional Admin account for ${formData.email} created successfully.`,
    };
  }

  return { success: false, message: "An unknown error occurred." };
}