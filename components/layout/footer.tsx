import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Consultancy" className="h-8" />
              <span className="font-bold text-lg">
                <span className="text-blue-400">Consult</span>
                <span className="text-white">ancy</span>
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Connecting clients with verified legal, accounting, and consulting professionals worldwide.
            </p>
          </div>

          {/* For Professionals */}
          <div>
            <h3 className="font-semibold mb-4 text-white">For Professionals</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/auth/register?role=PROFESSIONAL" className="hover:text-blue-400 transition">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-blue-400 transition">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-blue-400 transition">
                  Job Board
                </Link>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="font-semibold mb-4 text-white">For Clients</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/professionals" className="hover:text-blue-400 transition">
                  Find Experts
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-400 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-blue-400 transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/" className="hover:text-blue-400 transition">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              &copy; 2025 <span className="text-blue-400 font-semibold">Consultancy</span>. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-slate-400">
              <Link href="/" className="hover:text-blue-400 transition">Security</Link>
              <Link href="/" className="hover:text-blue-400 transition">Status</Link>
              <Link href="/" className="hover:text-blue-400 transition">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
