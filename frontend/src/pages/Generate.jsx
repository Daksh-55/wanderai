import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Generate = () => {
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    budget: 'Mid-range'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post('/api/generate', formData)
      const itineraryId = response.data.itinerary.id
      navigate(`/itinerary/${itineraryId}`)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate itinerary')
      console.error('Error generating itinerary:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="glass-card relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
        
        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="text-8xl mb-6 floating">✈️</div>
            <h1 className="text-5xl font-bold gradient-text mb-4 text-shadow">
              Plan Your Next Adventure
            </h1>
            <p className="text-white/70 text-xl font-medium">Let AI create the perfect itinerary for your trip</p>
            <div className="flex justify-center space-x-8 mt-6 text-white/60">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤖</span>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">⚡</span>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🎯</span>
                <span>Personalized</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="destination" className="block text-lg font-semibold text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">🌍</span>
                Destination
              </label>
              <input
                type="text"
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Paris, France or Tokyo, Japan"
                className="input-field text-lg"
                required
              />
              <p className="text-white/60 mt-2">Enter the city and country you want to visit</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="days" className="block text-lg font-semibold text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">📅</span>
                Number of Days
              </label>
              <input
                type="number"
                id="days"
                name="days"
                value={formData.days}
                onChange={handleChange}
                min="1"
                max="30"
                placeholder="e.g., 7"
                className="input-field text-lg"
                required
              />
              <p className="text-white/60 mt-2">How many days will you be traveling? (1-30 days)</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <label htmlFor="budget" className="block text-lg font-semibold text-white mb-3 flex items-center">
                <span className="text-2xl mr-2">💰</span>
                Budget Level
              </label>
              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className="input-field text-lg"
                required
              >
                <option value="Budget">💵 Budget - Affordable options</option>
                <option value="Mid-range">💳 Mid-range - Comfortable experience</option>
                <option value="Luxury">💎 Luxury - Premium experience</option>
              </select>
              <p className="text-white/60 mt-2">Choose your preferred spending level</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 py-4 text-xl font-bold pulse-glow"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                  ✨ Generating your perfect trip...
                </div>
              ) : (
                '🚀 Generate My Itinerary'
              )}
            </button>
          </form>

          {loading && (
            <div className="mt-8 bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
                <p className="text-blue-300 font-medium">
                  ✨ Our AI is crafting your personalized travel plan. This may take a moment...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Generate