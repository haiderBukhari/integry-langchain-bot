'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation' // Import usePathname from next/navigation
import { motion } from 'framer-motion'
import { LayoutDashboard, Camera, BluetoothConnected, User2, Settings, Menu, LogOut } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { successToast } from '@/helpers/toasts'
import Image from 'next/image'

const navItems = [
  {
    title: 'Overview',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'New Chat',
    icon: Camera,
    href: '/dashboard/chat'
  },
  {
    title: 'Connect App',
    icon: BluetoothConnected,
    href: '/dashboard/connect-apps'
  },
  {
    title: 'Credentials',
    icon: Settings,
    href: '/dashboard/credentials'
  },
  {
    title: 'How to Get Credentials?',
    icon: User2,
    href: '/dashboard/getcredentials'
  },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname() // Use usePathname to get the current path

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="p-6 flex">
        <Image src='/integry.svg' height={30} width={30} alt='integry logo'></Image>
        <h2 className="text-lg font-semibold ml-2">Integry</h2>
      </div>
      <nav className="flex-1 space-y-1 py-4 pl-4">
        {navItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground",
              pathname === item.href && "bg-muted text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
        <div
          onClick={() => {
            localStorage.removeItem('integry-api');
            router.push('/')
            successToast("Successfully Logged Out")
          }}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground cursor-pointer",
          )}
        >
          <LogOut className="h-4 w-4" />
          {"LogOut"}
        </div>

      </nav>
    </div>
  )

  return (
    <>
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:block w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <NavContent />
      </motion.div>
    </>
  )
}
