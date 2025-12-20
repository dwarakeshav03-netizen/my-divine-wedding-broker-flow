
export interface Profile {
  id: string;
  name: string;
  age: number;
  height: string; // e.g., "5'5""
  heightCm: number;
  img: string;
  matchScore: number; // Legacy field, will be overwritten by algo
  location: string;
  education: string;
  occupation: string;
  income: string;
  religion: string;
  caste: string;
  subCaste?: string;
  gothram: string;
  raasi: string;
  nakshatra: string;
  maritalStatus: string;
  motherTongue: string;
  diet: string;
  smoking: string;
  drinking: string;
  about: string;
  hobbies: string[];
  familyType: string;
  fatherJob: string;
  images: string[];
  isPremium: boolean;
  isVerified: boolean;
  isApproved?: boolean; // New: For viewing permissions
  lastActive: string;
  isNew?: boolean; // For 'New Matches'
  plan?: string;

  // --- NEW FIELDS (Requirement A & G) ---
  timeOfBirth?: string;
  placeOfBirth?: string;
  dateOfBirth?: string; // Explicit DOB
  poorviham?: string; // Native Place
  disabilities?: string; // Yes/No
  lateMarriage?: string; // Yes/No
  reMarriage?: string; // Yes/No
  fatherName?: string;
  motherName?: string;
  mobileNumber?: string;
  emailId?: string;
  star?: string; // Explicit Star field
  lagnam?: string;
  kulaDeivam?: string;
  
  // Extended Address
  address?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // Detailed Employment
  employmentStatus?: 'Employed' | 'Unemployed';
  employmentCategory?: 'Private' | 'Government' | 'Business';
  // Private/Govt Specifics
  designation?: string;
  companyName?: string;
  department?: string; // Govt
  govtType?: 'State' | 'Central'; // Govt
  monthlySalary?: string;
  annualSalary?: string;
  officialAddress?: string;
  // Business Specifics
  companyScale?: 'Small' | 'Medium' | 'Large' | 'Multinational';
  businessType?: 'Sole Proprietorship' | 'Partnership';

  // Extended Family
  fatherOccupation?: string;
  motherOccupation?: string;
  siblingsCount?: string;
  siblingsDetails?: { name: string; gender: string; occupation: string; maritalStatus: string }[];
  
  // Lifestyle
  wakeUpTime?: string;
  sleepTime?: string;
  skills?: string;
  extraCurricular?: string;

  // Uploads
  horoscopeFile?: string;
  bioDataFile?: string;
  bioDataText?: string;
  familyPhoto?: string;
}

export interface ActivityLog {
  id: string;
  type: 'connect' | 'interest' | 'shortlist' | 'view' | 'message' | 'search' | 'system' | 'parent_action';
  description: string;
  timestamp: string;
  profileImage?: string;
  profileName?: string;
  actor?: string;
}

export interface Visitor {
  id: string;
  profile: Profile;
  visitTime: string;
  visitCount: number;
}

// SPECIFIC NAMES PROVIDED
const SPECIFIC_GROOMS = [
  "Subash", "Thanush", "Kotai", "Ramesh", "Vijay", "Sribala", "Mukesh", "Umasankar", "Yugaraj", 
  "Kasi", "Raj", "Manoj", "Rajan", "Dhamu", "Inayathulla", "Kottai Bhasha", "Inaya", "Abdul", 
  "Younus", "Syed", "Sajid", "Umapathy", "Dhili", "Javeesh", "Lakshmipathy", "Karthi", 
  "Thyag", "Rajaram", "Gajendran"
];

const SPECIFIC_BRIDES = [
  "Divya", "Karthika", "Gowri", "Dhanya", "Leelavathi", "Gayathri", "Vijayalaskhmi", "Akila", 
  "Swathi", "Sutha", "Jaya", "Sujatha", "Jeethu", "Nandhashree", "Kalaselvi", "Anitha", 
  "Madhumitha", "Durg", "Sathya"
];

// Combine for generic usage if needed, but we typically filter by gender
const ALL_NAMES = [...SPECIFIC_GROOMS, ...SPECIFIC_BRIDES];

const SAMPLE_JOBS = ["Software Engineer", "Doctor", "Architect", "Bank Manager", "Professor", "Data Scientist", "Entrepreneur", "Civil Servant", "Artist", "Chartered Accountant"];
const SAMPLE_LOCATIONS = ["Chennai, TN", "Bangalore, KA", "Coimbatore, TN", "Madurai, TN", "Mumbai, MH", "Hyderabad, TS", "Trichy, TN", "Salem, TN", "Delhi, NCR", "Pune, MH"];
const SAMPLE_EDUCATION = ["B.Tech", "M.Tech", "MBBS, MD", "B.Com, MBA", "Ph.D", "B.Arch", "M.Sc", "B.A, M.A"];

// Consistent Images for Demo
const MALE_IMAGES = [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?q=80&w=2070&auto=format&fit=crop"
];

const FEMALE_IMAGES = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1887&auto=format&fit=crop"
];

// Constants for Random Generation
const GOTHRAMS = ["Bharadwaja", "Kashyapa", "Vasishta", "Vishvamitra", "Sandilya", "Koundinya", "Harita", "Srivatsa"];
const RAASIS = ["Mesha", "Rishaba", "Mithuna", "Kataka", "Simha", "Kanya", "Thulam", "Viruchigam", "Dhanusu", "Magaram", "Kumbam", "Meenam"];
const NAKSHATRAS = ["Aswini", "Bharani", "Karthigai", "Rohini", "Mirugaseersham", "Thiruvathirai", "Punarpoosam", "Poosam", "Aayilyam", "Magam", "Pooram", "Uthiram"];
const DIETS = ["Veg", "Non-Veg", "Eggetarian", "Vegan"];

export const generateMockProfiles = (count: number): Profile[] => {
  // Always prioritize the specific list
  // If count exceeds list size, we just loop over it (for infinite scroll simulation)
  
  return Array.from({ length: count }).map((_, i) => {
    // Pick name from full list cyclically
    const nameIndex = i % ALL_NAMES.length;
    const name = ALL_NAMES[nameIndex];
    
    // Determine gender based on which list the name is in
    const isGroom = SPECIFIC_GROOMS.includes(name);
    const gender = isGroom ? 'male' : 'female';
    
    // Determine religion based on name heuristic for realism
    const isMuslim = ['Inayathulla', 'Kottai Bhasha', 'Inaya', 'Abdul', 'Younus', 'Syed', 'Sajid'].some(n => name.includes(n));
    const isChristian = ['Javeesh', 'Jeethu'].some(n => name.includes(n));
    const religion = isMuslim ? 'Muslim' : isChristian ? 'Christian' : 'Hindu';
    
    // Determine caste
    const casteList = isMuslim ? ['Sunni', 'Shia'] : isChristian ? ['RC', 'CSI'] : ["Iyer", "Iyengar", "Mudaliar", "Vanniyar", "Nadar", "Chettiar", "Gounder", "Pillai"];
    const caste = casteList[i % casteList.length];

    const isPremium = Math.random() > 0.7;
    const heightCm = gender === 'male' ? 170 + Math.floor(Math.random() * 15) : 150 + Math.floor(Math.random() * 20);
    const heightFt = Math.floor(heightCm / 30.48);
    const heightIn = Math.round((heightCm % 30.48) / 2.54);
    
    // Select image based on gender
    const imagePool = isGroom ? MALE_IMAGES : FEMALE_IMAGES;
    const img = imagePool[i % imagePool.length];

    return {
      id: `MDM-${1000 + i}`,
      name: name,
      age: gender === 'male' ? 26 + (i % 10) : 23 + (i % 8),
      height: `${heightFt}'${heightIn}"`,
      heightCm: heightCm,
      img: img,
      matchScore: 0, // Calculated dynamically later in matchingAlgo
      location: SAMPLE_LOCATIONS[i % SAMPLE_LOCATIONS.length],
      education: SAMPLE_EDUCATION[i % SAMPLE_EDUCATION.length],
      occupation: SAMPLE_JOBS[i % SAMPLE_JOBS.length],
      income: `${(Math.floor(Math.random() * 20) + 5)} Lakhs PA`,
      religion: religion,
      caste: caste,
      subCaste: "Vadakalai",
      gothram: GOTHRAMS[i % GOTHRAMS.length],
      raasi: RAASIS[i % RAASIS.length],
      nakshatra: NAKSHATRAS[i % NAKSHATRAS.length],
      maritalStatus: Math.random() > 0.9 ? "Never Married" : "Divorced",
      motherTongue: "Tamil",
      diet: DIETS[i % DIETS.length],
      smoking: "No",
      drinking: "No",
      about: `I am ${name}, looking for a compatible partner who shares my values. I enjoy music, traveling, and spending time with family.`,
      hobbies: ["Music", "Reading", "Travel", "Cooking"].sort(() => 0.5 - Math.random()).slice(0, 3),
      familyType: Math.random() > 0.5 ? "Nuclear" : "Joint",
      fatherJob: "Business",
      images: [img], 
      isPremium: isPremium,
      isVerified: true,
      isApproved: true, // Default active for mocks
      lastActive: `${Math.floor(Math.random() * 5)} hours ago`,
      isNew: Math.random() > 0.8,
      plan: isPremium ? 'Diamond' : 'Free'
    };
  });
};

export const MOCK_REQUESTS = [
  {
    id: 101,
    name: "Swathi",
    age: 24,
    profession: "Doctor",
    location: "Chennai",
    img: FEMALE_IMAGES[0],
    compatibility: 92,
    time: "2h ago"
  },
  {
    id: 102,
    name: "Nithya",
    age: 26,
    profession: "Software Engineer",
    location: "Bangalore",
    img: FEMALE_IMAGES[1],
    compatibility: 85,
    time: "5h ago"
  }
];

export const MOCK_EVENTS = [
  {
    id: 'evt-1',
    title: "Elite Professionals Meetup",
    date: "Dec 15, 2024",
    location: "Taj Coromandel, Chennai",
    attendees: "+45",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
    type: "Premium",
    status: "Upcoming"
  },
  {
    id: 'evt-2',
    title: "USA/Canada NRI Matrimony",
    date: "Jan 10, 2025",
    location: "Virtual Event (Zoom)",
    attendees: "+120",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop",
    type: "Virtual",
    status: "Upcoming"
  },
  {
    id: 'evt-3',
    title: "Iyer Community Gathering",
    date: "Jan 22, 2025",
    location: "Music Academy, Chennai",
    attendees: "+200",
    image: "https://images.unsplash.com/photo-1561582238-1639f7a77e5d?q=80&w=2070&auto=format&fit=crop",
    type: "Community",
    status: "Past"
  }
];

export const MOCK_EXISTING_USERS = [
  {
    id: 'USR-1002',
    name: 'Rahul V',
    email: 'rahul@example.com',
    mobile: '9876543210',
    role: 'user',
    status: 'active',
    plan: 'gold'
  },
  {
    id: 'USR-8821',
    name: 'Priya S',
    email: 'priya@example.com',
    mobile: '9876543211',
    role: 'user',
    status: 'active',
    plan: 'free'
  }
];

export const MOCK_CLIENTS = [
  { id: 'CL-101', name: 'Arjun Reddy', plan: 'Gold', status: 'Active', age: 28, img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1887&auto=format&fit=crop', joined: 'Oct 2023', email: 'arjun@gmail.com', phone: '9876543210' },
  { id: 'CL-102', name: 'Priya Sharma', plan: 'Diamond', status: 'Pending', age: 25, img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop', joined: 'Nov 2023', email: 'priya@gmail.com', phone: '9876543211' },
  { id: 'CL-103', name: 'Ananya R', plan: 'Platinum', status: 'Active', age: 26, img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop', joined: 'Dec 2023', email: 'ananya@gmail.com', phone: '9876543212' },
  { id: 'CL-104', name: 'Suresh K', plan: 'Free', status: 'Inactive', age: 30, img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop', joined: 'Jan 2024', email: 'suresh@gmail.com', phone: '9876543213' },
];

export const MOCK_ACTIVITIES = [
  { id: '1', type: 'match', text: 'New match for Arjun', time: '2m ago', color: 'border-pink-500' },
  { id: '2', type: 'payment', text: 'Commission received', time: '1h ago', color: 'border-emerald-500' },
  { id: '3', type: 'call', text: 'Call scheduled with Priya', time: '3h ago', color: 'border-blue-500' },
  { id: '4', type: 'alert', text: 'Verification pending for Suresh', time: '5h ago', color: 'border-amber-500' },
];
