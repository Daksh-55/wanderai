import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/5 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="text-3xl floating">🌍</div>
            <div>
              <span className="text-2xl font-bold gradient-text">WanderAI</span>
              <div className="text-xs text-white/60 font-medium">Smart Travel Planner</div>
            </div>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105">
                  🏠 Dashboard
                </Link>
                <Link to="/generate" className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105">
                  ✈️ New Trip
                </Link>
                <Link to="/profile" className="text-white/80 hover:text-white transition-all duration-300 font-medium hover:scale-105">
                  👤 Profile
                </Link>
                <div className="flex items-center space-x-4 bg-white/15 rounded-full px-5 py-3 backdrop-blur-sm border border-white/30 shadow-lg">
                  <Link to="/profile" className="group relative">
                    <div className="profile-icon w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300 group-hover:scale-110 relative z-10">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      View Profile
                    </div>
                  </Link>
                  <div className="flex flex-col">
                    <span className="text-white font-semibold text-sm">Hi, {user.name}!</span>
                    <span className="text-white/60 text-xs">Welcome back</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 transition-all duration-300 font-medium hover:scale-105 px-2 py-1 rounded-lg hover:bg-red-500/10"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-white transition-all duration-300 font-medium">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  🚀 Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar