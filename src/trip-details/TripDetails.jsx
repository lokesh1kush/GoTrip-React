import React, { useEffect, useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai"
import { marked } from 'marked'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useUser } from '@clerk/clerk-react'
import { useLocation } from 'react-router-dom'

function TripDetails({ destination, days, budget, travelWith }) {
  const { user } = useUser()
  const location = useLocation()
  const [placePhotos, setPlacePhotos] = useState([])
  const [tripPlan, setTripPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const isRegenerating = location.state?.isRegenerating

  const generateAITrip = async () => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      });

      const prompt = {
        contents: [{
          parts: [{
            text: `Create a detailed ${days}-day trip itinerary for ${destination} with a ${budget.title} budget, traveling with ${travelWith.title}. Include:
            1. Day-by-day breakdown
            2. Must-visit attractions
            3. Budget-friendly food recommendations
            4. Local transportation tips
            5. Estimated costs for activities
            Format the response in markdown.`
          }]
        }]
      };

      console.log('Starting trip plan generation...');
      console.log('Using model:', "gemini-2.0-flash");
      console.log('Prompt:', JSON.stringify(prompt, null, 2));
      
      const result = await model.generateContent(prompt);
      console.log('Generation completed');
      
      const response = await result.response;
      const text = response.text();
      console.log('Response received');
      
      setTripPlan(text);
      setError(null);
    } catch (error) {
      console.error('Error generating trip plan:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });
      setError('Failed to generate trip plan. Please try again later.');
      setTripPlan(null);
    }
  };

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch place photos using Unsplash API
        const photosResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${destination}&per_page=6`,
          {
            headers: {
              'Authorization': `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`
            }
          }
        );
        
        if (!photosResponse.ok) {
          throw new Error('Failed to fetch photos');
        }
        
        const photosData = await photosResponse.json();
        setPlacePhotos(photosData.results);

        // Generate AI trip plan
        await generateAITrip();
      } catch (error) {
        console.error('Error fetching place details:', error);
        setError('Failed to load trip details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [destination, days, budget, travelWith]);

  const handleSaveTrip = async () => {
    if (!user) {
      setError('Please sign in to save your trip');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving trip for user:', user.id);
      
      const tripData = {
        userId: user.id,
        destination,
        days,
        budget: budget.title,
        travelWith: travelWith.title,
        tripPlan,
        createdAt: serverTimestamp(),
      };

      console.log('Trip data to save:', tripData);
      
      const docRef = await addDoc(collection(db, 'trips'), tripData);
      console.log('Trip saved with ID:', docRef.id);
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Detailed error saving trip:', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      setError('Failed to save trip. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 flex justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-center text-red-600">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 mb-10">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-800 mb-6 md:mb-8 text-center">Your Trip to {destination}</h2>
      
      {/* Trip Summary */}
      <div className="bg-gray-50 p-4 sm:p-6 rounded-lg">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Trip Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Duration</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{days} Days</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Budget</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{budget.title}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-600">Traveling With</p>
            <p className="text-base sm:text-lg font-semibold text-gray-900">{travelWith.title}</p>
          </div>
        </div>
      </div>

      {/* Destination Photos */}
      <div className="mt-8 sm:mt-10">
        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900">Image Gallery of {destination}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {placePhotos.map((photo) => (
            <div key={photo.id} className="rounded-lg overflow-hidden h-40 sm:h-48 group relative">
              <img
                src={photo.urls.regular}
                alt={photo.alt_description}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                Photo by {photo.user.name} on Unsplash
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Generated Trip Plan */}
      {tripPlan && (
        <div className="mt-12 sm:mt-16">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-blue-800 text-center tracking-tight">Your Personalized Itinerary :</h3>
          <div className="p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl border border-gray-100">
            <div 
              className="space-y-4 sm:space-y-6 prose prose-sm sm:prose-base lg:prose-lg max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: marked(tripPlan, {
                  breaks: true,
                  gfm: true
                }) 
              }} 
            />
          </div>
        </div>
      )}

      {/* Save Trip Button */}
      {tripPlan && !isRegenerating && (
        <div className="mt-6 sm:mt-8 flex justify-center sm:justify-end">
          <button
            onClick={handleSaveTrip}
            disabled={isSaving}
            className={`px-4 py-2 rounded-3xl cursor-pointer text-white font-semibold text-sm sm:text-base ${
              isSaving ? 'bg-gray-400' : 'bg-blue-900 hover:bg-white hover:text-blue-900 border-1 hover:border-blue-900'
            } transition-colors duration-200`}
          >
            {isSaving ? 'Saving...' : saveSuccess ? 'Trip Saved!' : 'Save Trip'}
          </button>
        </div>
      )}
    </div>
  );
}

export default TripDetails; 