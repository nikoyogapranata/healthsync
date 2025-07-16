-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.admins (
  admin_id uuid NOT NULL,
  user_id uuid,
  healthcare_facility_id uuid,
  full_name text,
  employee_id text,
  gender text,
  phone_number text,
  date_of_birth date,
  profile_picture text,
  active_status boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  national_id text,
  blood_type text,
  province_id integer,
  regency_id integer,
  district_id integer,
  street_address text,
  CONSTRAINT admins_pkey PRIMARY KEY (admin_id),
  CONSTRAINT admins_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT admins_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(district_id),
  CONSTRAINT admins_regency_id_fkey FOREIGN KEY (regency_id) REFERENCES public.regencies(regency_id),
  CONSTRAINT admins_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id)
);
CREATE TABLE public.ai_suggestions (
  suggestion_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ehr_id uuid,
  model_used text,
  diagnosis_suggestion text,
  recommendations text,
  confidence_score double precision,
  generated_at timestamp without time zone DEFAULT now(),
  doctor_id uuid,
  CONSTRAINT ai_suggestions_pkey PRIMARY KEY (suggestion_id),
  CONSTRAINT ai_suggestions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT ai_suggestions_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehr(ehr_id)
);
CREATE TABLE public.allergy_type (
  allergy_type_id uuid NOT NULL,
  name text,
  description text,
  common_reactions text,
  CONSTRAINT allergy_type_pkey PRIMARY KEY (allergy_type_id)
);
CREATE TABLE public.chat_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_history_pkey PRIMARY KEY (id),
  CONSTRAINT chat_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.chat_messages (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  history_id uuid NOT NULL,
  sender text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_history_id_fkey FOREIGN KEY (history_id) REFERENCES public.chat_history(id)
);
CREATE TABLE public.departments (
  department_id uuid NOT NULL DEFAULT gen_random_uuid(),
  healthcare_facility_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT departments_pkey PRIMARY KEY (department_id),
  CONSTRAINT departments_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id)
);
CREATE TABLE public.diagnosis (
  diagnosis_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ehr_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  symptoms text,
  symptoms_duration text,
  diagnosis_description text,
  treatment_plan text,
  needs_followup boolean,
  created_at timestamp without time zone DEFAULT now(),
  queue_id uuid,
  disease_id uuid,
  CONSTRAINT diagnosis_pkey PRIMARY KEY (diagnosis_id),
  CONSTRAINT diagnosis_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT diagnosis_disease_id_fkey FOREIGN KEY (disease_id) REFERENCES public.diseases(disease_id),
  CONSTRAINT diagnosis_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(queue_id),
  CONSTRAINT diagnosis_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehr(ehr_id),
  CONSTRAINT diagnosis_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id)
);
CREATE TABLE public.directors (
  director_id uuid NOT NULL,
  user_id uuid,
  healthcare_facility_id uuid,
  full_name text,
  gender text,
  phone_number text,
  date_of_birth date,
  profile_picture text,
  active_status boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  national_id text,
  blood_type text,
  province_id integer,
  regency_id integer,
  district_id integer,
  street_address text,
  CONSTRAINT directors_pkey PRIMARY KEY (director_id),
  CONSTRAINT directors_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id),
  CONSTRAINT directors_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT directors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT directors_regency_id_fkey FOREIGN KEY (regency_id) REFERENCES public.regencies(regency_id),
  CONSTRAINT directors_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(district_id)
);
CREATE TABLE public.diseases (
  disease_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icd_10_code character varying UNIQUE,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT diseases_pkey PRIMARY KEY (disease_id)
);
CREATE TABLE public.districts (
  district_id integer NOT NULL,
  regency_id integer NOT NULL,
  name text NOT NULL,
  CONSTRAINT districts_pkey PRIMARY KEY (district_id),
  CONSTRAINT districts_regency_id_fkey FOREIGN KEY (regency_id) REFERENCES public.regencies(regency_id)
);
CREATE TABLE public.doctor_healthcare_facility (
  doctor_healthcare_facility_id uuid NOT NULL,
  doctor_id uuid,
  healthcare_facility_id uuid,
  start_date date,
  end_date date,
  shift_type text,
  role_at_facility text,
  department_id uuid,
  CONSTRAINT doctor_healthcare_facility_pkey PRIMARY KEY (doctor_healthcare_facility_id),
  CONSTRAINT doctor_healthcare_facility_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT doctor_facility_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id),
  CONSTRAINT doctor_healthcare_facility_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id)
);
CREATE TABLE public.doctor_notes (
  doctor_note_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ehr_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  note text,
  family_history text,
  created_at timestamp without time zone DEFAULT now(),
  queue_id uuid,
  CONSTRAINT doctor_notes_pkey PRIMARY KEY (doctor_note_id),
  CONSTRAINT doctor_notes_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT doctor_notes_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehr(ehr_id),
  CONSTRAINT doctor_notes_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT doctor_notes_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(queue_id)
);
CREATE TABLE public.doctor_schedules (
  schedule_id uuid NOT NULL DEFAULT gen_random_uuid(),
  doctor_healthcare_facility_id uuid NOT NULL,
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time time without time zone NOT NULL,
  end_time time without time zone NOT NULL,
  appointment_duration_minutes integer NOT NULL DEFAULT 15,
  CONSTRAINT doctor_schedules_pkey PRIMARY KEY (schedule_id),
  CONSTRAINT doctor_schedules_dhc_id_fkey FOREIGN KEY (doctor_healthcare_facility_id) REFERENCES public.doctor_healthcare_facility(doctor_healthcare_facility_id)
);
CREATE TABLE public.doctors (
  doctor_id uuid NOT NULL,
  user_id uuid,
  full_name text,
  license_number text,
  specialization text,
  phone_number text,
  gender text,
  active_status boolean,
  employee_id text,
  national_id text,
  date_of_birth date,
  blood_type text,
  profile_picture text,
  created_at timestamp without time zone DEFAULT now(),
  province_id integer,
  regency_id integer,
  district_id integer,
  street_address text,
  CONSTRAINT doctors_pkey PRIMARY KEY (doctor_id),
  CONSTRAINT doctors_regency_id_fkey FOREIGN KEY (regency_id) REFERENCES public.regencies(regency_id),
  CONSTRAINT doctors_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id),
  CONSTRAINT doctors_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(district_id),
  CONSTRAINT doctors_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.ehr (
  ehr_id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  visit_reason text,
  visit_type text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT ehr_pkey PRIMARY KEY (ehr_id),
  CONSTRAINT ehr_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT ehr_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT ehr_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id)
);
CREATE TABLE public.examinations (
  examination_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ehr_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  examination_type text,
  examination_name text,
  note text,
  result_file text,
  created_at timestamp without time zone DEFAULT now(),
  queue_id uuid,
  CONSTRAINT examinations_pkey PRIMARY KEY (examination_id),
  CONSTRAINT examinations_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(queue_id),
  CONSTRAINT examinations_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT examinations_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT examinations_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehr(ehr_id)
);
CREATE TABLE public.healthcare_facilities (
  healthcare_facility_id uuid NOT NULL,
  name text,
  type text,
  contact_number text,
  email text,
  created_at timestamp without time zone DEFAULT now(),
  province_id integer,
  regency_id integer,
  district_id integer,
  street_address text,
  CONSTRAINT healthcare_facilities_pkey PRIMARY KEY (healthcare_facility_id),
  CONSTRAINT healthcare_facilities_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(district_id),
  CONSTRAINT healthcare_facilities_regency_id_fkey FOREIGN KEY (regency_id) REFERENCES public.regencies(regency_id),
  CONSTRAINT healthcare_facilities_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id)
);
CREATE TABLE public.medications (
  medication_id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand_name text,
  dosage text,
  form text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT medications_pkey PRIMARY KEY (medication_id)
);
CREATE TABLE public.patient_allergies (
  patient_allergy_id uuid NOT NULL,
  patient_id uuid,
  allergy_type_id uuid,
  reaction text,
  severity text,
  notes text,
  recorded_at timestamp without time zone DEFAULT now(),
  CONSTRAINT patient_allergies_pkey PRIMARY KEY (patient_allergy_id),
  CONSTRAINT patient_allergies_allergy_type_id_fkey FOREIGN KEY (allergy_type_id) REFERENCES public.allergy_type(allergy_type_id),
  CONSTRAINT patient_allergies_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id)
);
CREATE TABLE public.patients (
  patient_id uuid NOT NULL,
  user_id uuid,
  full_name text,
  national_id text,
  date_of_birth date,
  gender text,
  blood_type text,
  phone_number text,
  profile_picture text,
  province_id integer,
  regency_id integer,
  district_id integer,
  street_address text,
  CONSTRAINT patients_pkey PRIMARY KEY (patient_id),
  CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id),
  CONSTRAINT patients_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id),
  CONSTRAINT patients_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(district_id),
  CONSTRAINT patients_regency_id_fkey FOREIGN KEY (regency_id) REFERENCES public.regencies(regency_id)
);
CREATE TABLE public.physical_examinations (
  physical_examination_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ehr_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  heart_rate text,
  blood_pressure text,
  temperature text,
  respiratory_rate text,
  oxygen_saturation text,
  general_observations text,
  findings text,
  created_at timestamp without time zone DEFAULT now(),
  queue_id uuid,
  CONSTRAINT physical_examinations_pkey PRIMARY KEY (physical_examination_id),
  CONSTRAINT physical_examinations_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT physical_examinations_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(queue_id),
  CONSTRAINT physical_examinations_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT physical_examinations_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehr(ehr_id)
);
CREATE TABLE public.prescriptions (
  prescription_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ehr_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  medication_name text,
  dosage text,
  duration text,
  instruction text,
  created_at timestamp without time zone DEFAULT now(),
  queue_id uuid,
  medication_id uuid,
  CONSTRAINT prescriptions_pkey PRIMARY KEY (prescription_id),
  CONSTRAINT prescriptions_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medications(medication_id),
  CONSTRAINT prescriptions_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(queue_id),
  CONSTRAINT prescriptions_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT prescriptions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT prescriptions_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehr(ehr_id)
);
CREATE TABLE public.provinces (
  province_id integer NOT NULL,
  name text NOT NULL,
  CONSTRAINT provinces_pkey PRIMARY KEY (province_id)
);
CREATE TABLE public.queue (
  queue_id uuid NOT NULL DEFAULT gen_random_uuid(),
  patient_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  queue_status text DEFAULT 'Waiting'::text,
  created_at timestamp with time zone DEFAULT now(),
  called_at timestamp with time zone,
  completed_at timestamp with time zone,
  queue_number text,
  visit_type text,
  appointment_time timestamp with time zone,
  payment_status text DEFAULT 'Not Paid'::text,
  department_id uuid,
  visit_reason text,
  CONSTRAINT queue_pkey PRIMARY KEY (queue_id),
  CONSTRAINT queue_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT queue_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(patient_id),
  CONSTRAINT queue_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT queue_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id)
);
CREATE TABLE public.regencies (
  regency_id integer NOT NULL,
  province_id integer NOT NULL,
  name text NOT NULL,
  CONSTRAINT regencies_pkey PRIMARY KEY (regency_id),
  CONSTRAINT regencies_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id)
);
CREATE TABLE public.regional_admins (
  regional_admin_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text,
  national_id text,
  date_of_birth date,
  gender text,
  blood_type text,
  phone_number text,
  profile_picture text,
  active_status boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  province_id integer,
  regency_id integer,
  district_id integer,
  street_address text,
  CONSTRAINT regional_admins_pkey PRIMARY KEY (regional_admin_id),
  CONSTRAINT regional_admins_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(province_id),
  CONSTRAINT regional_admins_regency_id_fkey FOREIGN KEY (regency_id) REFERENCES public.regencies(regency_id),
  CONSTRAINT regional_admins_district_id_fkey FOREIGN KEY (district_id) REFERENCES public.districts(district_id),
  CONSTRAINT regional_admins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.superadmins (
  superadmin_id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT superadmins_pkey PRIMARY KEY (superadmin_id),
  CONSTRAINT superadmins_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id)
);
CREATE TABLE public.users (
  user_id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  password text DEFAULT 'managed_by_supabase_auth'::text,
  role text CHECK (role = ANY (ARRAY['patient'::text, 'doctor'::text, 'admin'::text, 'director'::text, 'regional_admin'::text, 'superadmin'::text])),
  profile_picture text,
  created_at timestamp without time zone DEFAULT now(),
  last_login timestamp without time zone,
  CONSTRAINT users_pkey PRIMARY KEY (user_id)
);
CREATE TABLE public.vaccinations (
  vaccination_id uuid NOT NULL DEFAULT gen_random_uuid(),
  ehr_id uuid,
  doctor_id uuid,
  healthcare_facility_id uuid,
  vaccine_type text,
  vaccine_name text,
  date_given date,
  dose_number text,
  next_dose_date date,
  created_at timestamp without time zone DEFAULT now(),
  queue_id uuid,
  CONSTRAINT vaccinations_pkey PRIMARY KEY (vaccination_id),
  CONSTRAINT vaccinations_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctors(doctor_id),
  CONSTRAINT vaccinations_healthcare_facility_id_fkey FOREIGN KEY (healthcare_facility_id) REFERENCES public.healthcare_facilities(healthcare_facility_id),
  CONSTRAINT vaccinations_queue_id_fkey FOREIGN KEY (queue_id) REFERENCES public.queue(queue_id),
  CONSTRAINT vaccinations_ehr_id_fkey FOREIGN KEY (ehr_id) REFERENCES public.ehr(ehr_id)
);