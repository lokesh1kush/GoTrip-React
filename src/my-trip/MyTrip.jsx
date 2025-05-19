import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useUser } from '@clerk/clerk-react';

function MyTrip() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingTripId, setDeletingTripId] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }

      try {
        console.log('Current user ID:', user.id);
        
        const tripsQuery = query(
          collection(db, 'trips'),
          where('userId', '==', user.id)
        );

        console.log('Executing Firestore query...');
        const querySnapshot = await getDocs(tripsQuery);
        console.log('Query completed. Number of documents:', querySnapshot.size);

        if (querySnapshot.empty) {
          console.log('No trips found for user');
          setTrips([]);
          setError(null);
          return;
        }

        const tripsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt
          }))
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(0);
            const dateB = b.createdAt?.toDate?.() || new Date(0);
            return dateB - dateA;
          });

        setTrips(tripsData);
        setError(null);
      } catch (error) {
        console.error('Firestore error:', error);
        
        let errorMessage = 'Failed to load trips. ';
        
        if (error.message.includes('ERR_BLOCKED_BY_CLIENT') || 
            error.message.includes('net::ERR_BLOCKED_BY_CLIENT')) {
          errorMessage = 'Unable to connect to the database. This might be due to an ad blocker or security software. Please try disabling your ad blocker or security software temporarily.';
        } else if (error.code === 'permission-denied') {
          errorMessage += 'You do not have permission to access this data.';
        } else if (error.code === 'unauthenticated') {
          errorMessage += 'Please sign in to view your trips.';
        } else {
          errorMessage += 'Please try again later.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user]);

  const handleRegenerateTrip = (trip) => {
    navigate('/create-trip', {
      state: {
        isRegenerating: true,
        tripData: {
          destination: trip.destination,
          days: trip.days,
          budget: { title: trip.budget },
          travelWith: { title: trip.travelWith },
          tripPlan: trip.tripPlan
        }
      }
    });
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) {
      return;
    }

    setDeletingTripId(tripId);
    try {
      await deleteDoc(doc(db, 'trips', tripId));
      // Update the trips list by removing the deleted trip
      setTrips(trips.filter(trip => trip.id !== tripId));
    } catch (error) {
      console.error('Error deleting trip:', error);
      setError('Failed to delete trip. Please try again.');
    } finally {
      setDeletingTripId(null);
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
      <div className="mt-10 text-center">
        <div className="bg-red-50 p-6 rounded-lg max-w-md mx-auto">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-600">
              If the problem persists, please check your ad blocker settings or try using a different browser.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="mt-10 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Saved Trips</h2>
        <p className="text-gray-600 mb-6">You haven't saved any trips yet.</p>
        <button
          onClick={() => navigate('/create-trip')}
          className="px-6 py-3 rounded-3xl cursor-pointer border-1 bg-blue-600 text-white
                   hover:bg-white hover:text-blue-600 hover:border-blue-600 transition duration-300"
        >
          Create New Trip
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">My Saved Trips</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <div key={trip.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-2 text-center">{trip.destination}</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-medium text-gray-800">{trip.days} Days</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium text-gray-800">{trip.budget}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Traveling With</p>
                  <p className="font-medium text-gray-800">{trip.travelWith}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Saved On</p>
                  <p className="font-medium text-gray-800">
                    {trip.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleRegenerateTrip(trip)}
                  className="px-4 py-2 rounded-3xl border-1 bg-blue-900 text-white hover:border-blue-900 hover:bg-white hover:text-blue-900 transition-colors cursor-pointer"
                >
                  View Trip
                </button>
                <button
                  onClick={() => handleDeleteTrip(trip.id)}
                  disabled={deletingTripId === trip.id}
                  className={`px-4 py-2 rounded-3xl transition-colors cursor-pointer ${
                    deletingTripId === trip.id
                      ? 'bg-gray-400 text-white'
                      : 'bg-gray-900 text-white hover:bg-white hover:text-gray-900 border-1 hover:border-gray-900'
                  }`}
                >
                  {deletingTripId === trip.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyTrip;