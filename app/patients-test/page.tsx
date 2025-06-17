// app/patients-test/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function PatientsTest() {
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('patients').select('*')
      console.log(data, error)
      setPatients(data || [])
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>Patient Test</h1>
      <pre>{JSON.stringify(patients, null, 2)}</pre>
    </div>
  )
}
