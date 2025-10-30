const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Itinerary = require('../models/Itinerary');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate AI travel plan
router.post('/generate', auth, async (req, res) => {
  try {
    const { destination, days, budget } = req.body;

    if (!destination || !days || !budget) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let itineraryText;

    // Try Gemini API first, fallback to mock if error
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `You are WanderAI, a smart travel assistant. Create a detailed ${days}-day travel itinerary for ${destination} within a ${budget} budget.

IMPORTANT: 
- Use PLAIN TEXT only. NO markdown symbols like *, #, **, [], or backticks.
- Include EXACT location names with proper addresses when possible
- Use REAL place names that exist in ${destination}

Format your response EXACTLY like this structure:

DAY 1: Arrival and City Center
Morning: Arrive at airport and check into hotel near city center
Afternoon: Visit Gateway of India at Apollo Bunder and explore the waterfront area
Evening: Dinner at Trishna Restaurant in Fort district and try local seafood specialties

DAY 2: Cultural Exploration  
Morning: Visit Chhatrapati Shivaji Maharaj Vastu Sangrahalaya Museum in Fort area
Afternoon: Walking tour of Colaba Causeway market and explore local shops
Evening: Attend cultural performance at National Centre for Performing Arts in Nariman Point

Continue this format for all ${days} days.

CRITICAL: For each activity, include:
- EXACT names of attractions, restaurants, and locations in ${destination}
- Specific neighborhoods or areas (like "in Bandra", "near Churchgate", "at Marine Drive")
- Real street names or landmarks when mentioning restaurants or shops
- Actual transportation hubs (specific metro stations, bus stops, etc.)

Include:
- Specific attraction names with their exact locations in ${destination}
- Real restaurant names with their neighborhoods
- Actual transportation details (metro lines, bus routes)
- Budget-friendly suggestions for ${budget.toLowerCase()} travelers
- Cultural insights and local customs
- Safety tips and useful local phrases

Make every location reference REAL and SPECIFIC to ${destination}. Avoid generic names.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      itineraryText = response.text();
      
      console.log('✅ Gemini AI generated itinerary successfully');
    } catch (geminiError) {
      console.log('Gemini API error, using mock itinerary:', geminiError.message);
      
      // Mock itinerary for development
      itineraryText = `🌍 ${destination} - ${days} Day ${budget} Travel Itinerary

📅 DAY 1: Arrival & City Center
• Morning: Arrive and check into accommodation
• Afternoon: Explore the main city center and historic district
• Evening: Welcome dinner at a local restaurant
• Budget tip: Use public transportation for cost-effective travel

📅 DAY 2: Cultural Exploration
• Morning: Visit the most famous museum or cultural site
• Afternoon: Walking tour of historic neighborhoods
• Evening: Local food market experience
• Must-try: Traditional local cuisine

📅 DAY 3: Nature & Outdoor Activities
• Morning: Visit nearby parks or natural attractions
• Afternoon: Outdoor activities (hiking, cycling, or sightseeing)
• Evening: Sunset viewing at a scenic location
• Photo opportunity: Best viewpoints in the city

${days > 3 ? `📅 DAY 4: Local Experiences
• Morning: Local market or shopping district
• Afternoon: Cultural workshop or local experience
• Evening: Entertainment district exploration

` : ''}${days > 4 ? `📅 DAY 5: Day Trip
• Full day: Nearby town or attraction day trip
• Transportation: Train or bus recommendations
• Highlights: Top attractions outside the main city

` : ''}${days > 5 ? `📅 DAYS 6-${days}: Extended Exploration
• Additional days for deeper exploration
• Recommended: Mix of relaxation and adventure
• Local connections: Meet locals and learn about culture
• Shopping: Souvenirs and local products

` : ''}🍽️ FOOD RECOMMENDATIONS:
• Local specialties and where to find them
• Budget-friendly options for ${budget.toLowerCase()} travelers
• Street food safety tips

🚌 TRANSPORTATION:
• Public transport options and costs
• Walking distances between major attractions
• Taxi/rideshare recommendations

💰 BUDGET TIPS for ${budget} Travel:
• Cost-saving strategies
• Free activities and attractions
• Best value accommodations

⚠️ SAFETY & CULTURAL TIPS:
• Local customs to respect
• Safety precautions
• Emergency contacts and phrases

This itinerary is generated by WanderAI - your smart travel companion! 🤖✈️

Note: This is a demo version. For personalized AI-generated itineraries, please ensure OpenAI API access is configured.`;
    }

    // Generate Google Maps link
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

    // Save to database
    const itinerary = new Itinerary({
      userId: req.user._id,
      destination,
      days: parseInt(days),
      budget,
      itinerary: itineraryText,
      mapsLink
    });

    await itinerary.save();

    res.json({
      message: 'Itinerary generated successfully',
      itinerary: {
        id: itinerary._id,
        destination: itinerary.destination,
        days: itinerary.days,
        budget: itinerary.budget,
        itinerary: itinerary.itinerary,
        mapsLink: itinerary.mapsLink,
        createdAt: itinerary.createdAt
      }
    });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ message: 'Failed to generate itinerary', error: error.message });
  }
});

// Get all itineraries for user
router.get('/itineraries', auth, async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(itineraries);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get single itinerary
router.get('/itinerary/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json(itinerary);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete itinerary
router.delete('/itinerary/:id', auth, async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!itinerary) {
      return res.status(404).json({ message: 'Itinerary not found' });
    }

    res.json({ message: 'Itinerary deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;