import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import jsPDF from 'jspdf'

// Component to render itinerary with step-by-step format
const ItineraryRenderer = ({ itinerary, destination }) => {
  const [editingLocation, setEditingLocation] = useState(null)
  const [customLocations, setCustomLocations] = useState({})
  const parseItinerary = (text) => {
    // Clean up markdown formatting
    const cleanText = text
      .replace(/\*\*/g, '') // Remove bold markdown
      .replace(/\*/g, '') // Remove asterisks
      .replace(/#{1,6}\s*/g, '') // Remove markdown headers
      .replace(/\[([^\]]+)\]/g, '$1') // Remove square brackets but keep content
      .replace(/`([^`]+)`/g, '$1') // Remove code backticks but keep content
    
    const lines = cleanText.split('\n').filter(line => line.trim())
    const days = []
    let currentDay = null
    
    lines.forEach(line => {
      let trimmedLine = line.trim()
      
      // Clean up any remaining markdown symbols
      trimmedLine = trimmedLine
        .replace(/^[#*\-•]+\s*/, '') // Remove leading symbols
        .replace(/[*#]+$/, '') // Remove trailing symbols
        .trim()
      
      // Skip empty lines or lines with only symbols
      if (!trimmedLine || /^[#*\-•\s]+$/.test(trimmedLine)) return
      
      // Check if it's a day header
      if (trimmedLine.match(/day\s*\d+/i) || trimmedLine.includes('DAY')) {
        if (currentDay) days.push(currentDay)
        currentDay = {
          title: trimmedLine,
          activities: []
        }
      } else if (currentDay && trimmedLine.length > 0) {
        // Parse activities - look for time patterns or bullet points
        if (trimmedLine.includes(':') || trimmedLine.match(/^(morning|afternoon|evening)/i)) {
          const colonIndex = trimmedLine.indexOf(':')
          if (colonIndex > 0) {
            const time = trimmedLine.substring(0, colonIndex).trim()
            const description = trimmedLine.substring(colonIndex + 1).trim()
            
            if (description) {
              currentDay.activities.push({
                time: time,
                description: description,
                location: extractLocation(description)
              })
            }
          } else {
            // No colon, treat as general activity
            currentDay.activities.push({
              time: '',
              description: trimmedLine,
              location: extractLocation(trimmedLine)
            })
          }
        } else if (trimmedLine.length > 10) {
          // Add as general activity if it's substantial content
          currentDay.activities.push({
            time: '',
            description: trimmedLine,
            location: extractLocation(trimmedLine)
          })
        }
      }
    })
    
    if (currentDay) days.push(currentDay)
    return days
  }
  
  const extractLocation = (text) => {
    // Clean the text first
    const cleanedText = text
      .replace(/[*#`\[\]]/g, '') // Remove markdown symbols
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim()
    
    // Look for specific location patterns
    const locationPatterns = [
      // Look for "at [Location]" or "to [Location]"
      /(?:at|to|visit|explore)\s+([A-Z][a-zA-Z\s]+?)(?:\s-|\s\(|$|,)/i,
      // Look for quoted locations
      /"([^"]+)"/,
      // Look for locations after common prepositions
      /(?:near|in|around)\s+([A-Z][a-zA-Z\s]+?)(?:\s-|\s\(|$|,)/i,
      // Look for museum, temple, fort, etc.
      /([A-Z][a-zA-Z\s]*(?:Museum|Temple|Fort|Palace|Market|Beach|Park|Gallery|Cathedral|Mosque|Church|Tower|Bridge|Square|Garden|Mall|Center|Station))/i
    ]
    
    // Try each pattern
    for (const pattern of locationPatterns) {
      const match = cleanedText.match(pattern)
      if (match && match[1]) {
        const location = match[1].trim()
        // Filter out common words that aren't locations
        const excludeWords = ['Morning', 'Afternoon', 'Evening', 'Visit', 'Explore', 'Take', 'Dinner', 'Lunch', 'Breakfast', 'Hotel', 'Restaurant', 'Local', 'Traditional', 'Famous', 'Popular']
        if (!excludeWords.some(word => location.includes(word))) {
          return location
        }
      }
    }
    
    // Fallback: look for capitalized words (improved)
    const words = cleanedText.split(' ')
    const excludeWords = ['Morning', 'Afternoon', 'Evening', 'Visit', 'Explore', 'Take', 'Dinner', 'Lunch', 'Breakfast', 'Hotel', 'Restaurant', 'Local', 'Traditional', 'Famous', 'Popular', 'Check', 'Arrive', 'Depart']
    const locations = words.filter(word => 
      word.length > 3 && 
      word[0] === word[0].toUpperCase() && 
      !excludeWords.includes(word) &&
      !/^\d/.test(word) // Exclude numbers
    )
    
    return locations.slice(0, 2).join(' ') || null
  }
  
  const getDirectionsUrl = (location, activity) => {
    if (!location) return null
    
    // Create a more specific search query
    const searchQuery = `${location}, ${destination}`
    
    // If it's a specific type of place, add context
    const activityLower = activity.toLowerCase()
    let placeType = ''
    
    if (activityLower.includes('museum')) placeType = ' museum'
    else if (activityLower.includes('temple') || activityLower.includes('church') || activityLower.includes('mosque')) placeType = ' religious site'
    else if (activityLower.includes('restaurant') || activityLower.includes('food') || activityLower.includes('dinner') || activityLower.includes('lunch')) placeType = ' restaurant'
    else if (activityLower.includes('market') || activityLower.includes('shopping')) placeType = ' market'
    else if (activityLower.includes('beach')) placeType = ' beach'
    else if (activityLower.includes('park') || activityLower.includes('garden')) placeType = ' park'
    
    const finalQuery = searchQuery + placeType
    
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(finalQuery)}`
  }
  
  const days = parseItinerary(itinerary)
  
  return (
    <div className="space-y-8">
      {days.map((day, dayIndex) => (
        <div key={dayIndex} className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-4 font-bold">
              {dayIndex + 1}
            </span>
            {day.title}
          </h3>
          
          <div className="space-y-4">
            {day.activities.map((activity, actIndex) => (
              <div key={actIndex} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {activity.time && (
                      <div className="text-blue-400 font-semibold mb-2 flex items-center">
                        <span className="text-lg mr-2">🕐</span>
                        {activity.time}
                      </div>
                    )}
                    <div className="text-white/90 leading-relaxed">
                      {activity.description}
                    </div>
                    {activity.location && (
                      <div className="text-white/60 text-sm mt-2 flex items-center">
                        <span className="mr-1">📍</span>
                        {editingLocation === `${dayIndex}-${actIndex}` ? (
                          <input
                            type="text"
                            defaultValue={customLocations[`${dayIndex}-${actIndex}`] || activity.location}
                            onBlur={(e) => {
                              setCustomLocations(prev => ({
                                ...prev,
                                [`${dayIndex}-${actIndex}`]: e.target.value
                              }))
                              setEditingLocation(null)
                            }}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                setCustomLocations(prev => ({
                                  ...prev,
                                  [`${dayIndex}-${actIndex}`]: e.target.value
                                }))
                                setEditingLocation(null)
                              }
                            }}
                            className="bg-white/10 text-white px-2 py-1 rounded text-sm border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-400"
                            autoFocus
                          />
                        ) : (
                          <span 
                            className="cursor-pointer hover:text-white/80 hover:underline"
                            onClick={() => setEditingLocation(`${dayIndex}-${actIndex}`)}
                            title="Click to edit location"
                          >
                            {customLocations[`${dayIndex}-${actIndex}`] || activity.location}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {activity.location && (
                    <a
                      href={getDirectionsUrl(customLocations[`${dayIndex}-${actIndex}`] || activity.location, activity.description)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-4 bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 hover:text-blue-200 px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 border border-blue-500/30 hover:scale-105"
                      title={`Get directions to ${customLocations[`${dayIndex}-${actIndex}`] || activity.location}`}
                    >
                      <span>🧭</span>
                      <span className="font-medium">Directions</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      {days.length === 0 && (
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-2xl font-bold text-white mb-4">Your Itinerary</h3>
          <div className="text-white/80 leading-relaxed whitespace-pre-wrap text-left">
            {itinerary
              .replace(/\*\*/g, '') // Remove bold markdown
              .replace(/\*/g, '') // Remove asterisks
              .replace(/#{1,6}\s*/g, '') // Remove markdown headers
              .replace(/\[([^\]]+)\]/g, '$1') // Remove square brackets but keep content
              .replace(/`([^`]+)`/g, '$1') // Remove code backticks but keep content
            }
          </div>
        </div>
      )}
    </div>
  )
}

const ItineraryDetail = () => {
  const { id } = useParams()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchItinerary()
  }, [id])

  const fetchItinerary = async () => {
    try {
      const response = await axios.get(`/api/itinerary/${id}`)
      setItinerary(response.data)
    } catch (error) {
      setError('Failed to fetch itinerary')
      console.error('Error fetching itinerary:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = () => {
    if (!itinerary) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.width
    const margin = 20
    const maxWidth = pageWidth - 2 * margin

    // Title
    doc.setFontSize(20)
    doc.text(`${itinerary.destination} - ${itinerary.days} Day Itinerary`, margin, 30)

    // Subtitle
    doc.setFontSize(12)
    doc.text(`Budget: ${itinerary.budget} | Generated by WanderAI`, margin, 45)

    // Content
    doc.setFontSize(10)
    const lines = doc.splitTextToSize(itinerary.itinerary, maxWidth)
    doc.text(lines, margin, 60)

    // Save
    doc.save(`${itinerary.destination}-itinerary.pdf`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        <span className="ml-4 text-white text-lg">Loading your itinerary...</span>
      </div>
    )
  }

  if (error || !itinerary) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl backdrop-blur-sm">
          {error || 'Itinerary not found'}
        </div>
        <Link to="/dashboard" className="btn-primary mt-4 inline-block">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="hero-gradient rounded-3xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4 text-shadow flex items-center">
                <span className="text-6xl mr-4">🌍</span>
                {itinerary.destination}
              </h1>
              <div className="flex items-center space-x-6 text-white/80 text-lg">
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-2xl">📅</span>
                  <span className="font-semibold">{itinerary.days} days</span>
                </div>
                <div className={`flex items-center space-x-2 rounded-full px-4 py-2 backdrop-blur-sm ${
                  itinerary.budget === 'Budget' ? 'bg-green-500/20 text-green-300' :
                  itinerary.budget === 'Mid-range' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  <span className="text-2xl">💰</span>
                  <span className="font-semibold">{itinerary.budget}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                  <span className="text-2xl">📆</span>
                  <span className="font-semibold">{formatDate(itinerary.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <a
                href={itinerary.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex items-center space-x-2"
              >
                <span>📍</span>
                <span>View on Google Maps</span>
              </a>
              <button
                onClick={downloadPDF}
                className="btn-secondary flex items-center space-x-2"
              >
                <span>🧾</span>
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
        <div className="absolute top-4 right-4 text-8xl opacity-10 floating">✈️</div>
      </div>

      {/* Itinerary Content */}
      <div className="card">
        <h2 className="text-3xl font-bold gradient-text mb-8 flex items-center">
          <span className="text-4xl mr-3">🗺️</span>
          Your AI-Generated Itinerary
        </h2>
        <ItineraryRenderer itinerary={itinerary.itinerary} destination={itinerary.destination} />
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mt-8">
        <Link to="/dashboard" className="btn-secondary flex items-center space-x-2">
          <span>←</span>
          <span>Back to Dashboard</span>
        </Link>
        <Link to="/generate" className="btn-primary flex items-center space-x-2 pulse-glow">
          <span>✨</span>
          <span>Plan Another Trip</span>
        </Link>
      </div>
    </div>
  )
}

export default ItineraryDetail