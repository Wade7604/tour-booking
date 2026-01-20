const { GoogleGenerativeAI } = require("@google/generative-ai");
const TourService = require("./tour.service");
const DestinationService = require("./destination.service");

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.toursCache = null;
    this.destinationsCache = null;
    this.cacheExpiry = null;
    this.CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  }

  // Initialize Gemini AI
  _initializeGemini() {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
      }
      
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    }
    return this.model;
  }

  // Fetch and cache tours data
  async _getToursData() {
    const now = Date.now();
    if (this.toursCache && this.cacheExpiry && now < this.cacheExpiry) {
      return this.toursCache;
    }

    try {
      const result = await TourService.getAllTours({ 
        status: "active", 
        limit: 100 
      });
      
      // Format tours for AI context
      this.toursCache = result.tours.map(tour => ({
        id: tour.id,
        name: tour.name,
        slug: tour.slug,
        description: tour.description,
        duration: tour.duration,
        price: tour.price,
        difficulty: tour.difficulty,
        tourType: tour.tourType,
        maxGroupSize: tour.maxGroupSize,
        includes: tour.includes,
        destination: tour.destination?.name || null,
        destinationId: tour.destinationId,
        featured: tour.featured,
        availableDates: tour.availableDates?.map(d => ({
          startDate: d.startDate,
          endDate: d.endDate,
          availableSlots: d.availableSlots,
          price: d.price
        }))
      }));

      this.cacheExpiry = now + this.CACHE_DURATION;
      return this.toursCache;
    } catch (error) {
      console.error("Error fetching tours for Gemini:", error);
      return [];
    }
  }

  // Fetch and cache destinations data
  async _getDestinationsData() {
    const now = Date.now();
    if (this.destinationsCache && this.cacheExpiry && now < this.cacheExpiry) {
      return this.destinationsCache;
    }

    try {
      const result = await DestinationService.getAllDestinations(1, 100, { status: "active" });
      
      // Format destinations for AI context
      this.destinationsCache = result.destinations.map(dest => ({
        id: dest.id,
        name: dest.name,
        slug: dest.slug,
        description: dest.description,
        country: dest.country,
        city: dest.city
      }));

      this.cacheExpiry = now + this.CACHE_DURATION;
      return this.destinationsCache;
    } catch (error) {
      console.error("Error fetching destinations for Gemini:", error);
      return [];
    }
  }

  // Build context for AI
  async _buildContext() {
    const [tours, destinations] = await Promise.all([
      this._getToursData(),
      this._getDestinationsData()
    ]);

    return {
      tours,
      destinations,
      systemPrompt: `You are an intelligent travel assistant for TourBooking, a professional travel company in Vietnam.

## Available Data:

### DESTINATIONS (${destinations.length} locations):
${destinations.map(d => `- ${d.name} (${d.city}, ${d.country}) [slug: ${d.slug}]: ${d.description?.substring(0, 100) || 'Attractive destination'}...`).join('\n')}

### TOURS (${tours.length} tours):
${tours.map(t => {
  const priceFormatted = t.price?.adult ? new Intl.NumberFormat('en-US').format(t.price.adult) + ' VND' : 'Contact us';
  const duration = t.duration ? `${t.duration.days} days ${t.duration.nights} nights` : '';
  return `- ${t.name} [slug: ${t.slug}]
  + Duration: ${duration}
  + Price: ${priceFormatted}/adult
  + Difficulty: ${t.difficulty || 'Easy'}
  + Type: ${t.tourType || 'Tour'}
  + Destination: ${t.destination || 'Multiple locations'}
  + Description: ${t.description?.substring(0, 150) || ''}...`;
}).join('\n\n')}

## IMPORTANT Response Guidelines:

### Text Response Format:
1. Write in a friendly, conversational tone in English
2. DO NOT use markdown headers (###) in your response
3. DO NOT mention or show slug values to the user (slugs are internal technical details)
4. DO NOT show [slug: xxx] annotations in your text
5. Use simple formatting: bold for emphasis, bullet points for lists
6. When suggesting tours, mention: name, duration, price, and why it's suitable
7. When suggesting destinations, mention: name, location, and why it's attractive
8. Be concise but informative - keep responses under 400 words
9. If no exact match, suggest similar options and explain why

### Suggestions Format (Separate JSON Block):
⚠️ CRITICAL: You MUST use EXACT slugs from the data above. Your suggestions will be validated!

AFTER your text response, include a JSON block with slugs for clickable cards.
This block should be SEPARATE from your text response.

**SLUG RULES - FOLLOW EXACTLY:**
1. ONLY use slugs that appear in the [slug: xxx] annotations in the data above
2. DO NOT create, modify, or guess slugs
3. DO NOT use tour/destination names as slugs
4. Copy the exact slug value character-by-character from the data
5. Invalid slugs will be automatically rejected by the system

\`\`\`suggestions
{
  "tours": [{"slug": "exact-slug-from-data", "name": "Tour Name", "reason": "Brief reason"}],
  "destinations": [{"slug": "exact-slug-from-data", "name": "Destination Name", "reason": "Brief reason"}]
}
\`\`\`

### Example Response Structure:
User asks: "I want a beach vacation"

Your response should look like:
"Vietnam has amazing beach destinations! I recommend Phu Quoc Island Paradise tour (4 days/3 nights, 5,500,000 VND per person). This tour takes you to pristine beaches with crystal clear waters, perfect for swimming and relaxation.

For destinations, Phu Quoc is known as the Pearl Island with beautiful shores and serene atmosphere. Nha Trang offers vibrant coastal city life with excellent diving spots. Both are perfect for a beach getaway!"

Then separately include the JSON block with EXACT slugs copied from the data list above.

REMEMBER: 
- Users should NEVER see slug values or [slug: xxx] in your text response!
- In the JSON block, use ONLY the exact slugs shown in the data above!
`
    };
  }

  // Parse suggestions from AI response and validate slugs
  _parseSuggestions(text) {
    const suggestions = {
      tours: [],
      destinations: []
    };

    try {
      // Find JSON block in response
      const suggestionsMatch = text.match(/```suggestions\n?([\s\S]*?)\n?```/);
      if (suggestionsMatch) {
        const jsonString = suggestionsMatch[1].trim();
        
        // Check if JSON looks complete (has closing braces)
        if (!jsonString.endsWith('}')) {
          console.warn('Incomplete JSON block detected in Gemini response');
          return suggestions; // Return empty suggestions
        }
        
        const parsed = JSON.parse(jsonString);
        
        // Get valid slugs from cache for validation
        const validTourSlugs = new Set(this.toursCache?.map(t => t.slug) || []);
        const validDestSlugs = new Set(this.destinationsCache?.map(d => d.slug) || []);
        
        // Validate and sanitize tours - ONLY include tours with valid slugs
        if (Array.isArray(parsed.tours)) {
          suggestions.tours = parsed.tours.filter(tour => {
            if (!tour || typeof tour !== 'object' || !tour.slug || !tour.name) {
              return false;
            }
            // Check if slug exists in our actual data
            if (!validTourSlugs.has(tour.slug)) {
              console.warn(`Invalid tour slug from Gemini: "${tour.slug}" - skipping`);
              return false;
            }
            return true;
          });
        }
        
        // Validate and sanitize destinations - ONLY include destinations with valid slugs
        if (Array.isArray(parsed.destinations)) {
          suggestions.destinations = parsed.destinations.filter(dest => {
            if (!dest || typeof dest !== 'object' || !dest.slug || !dest.name) {
              return false;
            }
            // Check if slug exists in our actual data
            if (!validDestSlugs.has(dest.slug)) {
              console.warn(`Invalid destination slug from Gemini: "${dest.slug}" - skipping`);
              return false;
            }
            return true;
          });
        }
      }
    } catch (error) {
      console.error("Error parsing suggestions:", error.message);
      console.warn("Malformed JSON in Gemini response - suggestions will be skipped");
      // Return empty suggestions instead of crashing
    }

    return suggestions;
  }

  // Clean response text (remove JSON block for display)
  _cleanResponseText(text) {
    // Only remove complete suggestion blocks (those with closing ```)
    let cleanedText = text.replace(/```suggestions\n?([\s\S]*?)\n?```/g, '').trim();
    
    // If there's an incomplete block (starts with ```suggestions but no closing)
    // Remove it to avoid showing malformed JSON to user
    const incompleteMatch = cleanedText.match(/```suggestions\n?([\s\S]*?)$/);
    if (incompleteMatch) {
      console.warn('Removing incomplete suggestion block from response');
      cleanedText = cleanedText.replace(/```suggestions\n?[\s\S]*$/, '').trim();
    }
    
    // Remove markdown headers (###) from response text
    // This removes lines that start with one or more # symbols
    cleanedText = cleanedText.replace(/^#{1,6}\s+.+$/gm, '').trim();
    
    // Clean up multiple consecutive line breaks
    cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n').trim();
    
    return cleanedText;
  }

  // Main chat function
  async chat(message, conversationHistory = []) {
    try {
      const model = this._initializeGemini();
      const context = await this._buildContext();

      // Build conversation for Gemini
      const contents = [];

      // Add system context as first user message
      contents.push({
        role: "user",
        parts: [{ text: context.systemPrompt }]
      });

      // Add system acknowledgment
      contents.push({
        role: "model",
        parts: [{ text: "I understand. I'm TourBooking's travel assistant and I'll help you find the perfect tour. What kind of travel experience are you looking for?" }]
      });

      // Add conversation history
      for (const msg of conversationHistory) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }

      // Add current message
      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      // Generate response
      const result = await model.generateContent({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      const response = result.response;
      const text = response.text();

      // Parse suggestions and clean text
      const suggestions = this._parseSuggestions(text);
      const cleanText = this._cleanResponseText(text);

      return {
        success: true,
        message: cleanText,
        suggestions,
        context: {
          toursCount: context.tours.length,
          destinationsCount: context.destinations.length
        }
      };
    } catch (error) {
      console.error("Gemini chat error:", error);
      throw error;
    }
  }

  // Get quick suggestions based on user preferences
  async getQuickSuggestions(preferences = {}) {
    try {
      const { 
        budget, 
        duration, 
        difficulty, 
        tourType, 
        destination 
      } = preferences;

      const tours = await this._getToursData();
      const destinations = await this._getDestinationsData();

      let filteredTours = [...tours];

      // Filter by budget
      if (budget) {
        filteredTours = filteredTours.filter(t => 
          t.price?.adult && t.price.adult <= budget
        );
      }

      // Filter by duration
      if (duration) {
        filteredTours = filteredTours.filter(t => 
          t.duration?.days && t.duration.days <= duration
        );
      }

      // Filter by difficulty
      if (difficulty) {
        filteredTours = filteredTours.filter(t => 
          t.difficulty === difficulty
        );
      }

      // Filter by tour type
      if (tourType) {
        filteredTours = filteredTours.filter(t => 
          t.tourType === tourType
        );
      }

      // Filter by destination
      if (destination) {
        const destLower = destination.toLowerCase();
        filteredTours = filteredTours.filter(t => 
          t.destination?.toLowerCase().includes(destLower)
        );
      }

      // Sort by featured first
      filteredTours.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

      // Return top 5 suggestions
      return {
        success: true,
        suggestions: {
          tours: filteredTours.slice(0, 5),
          destinations: destinations.slice(0, 5)
        },
        totalMatches: filteredTours.length
      };
    } catch (error) {
      console.error("Error getting quick suggestions:", error);
      throw error;
    }
  }

  // Chat with streaming (for future use)
  async chatStream(message, conversationHistory = [], onChunk) {
    try {
      const model = this._initializeGemini();
      const context = await this._buildContext();

      const contents = [];
      contents.push({
        role: "user",
        parts: [{ text: context.systemPrompt }]
      });
      contents.push({
        role: "model",
        parts: [{ text: "I understand. I'll help you find the perfect tour." }]
      });

      for (const msg of conversationHistory) {
        contents.push({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        });
      }

      contents.push({
        role: "user",
        parts: [{ text: message }]
      });

      const result = await model.generateContentStream({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      });

      let fullText = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        if (onChunk) {
          onChunk(chunkText);
        }
      }

      const suggestions = this._parseSuggestions(fullText);
      const cleanText = this._cleanResponseText(fullText);

      return {
        success: true,
        message: cleanText,
        suggestions
      };
    } catch (error) {
      console.error("Gemini stream error:", error);
      throw error;
    }
  }

  // Clear cache manually
  clearCache() {
    this.toursCache = null;
    this.destinationsCache = null;
    this.cacheExpiry = null;
  }
}

module.exports = new GeminiService();
