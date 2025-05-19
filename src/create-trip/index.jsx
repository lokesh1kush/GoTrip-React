import { Input } from '@/components/ui/input'
import { SelectBudgetOptions, SelectTravelList } from '@/constants/options'
import React, { useState, useEffect } from 'react'
import TripDetails from '../trip-details/TripDetails'
import { useUser, SignInButton } from '@clerk/clerk-react'
import { useNavigate, useLocation } from 'react-router-dom'

function CreateTrip() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [destination, setDestination] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [days, setDays] = useState('')
  const [budget, setBudget] = useState({ title: 'Budget' })
  const [travelWith, setTravelWith] = useState({ title: 'Solo' })
  const [showTripDetails, setShowTripDetails] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  console.log('API Key:', import.meta.env.VITE_RAPIDAPI_KEY)

  useEffect(() => {
    // Check if we're regenerating a trip
    if (location.state?.isRegenerating && location.state?.tripData) {
      const { tripData } = location.state;
      setDestination(tripData.destination);
      setDays(tripData.days);
      setBudget(tripData.budget);
      setTravelWith(tripData.travelWith);
      setIsGenerating(true); // Automatically start generating the trip
    }
  }, [location.state]);

  const handleDestinationChange = async (e) => {
    const value = e.target.value
    setDestination(value)

    if (value.length > 1) {
      setIsLoading(true)
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${value}&limit=10&sort=-population`,
          {
            headers: {
              'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY, // You'll get this after signing up
              'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
          }
        )
        const data = await response.json()
        setSuggestions(data.data || [])
        setShowSuggestions(true)
      } catch (error) {
        console.error('Error fetching cities:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (city) => {
    setDestination(`${city.city}, ${city.country}`)
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleGenerateTrip = () => {
    if (!isSignedIn) {
      return;
    }

    if (destination && days && budget && travelWith) {
      setIsGenerating(true);
    } else {
      alert('Please fill in all fields');
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsGenerating(true);
  };

  if (isGenerating) {
    return (
      <div className="mt-16">
        <TripDetails
          destination={destination}
          days={days}
          budget={budget}
          travelWith={travelWith}
        />
      </div>
    );
  }

  return (
    <section className='flex flex-col mx-4 md:mx-[260px] py-[50px] font-serif'>
      <h2 className='text-2xl md:text-[40px] text-blue-800 font-bold text-center'>
        Create Your Perfect Trip
      </h2>
      <p className='text-gray-600 text-md md:text-[20px] mt-2 text-center'>
        Tell us about your dream destination and we'll help you plan it.
      </p>
      <div className='flex flex-col gap-10'>
        <div className='mt-14 relative'>
          <h2 className='text-lg md:text-[20px] mb-2 text-gray-800 text-center'>
            Where do you want to go?
          </h2>
          <Input
            placeholder={'Destination...'}
            value={destination}
            onChange={handleDestinationChange}
            onFocus={() => destination && setShowSuggestions(true)}
            className="w-full"
          />
          {isLoading && (
            <div className="absolute right-3 top-[38px]">
              <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
            </div>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((city) => (
                <li
                  key={city.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
                  onClick={() => handleSuggestionClick(city)}
                >
                  {city.city}, {city.country}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className='text-lg md:text-[20px] mb-2 text-gray-800 text-center'>
            How many days are you planning your trip?
          </h2>
          <Input 
            placeholder={'Enter number of days...'} 
            type='number'
            min="1"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>
      </div>
      <div className='mt-10'>
        <h2 className='text-lg md:text-[20px] mb-2 text-gray-800 text-center'>
          What is Your Budget?
        </h2>
        <p className='text-gray-600 text-center'>
          The budget is exclusively allocated for activities and dining purposes.
        </p>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-2xl ${
                budget?.title === item.title ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setBudget(item)}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg text-gray-800'>{item.title}</h2>
              <h2 className='text-sm text-gray-600'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-10'>
        <h2 className='text-lg md:text-[20px] mb-2 text-gray-800 text-center'>
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mt-5'>
          {SelectTravelList.map((item, index) => (
            <div 
              key={index} 
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-2xl ${
                travelWith?.title === item.title ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setTravelWith(item)}
            >
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg text-gray-800'>{item.title}</h2>
              <h2 className='text-sm text-gray-600'>{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-end'>
        {isSignedIn ? (
          <button 
            onClick={handleGenerateTrip}
            className='text-white rounded-3xl bg-gray-800 px-3 py-2 border-1 shadow-lg mt-10 hover:bg-white hover:text-black hover:border-gray-900 transition duration-300 cursor-pointer'
          >
            Generate Trip
          </button>
        ) : (
          <SignInButton mode="modal">
            <button 
              className='text-white rounded-3xl bg-gray-800 px-3 py-2 border-1 shadow-lg mt-10 hover:bg-white hover:text-black hover:border-gray-900 transition duration-300 cursor-pointer'
            >
              Sign in to Generate Trip
            </button>
          </SignInButton>
        )}
      </div>
    </section>
  )
}

export default CreateTrip