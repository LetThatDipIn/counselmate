"use client"

import Link from "next/link"
import { Bell, Settings, LogOut, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function DashboardHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-background-light rounded-lg transition relative">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-2 hover:bg-background-light rounded-lg transition"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-light rounded-full flex items-center justify-center text-white font-bold text-sm">
                  RK
                </div>
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-50">
                  <div className="p-4 border-b border-border">
                    <p className="font-semibold text-text-primary">Rajesh Kumar</p>
                    <p className="text-xs text-text-secondary">rajesh@legalconsult.com</p>
                  </div>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-background-light"
                  >
                    <Settings className="w-4 h-4" />
                    <span className="text-sm">Profile Settings</span>
                  </Link>
                  <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-background-light text-left">
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
