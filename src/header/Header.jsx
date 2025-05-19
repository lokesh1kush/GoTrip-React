import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { SignInButton, SignOutButton, useUser } from '@clerk/clerk-react'

function Header() {
  const { isSignedIn, user } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="goTrip Logo" className="h-12 w-auto"/>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/create-trip" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Create Trip
            </Link>
            <Link to="/my-trip" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              My Trip
            </Link>
            <Link to="/feedback" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
              Feedback
            </Link>
            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <span className="text-blue-900 text-sm font-medium">
                  Hi, {user.firstName || user.username}
                </span>
                <SignOutButton>
                  <button className="cursor-pointer bg-gray-800 text-white text-sm px-4 py-2 rounded-full shadow-md
                                     hover:bg-white hover:text-gray-800 border border-gray-800 transition duration-300">
                    Logout
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="cursor-pointer bg-blue-800 text-white text-sm px-4 py-2 rounded-full shadow-md
                                   hover:bg-white hover:text-blue-800 border border-blue-800 transition duration-300">
                  Login
                </button>
              </SignInButton>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-lg mt-2">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/create-trip"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Create Trip
              </Link>
              <Link
                to="/my-trip"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                My Trip
              </Link>
              <Link
                to="/feedback"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Feedback
              </Link>
              <div className="px-3 py-2">
                {isSignedIn ? (
                  <div className="flex flex-col space-y-2">
                    <span className="text-blue-900 text-sm font-medium">
                      Hi, {user.firstName || user.username}
                    </span>
                    <SignOutButton>
                      <button className="cursor-pointer w-full bg-gray-800 text-white text-sm px-4 py-2 rounded-full shadow-md
                                       hover:bg-white hover:text-gray-800 border border-gray-800 transition duration-300">
                        Logout
                      </button>
                    </SignOutButton>
                  </div>
                ) : (
                  <SignInButton mode="modal">
                    <button className="cursor-pointer w-full bg-blue-800 text-white text-sm px-4 py-2 rounded-full shadow-md
                                     hover:bg-white hover:text-blue-800 border border-blue-800 transition duration-300">
                      Login
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header 