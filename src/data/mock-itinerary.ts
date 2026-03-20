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
  headerImage?: string; // High-quality vibe/city image
  forecast?: { temp: number; condition: 'Sunny' | 'Cloudy' | 'Rainy' | 'Mist' | 'Snow' };
}

export interface Trip {
  id: string;
  from: string;
  to: string;
  title: string;
  duration: number;
  days: ItineraryDay[];
  totalPriceINR?: number;
  localDelicacies: Delicacy[];
  photoGallery: string[];
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

export interface Delicacy {
  name: string;
  description: string;
  image: string;
}

interface CityInfo {
  coords: { lat: number; lng: number };
  theme: 'beach' | 'heritage' | 'mountain' | 'metro';
  landmarks: Array<{ name: string; description: string; coords: { lat: number; lng: number } }>;
  restaurants: Array<{ name: string; description: string }>;
  activities: Array<{ name: string; description: string }>;
  transport: string;
  image: string; // High-quality city hero image
  localDelicacies: Delicacy[];
  photoGallery: string[];
}

const cityKnowledge: Record<string, CityInfo> = {
  hyderabad: {
    coords: { lat: 17.3850, lng: 78.4867 },
    theme: 'heritage',
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Hyderabadi Dum Biryani", description: "World-famous slow-cooked basmati rice with marinated meat and spices.", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=400" },
      { name: "Haleem", description: "A savory stew of meat, lentils, and pounded wheat, traditionally had during Ramadan.", image: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=400" },
      { name: "Qubani-ka-Meetha", description: "An apricot-based dessert served with fresh cream or ice cream.", image: "https://images.unsplash.com/photo-1563805039227-9aba5244583e?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1572435230485-61c0f0f58444?auto=format&fit=crop&q=80&w=800"
    ]
  },
  warangal: {
    coords: { lat: 17.9689, lng: 79.5941 },
    theme: 'heritage',
    image: "https://images.unsplash.com/photo-1603260391630-302bf0699279?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Sarva Pindi", description: "Savory pancake made with rice flour and chana dal.", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400" },
      { name: "Polelu", description: "Traditional sweet flatbread filled with jaggery and lentils.", image: "https://images.unsplash.com/photo-1589118949245-7d40afbfa28e?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: []
  },
  vizag: {
    coords: { lat: 17.6868, lng: 83.2185 },
    theme: 'beach',
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Bamboo Chicken", description: "Araku specialty - chicken cooked inside green bamboo stalks.", image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=400" },
      { name: "Andhra Fish Curry", description: "Tangy and spicy fish curry made with tamarind.", image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: []
  },
  mumbai: {
    coords: { lat: 19.0760, lng: 72.8777 },
    theme: 'metro',
    image: "https://images.unsplash.com/photo-1570160897040-fb42e886ea73?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Vada Pav", description: "The ultimate Bombay burger - spicy potato fritter in a bun.", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400" },
      { name: "Pav Bhaji", description: "Mashed vegetable curry served with buttery toasted buns.", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&q=80&w=400" },
      { name: "Misal Pav", description: "Spicy sprout curry topped with farsan and served with bread.", image: "https://images.unsplash.com/photo-1645177623570-52a8069d451d?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: [
      "https://images.unsplash.com/photo-1566549033225-546bcc816e87?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1570160897040-fb42e886ea73?auto=format&fit=crop&q=80&w=800"
    ]
  },
  bangalore: {
    coords: { lat: 12.9716, lng: 77.5946 },
    theme: 'metro',
    image: "https://images.unsplash.com/photo-1596422846543-75c6fc18a593?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Benne Masala Dosa", description: "Crispy rice crepe with a generous dollop of butter and potato filling.", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400" },
      { name: "Mysore Pak", description: "Rich and melt-in-the-mouth sweet made with ghee, sugar, and gram flour.", image: "https://images.unsplash.com/photo-1589119634710-14e9f7823521?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: []
  },
  goa: {
    coords: { lat: 15.2993, lng: 74.1240 },
    theme: 'beach',
    image: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Prawn Gassi", description: "Traditional Goan coconut-based prawn curry.", image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400" },
      { name: "Bebinca", description: "Iconic 7-layer Goan pudding made with coconut milk and cardamom.", image: "https://images.unsplash.com/photo-1551024506-0bccd1315b81?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: [
      "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=800"
    ]
  },
  delhi: {
    coords: { lat: 28.7041, lng: 77.1025 },
    theme: 'heritage',
    image: "https://images.unsplash.com/photo-1587474260584-1f3c8b4437ed?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Butter Chicken", description: "The legendary Delhi original - creamy, tomato-based gravy with tandoori chicken.", image: "https://images.unsplash.com/photo-1603894584373-5ac82b245005?auto=format&fit=crop&q=80&w=400" },
      { name: "Chole Bhature", description: "Tangy chickpeas served with fluffy, deep-fried bread.", image: "https://images.unsplash.com/photo-1626132646529-5aa2ef9693bc?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: []
  },
  kashmir: {
    coords: { lat: 34.0837, lng: 74.7973 },
    theme: 'mountain',
    image: "https://images.unsplash.com/photo-1610444317180-3330691e8bed?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Kashmiri Wazwan", description: "A multi-course formal meal, almost all courses are meat-based.", image: "https://images.unsplash.com/photo-1589118949245-7d40afbfa28e?auto=format&fit=crop&q=80&w=400" },
      { name: "Roganjosh", description: "Aromatic lamb dish cooked with yogurt and Kashmiri chilies.", image: "https://images.unsplash.com/photo-1545243125-9685ed158f19?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: []
  },
  rajasthan: {
    coords: { lat: 26.9124, lng: 75.7873 },
    theme: 'heritage',
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Dal Baati Churma", description: "Hard wheat rolls (baati) with spicy lentil curry (dal) and sweet crumbled wheat (churma).", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400" },
      { name: "Laal Maas", description: "Fiery mutton curry cooked with local Mathania chilies.", image: "https://images.unsplash.com/photo-1545243125-9685ed158f19?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: []
  },
  chennai: {
    coords: { lat: 13.0827, lng: 80.2707 },
    theme: 'heritage',
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&q=80&w=1200",
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
    localDelicacies: [
      { name: "Masala Dosa", description: "Thin and crispy rice crepe filled with spiced potato masala.", image: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=400" },
      { name: "Idli & Vada", description: "Steamed rice cakes and lentil doughnuts served with sambar and coconut chutney.", image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=400" }
    ],
    photoGallery: []
  },
};

import { supabase } from "@/lib/supabase";

// Helper to find a trip based on query parameters
export const getTripByRoute = async (fromStr?: string | null, toStr?: string | null, vibeStr?: string | null, budgetStr?: string | null): Promise<Trip> => {
  const origin = fromStr || "Delhi";
  const destination = toStr || "Kashmir";
  const vibeParam = (vibeStr || 'balanced').toLowerCase();
  
  // Parse budget, default to 45k if not provided
  const maxBudget = budgetStr ? parseInt(budgetStr) : 45000;

  const formattedFrom = origin.toLowerCase().trim();
  const formattedTo = destination.toLowerCase().trim();

  // Fetch city data from Supabase
  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .in('name', [formattedFrom, formattedTo]) as any;

  const destData = cities?.find((c: any) => c.name === formattedTo);
  const originData = cities?.find((c: any) => c.name === formattedFrom);

  // Dynamic duration based on budget
  let suggestedDuration = 5;
  if (maxBudget < 15000) suggestedDuration = 3;
  else if (maxBudget < 25000) suggestedDuration = 4;
  
  const dates = generateDateRange(1, suggestedDuration);

  // Lookup destination info from DB, fallback to knowledge base if missing
  const destInfo: CityInfo = (destData ? {
    coords: { lat: destData.coords_lat, lng: destData.coords_lng },
    theme: destData.theme as any,
    landmarks: (destData.photo_gallery as any) || cityKnowledge[formattedTo]?.landmarks || [],
    restaurants: (destData.local_delicacies as any) || cityKnowledge[formattedTo]?.restaurants || [],
    activities: cityKnowledge[formattedTo]?.activities || [],
    transport: cityKnowledge[formattedTo]?.transport || `Flight/Train to ${destination}`,
    image: destData.image_url || cityKnowledge[formattedTo]?.image || "",
    localDelicacies: (destData.local_delicacies as any) || cityKnowledge[formattedTo]?.localDelicacies || [],
    photoGallery: destData.photo_gallery || cityKnowledge[formattedTo]?.photoGallery || []
  } : cityKnowledge[formattedTo]) || cityKnowledge['kashmir'];

  const originInfo: Partial<CityInfo> = originData ? { 
    coords: { lat: originData.coords_lat, lng: originData.coords_lng } 
  } : (cityKnowledge[formattedFrom] || { coords: { lat: 20.5937, lng: 78.9629 } });

  const destCoords = destInfo.coords;
  const originCoords = originInfo.coords || { lat: 20.5937, lng: 78.9629 };
  const transport = destInfo.transport;
  const landmarks = destInfo.landmarks;
  const restaurants = destInfo.restaurants;

  const delicacies = (destData?.local_delicacies as any) || [
    { name: "Local Heritage Restaurant", description: `Best traditional ${destination} cuisine.` },
    { name: "The Grand Café", description: "Popular local dining spot." },
    { name: "Street Food Corner", description: "Try authentic local street food." },
  ];

  // Helper to adjust prices based on budget
  // We use 40k as a "medium" budget benchmark
  const budgetRatio = maxBudget / 40000;
  
  // Tier Analysis
  const isBudgetUser = maxBudget < 20000;
  const isLuxuryUser = maxBudget > 70000;

  const getInitialAdjustedPrice = (base: number, type: string) => {
    if (type === 'transit') {
      if (isBudgetUser) return 1500 + Math.floor(Math.random() * 1000); // Realistic Bus/Train cost
      if (maxBudget < 45000) return 4000 + Math.floor(Math.random() * 2000); // Economy Flight/AC Train
      if (isLuxuryUser) return 12000 + Math.floor(Math.random() * 5000); // Premium Flight
      return base;
    }
    if (type === 'accommodation') {
       // Min 800 for budget, max scaling for luxury
      return Math.floor(Math.max(800, base * Math.max(0.2, Math.min(3.0, budgetRatio))));
    }
    if (type === 'dining') {
      return Math.floor(Math.max(300, base * Math.max(0.4, Math.min(2.0, budgetRatio))));
    }
    return Math.floor(Math.max(200, base * Math.max(0.5, Math.min(1.5, budgetRatio))));
  };

  // Build the theme title
  const theme = destInfo?.theme || 'metro';
  const themeTitle =
    theme === 'beach' ? "Coastal Escape" :
    theme === 'heritage' ? "Heritage & Culture Journey" :
    theme === 'mountain' ? "Alpine & Nature Expedition" :
    "City Explorer";

  // --- Shortest Path Optimization ---
  const sortedLandmarks: typeof landmarks = [landmarks[0]];
  const pool = landmarks.slice(1);
  let currentCoords = landmarks[0].coords;

  while (pool.length > 0) {
    let closestIdx = 0;
    let minDistance = Infinity;
    for (let i = 0; i < pool.length; i++) {
      const dist = Math.sqrt(Math.pow(pool[i].coords.lat - currentCoords.lat, 2) + Math.pow(pool[i].coords.lng - currentCoords.lng, 2));
      if (dist < minDistance) { minDistance = dist; closestIdx = i; }
    }
    const next = pool.splice(closestIdx, 1)[0];
    sortedLandmarks.push(next);
    currentCoords = next.coords;
  }

  const days: ItineraryDay[] = [];
  
  // Day 1: Arrival
  days.push({
    id: "dyn-day-1",
    dayNumber: 1,
    date: dates[0],
    title: `Arrival & ${theme === 'beach' ? 'Beach' : 'Heritage'} Start`,
    description: `Touch down and begin your ${vibeParam} centered journey in ${destination}.`,
    location: sortedLandmarks[0].coords,
    headerImage: destInfo?.image || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200",
    forecast: { temp: 30, condition: 'Sunny' },
    activities: [
      {
        id: "dy1a", time: "9:00 AM",
        title: isBudgetUser ? `State Bus to ${destination}` : (isLuxuryUser ? `Direct Flight to ${destination}` : transport),
        description: isBudgetUser ? `Scenic budget-friendly local transport.` : `Swift travel from ${origin} to ${destination}.`,
        type: "transit",
        location: originCoords,
        priceINR: getInitialAdjustedPrice(7500, 'transit'),
      },
      {
        id: "dy1b", time: "2:00 PM",
        title: isLuxuryUser ? "Luxury Suite Check-in" : (isBudgetUser ? "Hostel/Guesthouse Check-in" : "Boutique Hotel Check-in"),
        description: isLuxuryUser ? "Relax with premium amenities and city views." : "Settle into your comfortable stay.",
        type: "accommodation",
        location: { lat: sortedLandmarks[0].coords.lat + 0.005, lng: sortedLandmarks[0].coords.lng - 0.005 },
        priceINR: getInitialAdjustedPrice(5000, 'accommodation'),
      },
      {
        id: "dy1c", time: "4:30 PM",
        title: sortedLandmarks[0].name,
        description: sortedLandmarks[0].description,
        type: "sightseeing",
        location: sortedLandmarks[0].coords,
        priceINR: getInitialAdjustedPrice(350, 'sightseeing'),
      },
      {
        id: "dy1d", time: "8:00 PM",
        title: isBudgetUser ? "Famous Street Food Lane" : (isLuxuryUser ? "Gourmet Fine Dining" : restaurants[0].name),
        description: isBudgetUser ? "Taste the most authentic local flavors from street vendors." : (isLuxuryUser ? "A curated multi-course culinary experience." : restaurants[0].description),
        type: "dining",
        location: { lat: sortedLandmarks[0].coords.lat + 0.003, lng: sortedLandmarks[0].coords.lng - 0.004 },
        priceINR: getInitialAdjustedPrice(1200, 'dining'),
      }
    ]
  });

  // Intermediate Days
  for (let i = 1; i < suggestedDuration - 1; i++) {
    const landmarkIdx = (i * 2) % sortedLandmarks.length;
    days.push({
      id: `dyn-day-${i+1}`,
      dayNumber: i + 1,
      date: dates[i],
      title: `${destination} Deep Dive`,
      description: `Exploring the hidden gems and ${vibeParam} spots of the city.`,
      location: sortedLandmarks[landmarkIdx].coords,
      headerImage: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1200",
      forecast: { temp: 28, condition: 'Sunny' },
      activities: [
        {
          id: `dy${i+1}a`, time: "10:00 AM",
          title: sortedLandmarks[landmarkIdx].name,
          description: sortedLandmarks[landmarkIdx].description,
          type: "sightseeing",
          location: sortedLandmarks[landmarkIdx].coords,
          priceINR: getInitialAdjustedPrice(500, 'sightseeing'),
        },
        {
          id: `dy${i+1}b`, time: "1:30 PM",
          title: isBudgetUser ? "Local Eatery Selection" : restaurants[i % restaurants.length].name,
          description: isBudgetUser ? "Quick and delicious local lunch." : restaurants[i % restaurants.length].description,
          type: "dining",
          location: { lat: sortedLandmarks[landmarkIdx].coords.lat + 0.002, lng: sortedLandmarks[landmarkIdx].coords.lng + 0.002 },
          priceINR: getInitialAdjustedPrice(800, 'dining'),
        },
        {
          id: `dy${i+1}c`, time: "4:00 PM",
          title: vibeParam === 'adventure' ? "Off-road Exploration" : "Cultural Workshop",
          description: isLuxuryUser ? "Private guided experience with local experts." : "Engage with the local culture and history.",
          type: vibeParam === 'adventure' ? "activity" : "sightseeing",
          location: { lat: sortedLandmarks[landmarkIdx].coords.lat - 0.005, lng: sortedLandmarks[landmarkIdx].coords.lng + 0.012 },
          priceINR: getInitialAdjustedPrice(1500, 'activity'),
        }
      ]
    });
  }

  // Last Day: Departure
  const lastDayIdx = suggestedDuration - 1;
  days.push({
    id: `dyn-day-${suggestedDuration}`,
    dayNumber: suggestedDuration,
    date: dates[lastDayIdx],
    title: "Final Moments",
    description: "Collecting souvenirs and memories before the journey home.",
    location: originCoords,
    headerImage: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=1200",
    forecast: { temp: 25, condition: 'Mist' },
    activities: [
      {
        id: `dy${suggestedDuration}a`, time: "9:00 AM",
        title: isLuxuryUser ? "Champagne Brunch" : "Traditional Breakfast",
        description: "Enjoy your final morning at a leisurely pace.",
        type: "dining",
        location: { lat: destCoords.lat + 0.001, lng: destCoords.lng - 0.001 },
        priceINR: getInitialAdjustedPrice(600, 'dining'),
      },
      {
        id: `dy${suggestedDuration}b`, time: "3:00 PM",
        title: isBudgetUser ? `Return Bus to ${origin}` : `Departure for ${origin}`,
        description: `Leaving ${destination} after an unforgettable ${suggestedDuration}-day trip.`,
        type: "transit",
        location: originCoords,
        priceINR: getInitialAdjustedPrice(7500, 'transit'),
      }
    ]
  });

  // --- Final Pass: Global Scaling to strictly fit budget ---
  let currentTotal = 0;
  days.forEach(day => day.activities.forEach(act => currentTotal += (act.priceINR || 0)));

  if (currentTotal > maxBudget) {
    const scaleFactor = (maxBudget * 0.96) / currentTotal; // Slightly tighter buffer
    days.forEach(day => {
      day.activities.forEach(act => {
        if (act.priceINR) {
          act.priceINR = Math.max(
            act.type === 'dining' ? 150 : (act.type === 'accommodation' ? 500 : 50),
            Math.floor(act.priceINR * scaleFactor)
          );
        }
      });
    });
  }

  // Refresh total after scaling
  let finalTotalPrice = 0;
  days.forEach(day => day.activities.forEach(act => finalTotalPrice += (act.priceINR || 0)));

  return {
    id: `dynamic-${formattedFrom}-${formattedTo}-${vibeParam}-${maxBudget}`,
    from: origin,
    to: destination,
    title: `${origin} to ${destination} ${themeTitle}`,
    duration: days.length,
    days: days,
    totalPriceINR: finalTotalPrice,
    localDelicacies: destInfo?.localDelicacies || [],
    photoGallery: destInfo?.photoGallery || [],
  };
};
