"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Shield, User, LogOut } from "lucide-react"
import { useAuth } from "@/lib/context/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    window.location.href = '/'
  }

  const getUserInitials = () => {
    if (!user) return 'U'
    const firstInitial = user.first_name?.[0] || ''
    const lastInitial = user.last_name?.[0] || ''
    return `${firstInitial}${lastInitial}`.toUpperCase() || 'U'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Consultancy" className="h-8" />
            <span className="font-bold text-lg">
              <span className="text-[#1e3a8a]">Consult</span>
              <span className="text-black">ancy</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/professionals" className="text-text-secondary hover:text-primary transition">
              Find Professionals
            </Link>
            {isAuthenticated && user?.role === 'PROFESSIONAL' && (
              <Link href="/jobs" className="text-text-secondary hover:text-primary transition">
                Job Board
              </Link>
            )}
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="text-text-secondary hover:text-primary transition">
                  Dashboard
                </Link>
                {/* Messages removed - websockets not implemented yet */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarImage src={user?.profile_picture} alt={user?.first_name} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                        <p className="text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings/role" className="cursor-pointer">
                        Account Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-text-secondary hover:text-primary transition">
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/professionals" className="block text-text-secondary hover:text-primary">
              Find Professionals
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block text-text-secondary hover:text-primary">
                  Dashboard
                </Link>
                <Link href="/profile" className="block text-text-secondary hover:text-primary">
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-text-secondary hover:text-primary">
                  Sign In
                </Link>
                <Link href="/auth/register" className="block w-full bg-primary text-white px-4 py-2 rounded-lg text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
