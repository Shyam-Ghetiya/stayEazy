// Script to generate and import 100 dummy hotels into MongoDB
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const MONGODB_URI = 'mongodb://localhost:27017/stayeazy';

const hotelSchema = new mongoose.Schema({
  hotelName: String,
  city: String,
  country: String,
  address: String,
  description: String,
  roomCount: Number,
  facilities: [String],
  pricePerNight: Number,
  ratings: [],
  images: [String],
  bookings: [],
  contactNo: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
});

const Hotel = mongoose.model('Hotel', hotelSchema, 'hoteldetails');

const cities = [
  { name: 'Mumbai', state: 'Maharashtra' },
  { name: 'Delhi', state: 'Delhi' },
  { name: 'Bangalore', state: 'Karnataka' },
  { name: 'Hyderabad', state: 'Telangana' },
  { name: 'Chennai', state: 'Tamil Nadu' },
  { name: 'Kolkata', state: 'West Bengal' },
  { name: 'Pune', state: 'Maharashtra' },
  { name: 'Ahmedabad', state: 'Gujarat' },
  { name: 'Jaipur', state: 'Rajasthan' },
  { name: 'Goa', state: 'Goa' },
  { name: 'Udaipur', state: 'Rajasthan' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Varanasi', state: 'Uttar Pradesh' },
  { name: 'Kochi', state: 'Kerala' },
  { name: 'Mysore', state: 'Karnataka' },
  { name: 'Shimla', state: 'Himachal Pradesh' },
  { name: 'Manali', state: 'Himachal Pradesh' },
  { name: 'Darjeeling', state: 'West Bengal' },
  { name: 'Ooty', state: 'Tamil Nadu' },
  { name: 'Rishikesh', state: 'Uttarakhand' }
];

const hotelPrefixes = ['Grand', 'Royal', 'Imperial', 'Luxury', 'Premium', 'Elite', 'Paradise', 'Golden', 'Silver', 'Crown', 'Palace', 'Heritage', 'Majestic', 'Regal', 'Supreme'];
const hotelSuffixes = ['Hotel', 'Resort', 'Inn', 'Suites', 'Palace', 'Residency', 'Plaza', 'Heights', 'Towers', 'Grand'];

const descriptions = [
  'Experience luxury and comfort in the heart of the city. Our hotel offers world-class amenities and exceptional service.',
  'A perfect blend of modern luxury and traditional hospitality. Enjoy stunning views and premium facilities.',
  'Discover elegance and sophistication at our premium property. Ideal for both business and leisure travelers.',
  'Your home away from home with spacious rooms, excellent dining, and warm hospitality.',
  'Nestled in a prime location, offering easy access to major attractions and business districts.',
  'Indulge in luxury with our state-of-the-art facilities, rooftop pool, and fine dining restaurants.',
  'Experience unparalleled comfort with our elegantly designed rooms and personalized service.',
  'A boutique hotel offering intimate luxury and attention to detail in every aspect.',
  'Modern amenities meet traditional charm in this beautifully appointed property.',
  'Enjoy breathtaking views, exceptional cuisine, and world-class hospitality.'
];

const facilities = ['Free Wifi', 'Swimming Pool', 'Gym', 'Spa', 'Restaurant', 'Bar', 'Room Service', 'Parking', 'AC', 'Elevator', 'CCTV', 'Power backup', 'Laundry', 'Conference Room', 'Airport Shuttle'];

const sampleImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'
];

function generateHotels() {
  const hotels = [];
  const hashedPassword = bcrypt.hashSync('hotel123', 10);
  
  for (let i = 0; i < 100; i++) {
    const city = cities[i % cities.length];
    const prefix = hotelPrefixes[Math.floor(Math.random() * hotelPrefixes.length)];
    const suffix = hotelSuffixes[Math.floor(Math.random() * hotelSuffixes.length)];
    const hotelName = `${prefix} ${city.name} ${suffix}`;
    
    const numFacilities = 6 + Math.floor(Math.random() * 6);
    const selectedFacilities = [...facilities].sort(() => 0.5 - Math.random()).slice(0, numFacilities);
    
    const price = 1000 + Math.floor(Math.random() * 9000);
    const rooms = 10 + Math.floor(Math.random() * 90);
    
    const hotel = {
      hotelName,
      city: city.name.toLowerCase(),
      country: 'india',
      address: `${Math.floor(Math.random() * 500) + 1}, ${city.state}, India`,
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      roomCount: rooms,
      facilities: selectedFacilities,
      pricePerNight: price,
      ratings: [],
      images: [sampleImages[Math.floor(Math.random() * sampleImages.length)]],
      bookings: [],
      contactNo: `${9000000000 + Math.floor(Math.random() * 999999999)}`,
      email: `${hotelName.toLowerCase().replace(/\s+/g, '')}@stayeazy.com`,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    hotels.push(hotel);
  }
  
  return hotels;
}

async function importHotels() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const hotels = generateHotels();
    
    await Hotel.insertMany(hotels);
    console.log(`✅ Successfully imported ${hotels.length} hotels!`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error importing hotels:', error);
    process.exit(1);
  }
}

importHotels();
