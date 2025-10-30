import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

const Profile = () => {
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  })
  const [stats, setStats] = useState({
    totalTrips: 0,
    totalDays: 0,
    favoriteDestination: 'None yet'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchUserStats()
  }, [])

  const fetchUserStats = async () => {
    try {
      const response = await axios.get('/api/itineraries')
      const itineraries = response.data
      
      const totalTrips = itineraries.length
      const totalDays = itineraries.reduce((sum, trip) => sum + trip.days, 0)
      
      // Find most common destination
      const destinations = itineraries.map(trip => trip.destination)
      const favoriteDestination = destinations.length > 0 
        ? destinations.reduce((a, b, i, arr) => 
            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
          )
        : 'None yet'

      setStats({ totalTrips, totalDays, favoriteDestination })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await axios.put('/api/auth/profile', formData)
      setMessage('Profile updated successfully!')
      setIsEditing(false)
      
      // Update user in localStorage
      const updatedUser = { ...user, ...formData }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="hero-gradient rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10 flex items-center space-x-6">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl ring-4 ring-white/20 hover:ring-white/40 transition-all duration-300 hover:scale-105">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
            <p className="text-white/80 text-lg">{user?.email}</p>
            <p className="text-white/60 text-sm mt-1">
              Member since {formatDate(user?.createdAt || new Date())}
            </p>
          </div>
        </div>
      </div>

      {/* Travel Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-300 mb-2">{stats.totalTrips}</div>
          <div className="text-white/70">Total Trips Planned</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-300 mb-2">{stats.totalDays}</div>
          <div className="text-white/70">Days of Adventure</div>
        </div>
        <div className="card text-center">
          <div className="text-lg font-semibold text-purple-300 mb-2 truncate">
            {stats.favoriteDestination}
          </div>
          <div className="text-white/70">Favorite Destination</div>
        </div>
      </div>

      {/* Profile Information */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-white">Profile Information</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
            >
              ✏️ Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes('success') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {message}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({ name: user?.name || '', email: user?.email || '' })
                  setMessage('')
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Full Name</label>
              <div className="p-3 bg-white/10 rounded-lg text-white border border-white/20">{user?.name}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email Address</label>
              <div className="p-3 bg-white/10 rounded-lg text-white border border-white/20">{user?.email}</div>
            </div>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="card">
        <h2 className="text-2xl font-semibold text-white mb-4">Account Actions</h2>
        <div className="space-y-3">
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                logout()
              }
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            🚪 Logout
          </button>
          <button
            onClick={() => {
              if (window.confirm('This will permanently delete your account and all your trips. Are you sure?')) {
                // TODO: Implement account deletion
                alert('Account deletion feature coming soon!')
              }
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile