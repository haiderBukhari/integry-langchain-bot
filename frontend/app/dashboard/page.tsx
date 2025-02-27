// import { LayoutDashboard, Camera, BarChart2, User2, Settings } from 'lucide-react'
'use client'

import Dashboard from '@/components/dashboard/dashboard'
import { useEffect } from 'react';


export default function Page() {
  useEffect(() => {
    const apiKey = localStorage.getItem('integry-api');

    if (!apiKey) {
      window.location.href = '/dashboard/credentials';
    }
  }, []);


  return (
    <div className="flex min-h-screen">
      <Dashboard />
    </div>
  )
}