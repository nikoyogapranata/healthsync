// app/api/patients/route.ts
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase.from('patients').select('*')
  return Response.json({ data, error })
}
