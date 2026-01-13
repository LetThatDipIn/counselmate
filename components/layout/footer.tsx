import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background-dark-secondary text-white border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <p className="text-sm text-gray-400">
              Connecting clients with verified legal and accounting professionals.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">For Professionals</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Become a Provider
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Earn More
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Verification
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">For Clients</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Find a Pro
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  How it Works
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="#" className="hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white">
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 <span className="text-[#1e3a8a]">Counsel</span><span className="text-white">Mate</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
