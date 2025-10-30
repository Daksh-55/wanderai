import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const [itineraries, setItineraries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    fetchItineraries()
  }, [])

  const fetchItineraries = async () => {
    try {
      const response = await axios.get('/api/itineraries')
      setItineraries(response.data)
    } catch (error) {
      setError('Failed to fetch itineraries')
      console.error('Error fetching itineraries:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteItinerary = async (id) => {
    if (!window.confirm('Are you sure you want to delete this itinerary?')) {
      return
    }

    try {
      await axios.delete(`/api/itinerary/${id}`)
      setItineraries(itineraries.filter(item => item._id !== id))
    } catch (error) {
      setError('Failed to delete itinerary')
      console.error('Error deleting itinerary:', error)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <span className="ml-4 text-white text-lg">Loading your trips...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="hero-gradient rounded-3xl p-10 mb-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-shadow">
              Welcome back, <span className="gradient-text">{user?.name}</span>! 👋
            </h1>
            <p className="text-white/80 text-xl font-medium">Ready for your next adventure?</p>
            <div className="flex items-center space-x-4 text-white/60">
              <span className="flex items-center space-x-2">
                <span className="text-2xl">🌟</span>
                <span>AI-Powered Planning</span>
              </span>
              <span className="flex items-center space-x-2">
                <span className="text-2xl">🗺️</span>
                <span>Smart Itineraries</span>
              </span>
            </div>
          </div>
          <Link to="/generate" className="btn-primary text-lg px-8 py-4 glow">
            ✨ Plan New Trip
          </Link>
        </div>
        <div className="absolute top-4 right-4 text-6xl opacity-20 floating">✈️</div>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
          {error}
        </div>
      )}

      {itineraries.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-8xl mb-6 floating">🗺️</div>
          <h2 className="text-3xl font-bold gradient-text mb-4">No trips planned yet</h2>
          <p className="text-white/70 text-lg mb-8 max-w-md mx-auto">Start your journey by creating your first AI-powered itinerary and discover amazing destinations</p>
          <Link to="/generate" className="btn-primary text-lg px-8 py-4 pulse-glow">
            🚀 Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {itineraries.map((itinerary, index) => (
            <div 
              key={itinerary._id} 
              className="card group relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-white group-hover:gradient-text transition-all duration-300">
                    🌍 {itinerary.destination}
                  </h3>
                  <span className={`text-xs font-bold px-3 py-2 rounded-full backdrop-blur-sm border ${
                    itinerary.budget === 'Budget' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                    itinerary.budget === 'Mid-range' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                    'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {itinerary.budget}
                  </span>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-white/80 bg-white/5 rounded-lg p-3">
                    <span className="text-2xl mr-3">📅</span>
                    <div>
                      <div className="font-semibold">{itinerary.days} days</div>
                      <div className="text-sm text-white/60">Duration</div>
                    </div>
                  </div>
                  <div className="flex items-center text-white/80 bg-white/5 rounded-lg p-3">
                    <span className="text-2xl mr-3">🗓️</span>
                    <div>
                      <div className="font-semibold">{formatDate(itinerary.createdAt)}</div>
                      <div className="text-sm text-white/60">Created</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Link
                    to={`/itinerary/${itinerary._id}`}
                    className="flex-1 btn-primary text-center font-semibold"
                  >
                    ✨ View Details
                  </Link>
                  <button
                    onClick={() => deleteItinerary(itinerary._id)}
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-red-200 py-3 px-4 rounded-xl transition-all duration-300 hover:scale-110 border border-red-500/30"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard