import React from 'react'
import { Link } from 'react-router-dom'

const Body = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-800 mb-4">
          Discover Your Next Adventure with AI
        </h1>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-8">
          Personalized Itineraries at Your Fingertips
        </h2>

        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your interests and budget.
        </p>

        <Link to="/create-trip">
          <button className="bg-blue-800 text-white px-6 py-3 rounded-full text-base sm:text-lg font-medium shadow-lg border-2 border-blue-800 hover:bg-white hover:text-blue-800 transition duration-300 cursor-pointer">
            Get Started, It's Free
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Body 