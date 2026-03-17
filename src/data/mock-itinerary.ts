export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  type: 'dining' | 'sightseeing' | 'transit' | 'accommodation' | 'activity';
  location?: { lat: number; lng: number }; // Optional per-activity pin
  priceINR?: number; // Estimated cost in Indian Rupees
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  description: string;
  location: { lat: number; lng: number };
  activities: Activity[];
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  title: string;
  duration: number;
  days: ItineraryDay[];
  totalPriceINR?: number;
}

// Helper to calculate next days based on a standard format
const generateDateRange = (startDayOffset: number, count: number): string[] => {
  const dates = [];
  const start = new Date(new Date().setDate(new Date().getDate() + startDayOffset));
  for (let i = 0; i < count; i++) {
    const nextDate = new Date(start);
    nextDate.setDate(start.getDate() + i);
    dates.push(nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
  }
  return dates;
};

// --- City Knowledge Base ---
// Each city has real coordinates, top landmarks, restaurants, and activities

interface CityInfo {
  coords: { lat: number; lng: number };
  theme: 'beach' | 'heritage' | 'mountain' | 'metro';
  landmarks: Array<{ name: string; description: string; coords: { lat: number; lng: number } }>;
  restaurants: Array<{ name: string; description: string }>;
  activities: Array<{ name: string; description: string }>;
  transport: string; // How to get there
}

const cityKnowledge: Record<string, CityInfo> = {
  hyderabad: {
    coords: { lat: 17.3850, lng: 78.4867 },
    theme: 'heritage',
    landmarks: [
      { name: "Charminar", description: "The iconic 16th-century monument and mosque, heart of the old city.", coords: { lat: 17.3616, lng: 78.4747 } },
      { name: "Golconda Fort", description: "Magnificent ruined citadel known for its acoustic system and diamond trade history.", coords: { lat: 17.3833, lng: 78.4011 } },
      { name: "Hussain Sagar Lake", description: "A large heart-shaped lake with the giant Buddha statue on an island.", coords: { lat: 17.4239, lng: 78.4738 } },
      { name: "Ramoji Film City", description: "World's largest film studio complex, a full entertainment destination.", coords: { lat: 17.2543, lng: 78.6808 } },
      { name: "Salar Jung Museum", description: "One of India's largest museums, housing rare art from around the world.", coords: { lat: 17.3710, lng: 78.4804 } },
    ],
    restaurants: [
      { name: "Shadab Restaurant", description: "Legendary Hyderabadi Dum Biryani – a must-eat in the old city." },
      { name: "Paradise Biryani", description: "The most famous biryani brand in the city, iconic since 1953." },
      { name: "Ohri's Jiva Imperia", description: "Waterfront dining by Hussain Sagar with panoramic city views." },
    ],
    activities: [
      { name: "Laad Bazaar Pearl Shopping", description: "Shop for world-famous Hyderabadi pearls and bangles near Charminar." },
      { name: "HITEC City Tech Walk", description: "Explore the modern IT hub with its glass towers and global MNC offices." },
    ],
    transport: "Flight to Rajiv Gandhi International Airport (HYD)",
  },
  warangal: {
    coords: { lat: 17.9689, lng: 79.5941 },
    theme: 'heritage',
    landmarks: [
      { name: "Warangal Fort", description: "Ancient Kakatiya dynasty fortress with impressive stone gateways.", coords: { lat: 17.9604, lng: 79.5943 } },
      { name: "Thousand Pillar Temple", description: "11th-century Kakatiya star-shaped temple with intricate carvings.", coords: { lat: 17.9619, lng: 79.5935 } },
      { name: "Ramappa Temple", description: "UNESCO World Heritage Site - a masterpiece of Kakatiya architecture.", coords: { lat: 18.2569, lng: 79.9442 } },
      { name: "Bhadrakali Temple", description: "Ancient lakeside temple with a beautiful scenic backdrop.", coords: { lat: 17.9756, lng: 79.5744 } },
      { name: "Pakhal Lake", description: "Serene artificial lake built by the Kakatiyas, perfect for nature walks.", coords: { lat: 17.8583, lng: 79.9583 } },
    ],
    restaurants: [
      { name: "Minerva Coffee Shop", description: "Popular local chain known for thalis and south Indian breakfast." },
      { name: "Nandini Deluxe", description: "Authentic Telangana-style meals and spiced curries." },
    ],
    activities: [
      { name: "Kakatiya Heritage Walk", description: "Guided walk through the historical Kakatiya-era ruins and monuments." },
      { name: "Eturnagaram Wildlife Sanctuary", description: "Spot deer, wild boar and bison in one of Telangana's oldest sanctuaries." },
    ],
    transport: "Train to Warangal Railway Station from major cities",
  },
  vizag: {
    coords: { lat: 17.6868, lng: 83.2185 },
    theme: 'beach',
    landmarks: [
      { name: "Rushikonda Beach", description: "Golden-sand beach popular for water sports and parasailing.", coords: { lat: 17.7828, lng: 83.3702 } },
      { name: "Borra Caves", description: "Ancient limestone caves in the Araku Valley with stunning stalactites.", coords: { lat: 18.1167, lng: 83.1000 } },
      { name: "INS Kursura Submarine Museum", description: "Decommissioned submarine turned into a fascinating maritime museum.", coords: { lat: 17.7037, lng: 83.2985 } },
      { name: "Kailasagiri Hill Park", description: "Hilltop park with panoramic sea views and a giant Shiva-Parvati statue.", coords: { lat: 17.7468, lng: 83.3785 } },
      { name: "Araku Valley", description: "Scenic coffee-growing valley surrounded by Eastern Ghats mountains.", coords: { lat: 18.3273, lng: 82.8771 } },
    ],
    restaurants: [
      { name: "Bamboo Bay Restaurant", description: "Beachfront seafood restaurant with fresh catch of the day." },
      { name: "Daspalla Hotel Restaurant", description: "City landmark restaurant serving Andhra and North Indian cuisine." },
      { name: "Araku Coffee Café", description: "Sip premium, locally-grown Araku Valley filter coffee." },
    ],
    activities: [
      { name: "Dolphin's Nose Viewpoint", description: "Dramatic cliffside viewpoint shaped like a dolphin's nose." },
      { name: "Beach Road Cycling", description: "Cycle along the scenic coastal road between RK Beach and Rushikonda." },
    ],
    transport: "Flight to Visakhapatnam Airport (VTZ) or train",
  },
  mumbai: {
    coords: { lat: 19.0760, lng: 72.8777 },
    theme: 'metro',
    landmarks: [
      { name: "Gateway of India", description: "The iconic basalt arch monument overlooking the Arabian Sea.", coords: { lat: 18.9220, lng: 72.8347 } },
      { name: "Marine Drive", description: "The famous 'Queen's Necklace' promenade stretching 3.6 km along the sea.", coords: { lat: 18.9432, lng: 72.8235 } },
      { name: "Elephanta Caves", description: "Ancient cave temples with grand carvings, reachable by a scenic ferry.", coords: { lat: 18.9633, lng: 72.9315 } },
      { name: "Chhatrapati Shivaji Terminus", description: "UNESCO-listed Victorian Gothic railway station, an architectural marvel.", coords: { lat: 18.9401, lng: 72.8356 } },
      { name: "Dharavi", description: "Asia's largest slum, offering a fascinating guided community tour.", coords: { lat: 19.0416, lng: 72.8530 } },
    ],
    restaurants: [
      { name: "Trishna Restaurant", description: "Legendary seafood restaurant – try the butter-garlic crab." },
      { name: "Leopold Cafe", description: "Historic 1871 café in Colaba, a Mumbai institution." },
      { name: "Status Restaurant", description: "Famous for Bombay-style sandwiches and vada pav since 1953." },
    ],
    activities: [
      { name: "Bollywood Studio Tour", description: "Go behind the scenes at Film City, Goregaon." },
      { name: "Colaba Causeway Shopping", description: "Browse antiques, jewellery, and streetwear at Mumbai's best flea market." },
    ],
    transport: "Flight to Chhatrapati Shivaji International Airport (BOM)",
  },
  bangalore: {
    coords: { lat: 12.9716, lng: 77.5946 },
    theme: 'metro',
    landmarks: [
      { name: "Lalbagh Botanical Garden", description: "250-year-old garden with a 3,000-year-old Deccan rock, designed by Hyder Ali.", coords: { lat: 12.9507, lng: 77.5848 } },
      { name: "Bangalore Palace", description: "Tudor-style royal palace inspired by Windsor Castle, with fortified towers.", coords: { lat: 12.9985, lng: 77.5920 } },
      { name: "Cubbon Park", description: "A 300-acre green lung of the city, perfect for a morning jog.", coords: { lat: 12.9763, lng: 77.5929 } },
      { name: "ISKCON Temple", description: "One of the largest ISKCON temples in the world, a spiritual and architectural marvel.", coords: { lat: 13.0092, lng: 77.5519 } },
      { name: "Vidhana Soudha", description: "Imposing granite government building, the seat of Karnataka's legislature.", coords: { lat: 12.9793, lng: 77.5905 } },
    ],
    restaurants: [
      { name: "MTR (Mavalli Tiffin Rooms)", description: "Legendary 1924 restaurant famous for its masala dosa and rava idli." },
      { name: "Toit Brewpub", description: "Bangalore's favorite craft beer destination with a great food menu." },
      { name: "The Fatty Bao", description: "Asian street food done right – best dim sum and ramen in the city." },
    ],
    activities: [
      { name: "MG Road Pub Crawl", description: "Explore the vibrant pub culture India's 'Pub Capital' is known for." },
      { name: "Nandi Hills Sunrise Hike", description: "60 km drive to hilltop fort for a breathtaking sunrise experience." },
    ],
    transport: "Flight to Kempegowda International Airport (BLR)",
  },
  goa: {
    coords: { lat: 15.2993, lng: 74.1240 },
    theme: 'beach',
    landmarks: [
      { name: "Basilica of Bom Jesus", description: "UNESCO World Heritage site housing the relics of St. Francis Xavier.", coords: { lat: 15.5009, lng: 73.9113 } },
      { name: "Fort Aguada", description: "17th-century Portuguese fort with a lighthouse, overlooking the sea.", coords: { lat: 15.4943, lng: 73.7743 } },
      { name: "Dudhsagar Waterfalls", description: "One of India's tallest waterfalls cascading through spice plantation forests.", coords: { lat: 15.3143, lng: 74.3137 } },
      { name: "Anjuna Flea Market", description: "Legendary Wednesday flea market – browse bohemian clothes, spices, and curios.", coords: { lat: 15.5800, lng: 73.7400 } },
      { name: "Baga Beach", description: "Lively beach known for water sports, beach shacks, and nightlife.", coords: { lat: 15.5543, lng: 73.7518 } },
    ],
    restaurants: [
      { name: "Thalassa Greek Taverna", description: "Clifftop Greek restaurant in Vagator with stunning sunset views." },
      { name: "Ritz Classic", description: "Local legend for fresh seafood – prawn curry rice done to perfection." },
      { name: "Britto's Beach Shack", description: "Iconic Baga Beach shack open since 1969." },
    ],
    activities: [
      { name: "Mandovi River Sunset Cruise", description: "Enjoy Konkani dance and music on a traditional decorated ferry at dusk." },
      { name: "Spice Plantation Tour", description: "Guided walk through a working spice farm with a traditional Goan lunch." },
    ],
    transport: "Flight to Goa International Airport (GOI) or Vande Bharat Express",
  },
  delhi: {
    coords: { lat: 28.7041, lng: 77.1025 },
    theme: 'heritage',
    landmarks: [
      { name: "Red Fort", description: "Mughal emperor Shah Jahan's 17th-century red sandstone fortress.", coords: { lat: 28.6562, lng: 77.2410 } },
      { name: "India Gate", description: "War memorial arch, with a great lawn for evening picnics.", coords: { lat: 28.6129, lng: 77.2295 } },
      { name: "Qutub Minar", description: "World's tallest brick minaret and a UNESCO World Heritage Site.", coords: { lat: 28.5245, lng: 77.1855 } },
      { name: "Humayun's Tomb", description: "Mughal architectural masterpiece that inspired the Taj Mahal.", coords: { lat: 28.5933, lng: 77.2507 } },
      { name: "Chandni Chowk", description: "400-year-old chaotic and colourful market street in Old Delhi.", coords: { lat: 28.6505, lng: 77.2303 } },
    ],
    restaurants: [
      { name: "Karim's Restaurant", description: "100-year-old Mughal cuisine institution near Jama Masjid, famous for mutton dishes." },
      { name: "Bukhara - ITC Maurya", description: "Consistently rated one of the world's best Indian restaurants." },
      { name: "Paranthe Wali Gali", description: "Narrow Chandni Chowk lane with dozens of shops serving stuffed parathas." },
    ],
    activities: [
      { name: "Delhi Street Food Tour", description: "Guided walk tasting chaat, golgappe, and chole bhature." },
      { name: "Lotus Temple Visit", description: "Stunning Bahá'í House of Worship shaped like a blooming lotus flower." },
    ],
    transport: "Flight to Indira Gandhi International Airport (DEL)",
  },
  kashmir: {
    coords: { lat: 34.0837, lng: 74.7973 },
    theme: 'mountain',
    landmarks: [
      { name: "Dal Lake", description: "The iconic lake with floating gardens and colourful shikaras.", coords: { lat: 34.1015, lng: 74.8305 } },
      { name: "Gulmarg Gondola", description: "World's second-highest operating cable car with snow-capped Himalayan views.", coords: { lat: 34.0484, lng: 74.3805 } },
      { name: "Pahalgam Valley", description: "The 'Valley of Shepherds', a stunning alpine valley with rivers and meadows.", coords: { lat: 34.0163, lng: 75.3150 } },
      { name: "Shankaracharya Temple", description: "Ancient hilltop temple with a 5th-century origin and panoramic valley views.", coords: { lat: 34.0793, lng: 74.8361 } },
      { name: "Betaab Valley", description: "Famous Bollywood filming location surrounded by dense pine forests.", coords: { lat: 34.0491, lng: 75.3521 } },
    ],
    restaurants: [
      { name: "Ahdoos Restaurant", description: "Srinagar's most celebrated restaurant for authentic Kashmiri Wazwan." },
      { name: "The Vintage Chai Shop", description: "Iconic houseboat café on Dal Lake with noon chai and girda." },
    ],
    activities: [
      { name: "Shikara Ride at Sunrise", description: "Glide through serene Dal Lake as the mist lifts off the water at dawn." },
      { name: "Houseboat Stay", description: "Spend a night on one of the ornate hand-carved cedar houseboats." },
    ],
    transport: "Flight to Sheikh ul-Alam International Airport (SXR)",
  },
  rajasthan: {
    coords: { lat: 26.9124, lng: 75.7873 },
    theme: 'heritage',
    landmarks: [
      { name: "Amber Fort", description: "Majestic hilltop fort with stunning mirrored Sheesh Mahal interiors.", coords: { lat: 26.9855, lng: 75.8513 } },
      { name: "Hawa Mahal", description: "The iconic 'Palace of Winds' with 953 small latticed windows.", coords: { lat: 26.9239, lng: 75.8267 } },
      { name: "City Palace Jaipur", description: "A stunning blend of Rajput and Mughal architecture, still a royal residence.", coords: { lat: 26.9258, lng: 75.8237 } },
      { name: "Jal Mahal", description: "A palace seemingly floating in the middle of Man Sagar Lake.", coords: { lat: 26.9524, lng: 75.8319 } },
      { name: "Lake Pichola Udaipur", description: "Serene lake flanked by palaces, ghats, and the Aravalli hills.", coords: { lat: 24.5788, lng: 73.6843 } },
    ],
    restaurants: [
      { name: "Chokhi Dhani", description: "Immersive Rajasthani village experience with traditional Thali dinner." },
      { name: "1135 AD (Amber Fort)", description: "Dining inside Amber Fort itself, with views of the palace gardens below." },
      { name: "Upre by 1000 Hills", description: "Rooftop restaurant overlooking Lake Pichola with sunset fine dining." },
    ],
    activities: [
      { name: "Elephant Ride at Amber Fort", description: "Traditional elephant ride up the winding cobblestone path to Amber Fort." },
      { name: "Johari Bazaar Shopping", description: "Browse Jaipur's famous gem, jewellery, and blue pottery market." },
    ],
    transport: "Flight to Jaipur International Airport (JAI)",
  },
  chennai: {
    coords: { lat: 13.0827, lng: 80.2707 },
    theme: 'heritage',
    landmarks: [
      { name: "Marina Beach", description: "The world's second-longest natural beach, stretching over 13 km.", coords: { lat: 13.0504, lng: 80.2824 } },
      { name: "Kapaleeshwarar Temple", description: "Dravidian-style temple dedicated to Lord Shiva, with a colorful gopuram.", coords: { lat: 13.0338, lng: 80.2699 } },
      { name: "Fort St. George", description: "First English fortress built in India in 1644, now a state museum.", coords: { lat: 13.0802, lng: 80.2877 } },
      { name: "Government Museum Chennai", description: "One of India's oldest museums with a fantastic bronze gallery.", coords: { lat: 13.0667, lng: 80.2543 } },
      { name: "Mahabalipuram Shore Temple", description: "UNESCO-listed 8th-century rock-cut Shore Temple on the Bay of Bengal.", coords: { lat: 12.6269, lng: 80.1927 } },
    ],
    restaurants: [
      { name: "Murugan Idli Shop", description: "The best soft idlis and chutneys in all of Tamil Nadu - a breakfast staple." },
      { name: "Dakshin at ITC Grand Chola", description: "Award-winning South Indian fine dining experience." },
      { name: "Annalakshmi", description: "Run by volunteers, serving traditional Tamil vegetarian cuisine." },
    ],
    activities: [
      { name: "Mahabalipuram Day Trip", description: "1-hour drive south to explore stunning rock-cut cave temples." },
      { name: "Silk Saree Shopping in T. Nagar", description: "Chennai's premier shopping district for Kanchipuram silk sarees." },
    ],
    transport: "Flight to Chennai International Airport (MAA)",
  },
};

// Helper to find a trip based on query parameters
export const getTripByRoute = (fromStr?: string | null, toStr?: string | null): Trip => {
  const origin = fromStr || "Delhi";
  const destination = toStr || "Kashmir";

  const formattedFrom = origin.toLowerCase().trim();
  const formattedTo = destination.toLowerCase().trim();

  const dates = generateDateRange(1, 5);

  // Lookup destination info from knowledge base, fallback to generic
  const destInfo = cityKnowledge[formattedTo];
  const originInfo = cityKnowledge[formattedFrom];

  const destCoords = destInfo?.coords || { lat: 20.5937, lng: 78.9629 };
  const originCoords = originInfo?.coords || { lat: 20.5937, lng: 78.9629 };
  const transport = destInfo?.transport || `Flight/Train to ${destination}`;

  // Pick top 5 landmarks for map pins across 5 days
  const landmarks = destInfo?.landmarks || [
    { name: `${destination} Central`, description: "Heart of the city", coords: destCoords },
    { name: `${destination} Old Town`, description: "Heritage district", coords: { lat: destCoords.lat + 0.01, lng: destCoords.lng + 0.01 } },
    { name: `${destination} Market`, description: "Local market area", coords: { lat: destCoords.lat - 0.01, lng: destCoords.lng + 0.02 } },
    { name: `${destination} Waterfront`, description: "Scenic waterfront", coords: { lat: destCoords.lat + 0.02, lng: destCoords.lng - 0.01 } },
    { name: `${destination} Viewpoint`, description: "Panoramic lookout", coords: { lat: destCoords.lat - 0.02, lng: destCoords.lng - 0.02 } },
  ];

  const restaurants = destInfo?.restaurants || [
    { name: "Local Heritage Restaurant", description: `Best traditional ${destination} cuisine.` },
    { name: "The Grand Café", description: "Popular local dining spot." },
    { name: "Street Food Corner", description: "Try authentic local street food." },
  ];

  const activities = destInfo?.activities || [
    { name: "City Guided Tour", description: `Explore the highlights of ${destination} with a local guide.` },
    { name: "Sunset Viewpoint", description: "Catch the golden hour from the best vantage point in the city." },
  ];

  // Build the theme title
  const theme = destInfo?.theme || 'metro';
  const themeTitle =
    theme === 'beach' ? "Coastal Escape" :
    theme === 'heritage' ? "Heritage & Culture Journey" :
    theme === 'mountain' ? "Alpine & Nature Expedition" :
    "City Explorer";

  return {
    id: `dynamic-${formattedFrom}-${formattedTo}`,
    from: origin,
    to: destination,
    title: `${origin} to ${destination} ${themeTitle}`,
    duration: 5,
    days: [
      {
        id: "dyn-day-1",
        dayNumber: 1,
        date: dates[0],
        title: `Arrival in ${destination}`,
        description: `Begin your journey from ${origin}. Check in and take your first steps exploring ${destination}.`,
        location: landmarks[0].coords,
        activities: [
          {
            id: "dy1a", time: "9:00 AM",
            title: transport,
            description: `Depart ${origin} and arrive in ${destination}.`,
            type: "transit",
            location: originCoords,
            priceINR: 7500,
          },
          {
            id: "dy1b", time: "2:00 PM",
            title: "Hotel Check-in & Freshen Up",
            description: "Settle into your carefully selected accommodation.",
            type: "accommodation",
            location: { lat: destCoords.lat + 0.005, lng: destCoords.lng - 0.005 },
            priceINR: 5000,
          },
          {
            id: "dy1c", time: "4:30 PM",
            title: landmarks[0].name,
            description: landmarks[0].description,
            type: "sightseeing",
            location: landmarks[0].coords,
            priceINR: 350,
          },
          {
            id: "dy1d", time: "8:00 PM",
            title: restaurants[0].name,
            description: restaurants[0].description,
            type: "dining",
            location: { lat: landmarks[0].coords.lat + 0.003, lng: landmarks[0].coords.lng - 0.004 },
            priceINR: 850,
          }
        ]
      },
      {
        id: "dyn-day-2",
        dayNumber: 2,
        date: dates[1],
        title: `${destination} Highlights`,
        description: `A full day exploring the most iconic sights of ${destination}.`,
        location: landmarks[1]?.coords || { lat: destCoords.lat + 0.01, lng: destCoords.lng },
        activities: [
          {
            id: "dy2a", time: "9:00 AM",
            title: landmarks[1]?.name || `${destination} Morning Exploration`,
            description: landmarks[1]?.description || `Explore the heart of ${destination}.`,
            type: "sightseeing",
            location: landmarks[1]?.coords,
            priceINR: 500,
          },
          {
            id: "dy2b", time: "12:30 PM",
            title: restaurants[1]?.name || "Authentic Local Lunch",
            description: restaurants[1]?.description || `Taste the local specialties of ${destination}.`,
            type: "dining",
            location: landmarks[1]?.coords ? { lat: landmarks[1].coords.lat + 0.003, lng: landmarks[1].coords.lng + 0.003 } : undefined,
            priceINR: 700,
          },
          {
            id: "dy2c", time: "3:00 PM",
            title: landmarks[2]?.name || "Afternoon Cultural Visit",
            description: landmarks[2]?.description || "Explore local culture and heritage.",
            type: "sightseeing",
            location: landmarks[2]?.coords,
            priceINR: 400,
          },
          {
            id: "dy2d", time: "6:30 PM",
            title: activities[0]?.name || "Evening Activity",
            description: activities[0]?.description || `Enjoy a popular local activity.`,
            type: "activity",
            location: landmarks[2]?.coords ? { lat: landmarks[2].coords.lat - 0.002, lng: landmarks[2].coords.lng + 0.002 } : undefined,
            priceINR: 1200,
          }
        ]
      },
      {
        id: "dyn-day-3",
        dayNumber: 3,
        date: dates[2],
        title: "Hidden Gems & Local Culture",
        description: `Go deeper into the unique culture and experiences of ${destination}.`,
        location: landmarks[2]?.coords || { lat: destCoords.lat - 0.01, lng: destCoords.lng + 0.01 },
        activities: [
          {
            id: "dy3a", time: "9:30 AM",
            title: landmarks[3]?.name || "Day Excursion",
            description: landmarks[3]?.description || `Explore a lesser-known gem of ${destination}.`,
            type: "activity",
            location: landmarks[3]?.coords,
            priceINR: 800,
          },
          {
            id: "dy3b", time: "1:00 PM",
            title: restaurants[2]?.name || "Local Market Lunch",
            description: restaurants[2]?.description || "Taste authentic street food and snacks.",
            type: "dining",
            location: landmarks[3]?.coords ? { lat: landmarks[3].coords.lat + 0.004, lng: landmarks[3].coords.lng - 0.003 } : undefined,
            priceINR: 600,
          },
          {
            id: "dy3c", time: "3:30 PM",
            title: landmarks[4]?.name || "Scenic Spot",
            description: landmarks[4]?.description || "A beautiful viewpoint or natural landmark.",
            type: "sightseeing",
            location: landmarks[4]?.coords,
            priceINR: 300,
          },
          {
            id: "dy3d", time: "7:00 PM",
            title: "Cultural Evening Experience",
            description: `Enjoy local art, music, or a cultural performance in ${destination}.`,
            type: "activity",
            location: landmarks[4]?.coords ? { lat: landmarks[4].coords.lat - 0.003, lng: landmarks[4].coords.lng + 0.003 } : undefined,
            priceINR: 1500,
          }
        ]
      },
      {
        id: "dyn-day-4",
        dayNumber: 4,
        date: dates[3],
        title: "Leisure & Shopping",
        description: `A relaxed day for shopping, cafes, and exploring at your own pace.`,
        location: landmarks[3]?.coords || { lat: destCoords.lat + 0.02, lng: destCoords.lng - 0.01 },
        activities: [
          {
            id: "dy4a", time: "10:30 AM",
            title: activities[1]?.name || "Local Shopping & Souvenirs",
            description: activities[1]?.description || `Browse the markets of ${destination} for unique souvenirs.`,
            type: "activity",
            location: { lat: destCoords.lat + 0.008, lng: destCoords.lng + 0.006 },
            priceINR: 2500,
          },
          {
            id: "dy4b", time: "1:30 PM",
            title: "Cafe Hopping",
            description: `Discover award-winning local cafes and ${destination}'s coffee culture.`,
            type: "dining",
            location: { lat: destCoords.lat + 0.006, lng: destCoords.lng - 0.004 },
            priceINR: 550,
          },
          {
            id: "dy4c", time: "5:00 PM",
            title: "Sunset at a Scenic Spot",
            description: `Watch the sun set over ${destination} from a breathtaking vantage point.`,
            type: "sightseeing",
            location: { lat: destCoords.lat - 0.01, lng: destCoords.lng + 0.006 },
            priceINR: 0,
          }
        ]
      },
      {
        id: "dyn-day-5",
        dayNumber: 5,
        date: dates[4],
        title: "Final Morning & Departure",
        description: `A final leisurely morning before heading back to ${origin}.`,
        location: landmarks[4]?.coords || { lat: destCoords.lat - 0.02, lng: destCoords.lng - 0.02 },
        activities: [
          {
            id: "dy5a", time: "9:00 AM",
            title: "Final Morning at Leisure",
            description: `Take one last slow walk through the streets of ${destination}.`,
            type: "activity",
            location: { lat: destCoords.lat + 0.003, lng: destCoords.lng - 0.007 },
            priceINR: 0,
          },
          {
            id: "dy5b", time: "11:30 AM",
            title: "Farewell Meal",
            description: `One last authentic meal before leaving ${destination} behind.`,
            type: "dining",
            location: { lat: destCoords.lat - 0.006, lng: destCoords.lng + 0.004 },
            priceINR: 1000,
          },
          {
            id: "dy5c", time: "3:00 PM",
            title: `Return to ${origin}`,
            description: `Head to the airport or station for your journey back to ${origin}.`,
            type: "transit",
            location: originCoords,
            priceINR: 7500,
          }
        ]
      }
    ],
    totalPriceINR: 7500 + 5000 + 350 + 850 + 500 + 700 + 400 + 1200 + 800 + 600 + 300 + 1500 + 2500 + 550 + 0 + 0 + 1000 + 7500,
  };
};
