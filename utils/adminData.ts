
import { Profile } from "./mockData";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: 'user';
  status: 'active' | 'suspended' | 'pending' | 'blocked' | 'rejected';
  plan: 'free' | 'gold' | 'diamond' | 'platinum';
  joinedDate: string;
  lastActive: string;
  verified: boolean;
  reports: number;
  safetyScore: number;
  religion: string;
  caste: string;
  age: number;
  gender: string;
  location: string;
  avatar: string;
  profileScore: number;
  // Detailed Data
  about?: string;
  familyType?: string;
  education?: string;
  occupation?: string;
  income?: string;
}

export type AdminRole = 'Super Admin' | 'Admin' | 'Moderator' | 'Support' | 'Finance' | 'Astrologer';

export interface SystemAdmin {
    id: string;
    name: string;
    email: string;
    role: AdminRole;
    status: 'Active' | 'Suspended' | 'Blocked';
    lastLogin: string;
    actionsCount: number;
    avatar: string;
    permissions: string[];
    password?: string; // For mock login
}

// --- ROLE BASED ACCESS CONTROL CONFIG ---
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Super Admin': ['*'], 
  'Admin': ['user-database', 'interests', 'reports', 'support', 'app-management', 'settings', 'chatbot'], // Removed: new-accounts, verification, payments
  'Moderator': ['app-management', 'reports', 'chatbot'], 
  'Support': ['support', 'user-database', 'interests', 'approvals-log', 'chatbot'], // Removed: new-accounts, verification
  'Finance': ['payments'],
  'Astrologer': ['astrology-dashboard', 'horoscope-analysis'] 
};

export const MOCK_SYSTEM_ADMINS: SystemAdmin[] = [
    { 
      id: 'ADM-001', 
      name: 'Manoj Admin', 
      email: 'admin@divine.com', 
      role: 'Admin', 
      status: 'Active', 
      lastLogin: 'Just now', 
      actionsCount: 124, 
      avatar: 'https://ui-avatars.com/api/?name=Manoj+Admin&background=random', 
      permissions: ['all'],
      password: 'password123'
    },
    { 
      id: 'ADM-002', 
      name: 'Sarah Support', 
      email: 'support@divine.com', 
      role: 'Support', 
      status: 'Active', 
      lastLogin: '2h ago', 
      actionsCount: 45, 
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Support&background=random', 
      permissions: ['tickets', 'users'],
      password: 'password123'
    },
    { 
      id: 'ADM-003', 
      name: 'Mike Moderator', 
      email: 'mod@divine.com', 
      role: 'Moderator', 
      status: 'Active', 
      lastLogin: '3d ago', 
      actionsCount: 12, 
      avatar: 'https://ui-avatars.com/api/?name=Mike+Moderator&background=random', 
      permissions: ['moderation', 'cms'],
      password: 'password123'
    },
    { 
      id: 'ADM-004', 
      name: 'Fiona Finance', 
      email: 'finance@divine.com', 
      role: 'Finance', 
      status: 'Active', 
      lastLogin: '1d ago', 
      actionsCount: 8, 
      avatar: 'https://ui-avatars.com/api/?name=Fiona+Finance&background=random', 
      permissions: ['payments'],
      password: 'password123'
    },
    { 
      id: 'ADM-005', 
      name: 'Dr. Guruji', 
      email: 'astro@divine.com', 
      role: 'Astrologer', 
      status: 'Active', 
      lastLogin: '12h ago', 
      actionsCount: 56, 
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop', 
      permissions: ['astrology-dashboard'],
      password: 'password123'
    },
];

export interface GlobalAuditLog {
    id: string;
    actorId: string;
    actorName: string;
    actorRole: string;
    action: string;
    target: string;
    module: string;
    timestamp: string;
    severity: 'low' | 'medium' | 'critical';
    ip: string;
}

export interface SecurityEvent {
    id: string;
    type: 'Login Success' | 'Login Failed' | 'Password Change' | 'Suspicious Activity';
    user: string;
    ip: string;
    location: string;
    timestamp: string;
    status: 'Safe' | 'Warning' | 'Critical';
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  amount: string;
  plan: 'Gold' | 'Diamond' | 'Platinum' | 'Free';
  status: 'success' | 'failed' | 'refunded' | 'pending';
  date: string;
  expiryDate: string;
  method: 'UPI' | 'Card' | 'NetBanking' | 'PayPal';
  invoiceUrl?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userRole: 'User';
  docType: 'Aadhaar' | 'Passport' | 'PAN';
  docNumber: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  riskScore: number; // 0-100 (High is bad)
  avatar: string;
  images: {
    front: string;
    back?: string;
    selfie: string;
  };
  videoUrl?: string; 
  horoscopeUrl?: string; 
  aiAnalysis: {
    faceMatchScore: number; // 0-100
    detailsMatch: boolean;
    tamperDetected: boolean;
    ocrName: string;
  };
  rejectionReason?: string;
  adminActionBy?: string; 
  adminActionTime?: string; 
}

export interface ReportTicket {
  id: string;
  reporter: string;
  reporterId?: string; 
  reportedUser: string;
  reportedUserId: string;
  reportedUserAvatar: string;
  reason: string;
  category: 'Harassment' | 'Fake Profile' | 'Spam' | 'Inappropriate Content' | 'Scam';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  timestamp: string;
  aiFlag: boolean; 
  aiRiskScore: number;
  evidence?: {
    chatLogs?: { sender: string, text: string, time: string }[];
    screenshot?: string;
  };
}

export interface CommunicationLog {
  id: string;
  type: 'chat' | 'audio_call' | 'video_call' | 'interest';
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'flagged' | 'blocked';
  riskScore: number; // 0-100
  metadata: {
    duration?: string; // For calls
    contentSnippet?: string; // For chats (Hidden by default)
    fullContent?: string; // Revealed on click
    attachmentType?: 'image' | 'voice' | 'none';
  };
}

export interface SystemLog {
  id: string;
  action: string;
  admin: string;
  ip: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  ip: string;
}

// --- NEW HOROSCOPE DATA ---
export interface HoroscopeSubmission {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  raasi: string;
  nakshatra: string;
  lagnam: string;
  dosham: string;
  fileUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  aiMatchScore: number; // How well the PDF data matches user profile inputs
  compatibilityCount: number; // Potential matches in DB
}

// --- ASTROLOGY MATCH REQUEST DATA ---
export interface AstroMatchRequest {
  id: string;
  groomName: string;
  groomId: string;
  brideName: string;
  brideId: string;
  status: 'Pending' | 'Completed' | 'In Progress';
  priority: 'High' | 'Medium' | 'Low';
  requestedBy: string; // e.g., 'Premium User', 'Parent'
  groomDetails: { star?: string; raasi?: string; dob?: string; time?: string; place?: string; padam?: number };
  brideDetails: { star?: string; raasi?: string; dob?: string; time?: string; place?: string; padam?: number };
  // Add Report Field for completion
  report?: {
      verdict: string;
      remarks: string;
      score: number;
      timestamp: string;
      adminName: string;
  }
}

export const MOCK_ASTRO_REQUESTS: AstroMatchRequest[] = [
  {
    id: 'AST-1001',
    groomName: 'Karthik R',
    groomId: 'USR-1002',
    brideName: 'Lakshmi P',
    brideId: 'USR-8821',
    status: 'Pending',
    priority: 'High',
    requestedBy: 'Platinum User',
    groomDetails: { star: 'Rohini', raasi: 'Rishaba', padam: 2 },
    brideDetails: { star: 'Hastham', raasi: 'Kanni', padam: 4 }
  },
  {
    id: 'AST-1002',
    groomName: 'Vikram S',
    groomId: 'USR-1005',
    brideName: 'Ananya M',
    brideId: 'USR-9921',
    status: 'In Progress',
    priority: 'Medium',
    requestedBy: 'Parent',
    groomDetails: { star: 'Aswini', raasi: 'Mesha', padam: 1 },
    brideDetails: { star: 'Revathi', raasi: 'Meena', padam: 3 }
  }
];

// --- NEW COMMUNITY DATA ---
export interface CommunityStructure {
  id: string;
  name: string;
  theme: 'orange' | 'green' | 'blue' | 'purple'; // For visual preview
  castes: {
    id: string;
    name: string;
    subCastes: string[];
    profileCount: number;
  }[];
}

// --- NEW EVENTS DATA ---
export interface AdminEvent {
  id: string;
  title: string;
  type: 'Virtual' | 'In-Person' | 'Webinar';
  date: string;
  location: string;
  attendees: number;
  status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled';
  image: string;
}

// --- NEW SUPPORT TICKET DATA ---
export interface SupportTicket {
  id: string;
  user: string;
  userId: string;
  subject: string;
  category: 'Billing' | 'Technical' | 'Account' | 'Report';
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved';
  lastUpdated: string;
  messages: { 
      sender: 'user' | 'agent' | 'system'; 
      text: string; 
      time: string;
      image?: string;
  }[];
}

// --- NEW MODERATION DATA ---
export interface ModerationItem {
  id: string;
  userId: string;
  userName: string;
  type: 'Photo' | 'Bio' | 'Video';
  content: string; // URL or Text
  aiScore: number; // 0 (Safe) to 100 (Unsafe)
  flags: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

// --- NEW ANNOUNCEMENT DATA ---
export interface Announcement {
  id: string;
  title: string;
  message: string;
  target: 'All' | 'Premium' | 'Free';
  scheduledFor: string;
  status: 'Draft' | 'Scheduled' | 'Sent';
}

// --- NEW CMS CONTENT ---
export interface CMSContent {
  id: string;
  section: string;
  key: string;
  value: string;
  type: 'text' | 'image' | 'link';
  lastUpdated: string;
}

export const ADMIN_STATS = {
  totalUsers: 15420,
  activeUsers: 8932,
  premiumUsers: 3210,
  revenue: '₹45.2L',
  growth: '+12.5%',
  pendingVerifications: 45,
  reportedProfiles: 12,
  aiMatchesToday: 1450,
  serverHealth: '99.9%'
};

export const COMMUNICATION_STATS = {
  totalMessages: 14502,
  activeCalls: 24,
  flaggedInteractions: 18,
  avgResponseTime: '2m 14s'
};

export const SAFETY_ANALYTICS = {
  reportsByType: [
    { type: 'Fake Profile', count: 45 },
    { type: 'Harassment', count: 32 },
    { type: 'Spam/Scam', count: 28 },
    { type: 'Inappropriate', count: 15 },
  ],
  resolutionStatus: [
    { status: 'Resolved', count: 120 },
    { status: 'Dismissed', count: 45 },
    { status: 'Pending', count: 12 },
  ]
};

export const MOCK_COMMUNICATION_LOGS: CommunicationLog[] = [
  {
    id: 'C-9001',
    type: 'chat',
    senderId: 'USR-1002', senderName: 'Rahul V',
    receiverId: 'USR-8821', receiverName: 'Priya S',
    timestamp: 'Just now',
    status: 'flagged',
    riskScore: 88,
    metadata: {
      contentSnippet: 'Sent a message containing restricted keywords.',
      fullContent: 'Hey, send me money on GPay 9876543210 immediately.',
      attachmentType: 'none'
    }
  },
  {
    id: 'C-9002',
    type: 'video_call',
    senderId: 'USR-3321', senderName: 'Karthik',
    receiverId: 'USR-4422', receiverName: 'Sneha',
    timestamp: '2 mins ago',
    status: 'completed',
    riskScore: 10,
    metadata: {
      duration: '45 mins',
      attachmentType: 'none'
    }
  }
];

export const MOCK_ADMIN_USERS: AdminUser[] = Array.from({ length: 25 }).map((_, i) => ({
  id: `USR-${1000 + i}`,
  name: `User ${i}`,
  email: `user${i}@divine.com`,
  mobile: `+91 98765 432${i.toString().padStart(2, '0')}`,
  role: 'user',
  status: 'active',
  plan: 'gold',
  joinedDate: '2023-10-15',
  lastActive: '2 hours ago',
  verified: true,
  reports: 0,
  safetyScore: 90,
  religion: 'Hindu',
  caste: 'Iyer',
  age: 25 + i,
  gender: 'Male',
  location: 'Chennai',
  avatar: `https://ui-avatars.com/api/?name=User+${i}&background=random`,
  profileScore: 85
}));

export const MOCK_GLOBAL_AUDIT_LOGS: GlobalAuditLog[] = [
    { id: 'GAL-992', actorId: 'ADM-001', actorName: 'Rajesh Kumar', actorRole: 'Admin', action: 'Approved User', target: 'USR-1022', module: 'User Mgmt', timestamp: '10 mins ago', severity: 'medium', ip: '192.168.1.1' },
    { id: 'GAL-991', actorId: 'ADM-002', actorName: 'Sarah Lee', actorRole: 'Support', action: 'Refunded Transaction', target: 'TXN-8821', module: 'Billing', timestamp: '1 hour ago', severity: 'critical', ip: '192.168.1.4' },
    { id: 'GAL-990', actorId: 'ADM-001', actorName: 'Rajesh Kumar', actorRole: 'Admin', action: 'Updated CMS Banner', target: 'Home Page', module: 'CMS', timestamp: '3 hours ago', severity: 'low', ip: '192.168.1.1' },
];

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
    { id: 'SEC-101', type: 'Login Success', user: 'Rajesh Kumar (Admin)', ip: '192.168.1.1', location: 'Chennai, IN', timestamp: 'Just now', status: 'Safe' },
    { id: 'SEC-102', type: 'Login Failed', user: 'Vikram Singh (Admin)', ip: '45.22.12.11', location: 'Moscow, RU', timestamp: '2h ago', status: 'Critical' },
    { id: 'SEC-103', type: 'Suspicious Activity', user: 'Sarah Lee (Admin)', ip: '192.168.1.4', location: 'Bangalore, IN', timestamp: '5h ago', status: 'Warning' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'TXN-1001',
        userId: 'USR-1002',
        userName: 'Rahul V',
        userAvatar: 'https://ui-avatars.com/api/?name=Rahul+V&background=random',
        amount: '₹3,999',
        plan: 'Gold',
        status: 'success',
        date: '2023-10-25',
        expiryDate: '2024-01-25',
        method: 'UPI'
    },
    {
        id: 'TXN-1002',
        userId: 'USR-8821',
        userName: 'Priya S',
        userAvatar: 'https://ui-avatars.com/api/?name=Priya+S&background=random',
        amount: '₹6,999',
        plan: 'Diamond',
        status: 'success',
        date: '2023-11-10',
        expiryDate: '2024-05-10',
        method: 'Card'
    },
    {
        id: 'TXN-1003',
        userId: 'USR-9922',
        userName: 'Amit K',
        userAvatar: 'https://ui-avatars.com/api/?name=Amit+K&background=random',
        amount: '₹10,999',
        plan: 'Platinum',
        status: 'failed',
        date: '2023-12-01',
        expiryDate: '-',
        method: 'NetBanking'
    }
];

export const MOCK_VERIFICATIONS: VerificationRequest[] = []; 
export const MOCK_VERIFICATION_HISTORY: VerificationRequest[] = []; 

export const MOCK_REPORTS: ReportTicket[] = [
  {
    id: 'RPT-1001',
    reporter: 'Priya S',
    reporterId: 'USR-8821',
    reportedUser: 'Rahul V',
    reportedUserId: 'USR-1002',
    reportedUserAvatar: 'https://ui-avatars.com/api/?name=Rahul+V&background=random',
    reason: 'Inappropriate messages in chat.',
    category: 'Harassment',
    severity: 'high',
    status: 'open',
    timestamp: '2 hours ago',
    aiFlag: true,
    aiRiskScore: 85,
    evidence: {
      chatLogs: [
        { sender: 'Rahul V', text: 'Can we meet at my place?', time: '10:30 AM' },
        { sender: 'Priya S', text: 'I am not comfortable with that.', time: '10:31 AM' },
        { sender: 'Rahul V', text: 'Don\'t be shy.', time: '10:32 AM' }
      ]
    }
  },
  {
    id: 'RPT-1002',
    reporter: 'System AI',
    reporterId: 'SYS-BOT',
    reportedUser: 'Amit K',
    reportedUserId: 'USR-9922',
    reportedUserAvatar: 'https://ui-avatars.com/api/?name=Amit+K&background=random',
    reason: 'Detected multiple soliciting links in bio.',
    category: 'Spam',
    severity: 'medium',
    status: 'open',
    timestamp: '5 hours ago',
    aiFlag: true,
    aiRiskScore: 92
  },
  {
    id: 'RPT-1003',
    reporter: 'Suresh K',
    reporterId: 'USR-7711',
    reportedUser: 'Unknown User',
    reportedUserId: 'USR-0000',
    reportedUserAvatar: 'https://ui-avatars.com/api/?name=Unknown&background=random',
    reason: 'Profile photo looks fake.',
    category: 'Fake Profile',
    severity: 'low',
    status: 'investigating',
    timestamp: '1 day ago',
    aiFlag: false,
    aiRiskScore: 45
  },
   {
    id: 'RPT-1004',
    reporter: 'Ananya M',
    reporterId: 'USR-9921',
    reportedUser: 'Vikram S',
    reportedUserId: 'USR-1005',
    reportedUserAvatar: 'https://ui-avatars.com/api/?name=Vikram+S&background=random',
    reason: 'Asked for money immediately.',
    category: 'Scam',
    severity: 'critical',
    status: 'resolved',
    timestamp: '2 days ago',
    aiFlag: true,
    aiRiskScore: 98
  }
];

export const MOCK_LOGS: SystemLog[] = []; 
export const MOCK_USER_AUDIT_LOGS: AuditLog[] = []; 
export const REVENUE_DATA = [{ month: 'Jan', revenue: 100 }]; 
export const MOCK_HOROSCOPE_SUBMISSIONS: HoroscopeSubmission[] = [
    {
        id: 'HOR-001',
        userId: 'USR-1002',
        userName: 'Rahul V',
        userAvatar: 'https://ui-avatars.com/api/?name=Rahul+V&background=random',
        raasi: 'Mesha',
        nakshatra: 'Aswini',
        lagnam: 'Simha',
        dosham: 'None',
        fileUrl: 'horoscope.pdf',
        submittedAt: '2 days ago',
        status: 'pending',
        aiMatchScore: 90,
        compatibilityCount: 15
    }
]; 
export const MOCK_COMMUNITY_STRUCTURE: CommunityStructure[] = [
    {
        id: 'hindu',
        name: 'Hindu',
        theme: 'orange',
        castes: [
            { id: 'iyer', name: 'Iyer', subCastes: ['Vadakalai', 'Thenkalai'], profileCount: 1200 },
            { id: 'iyengar', name: 'Iyengar', subCastes: ['Vadakalai', 'Thenkalai'], profileCount: 1100 },
            { id: 'mudaliar', name: 'Mudaliar', subCastes: [], profileCount: 2500 }
        ]
    },
    {
        id: 'muslim',
        name: 'Muslim',
        theme: 'green',
        castes: [
            { id: 'sunni', name: 'Sunni', subCastes: [], profileCount: 1500 },
            { id: 'shia', name: 'Shia', subCastes: [], profileCount: 800 }
        ]
    },
    {
        id: 'christian',
        name: 'Christian',
        theme: 'blue',
        castes: [
            { id: 'rc', name: 'Roman Catholic', subCastes: [], profileCount: 1800 },
            { id: 'csi', name: 'CSI', subCastes: [], profileCount: 1200 }
        ]
    }
];

// --- MOCK DATA FOR NEW MODULES ---

export const MOCK_EVENTS: AdminEvent[] = [
  { id: 'EVT-001', title: 'Elite Matrimony Meetup', type: 'In-Person', date: '2024-12-15', location: 'Taj Coromandel, Chennai', attendees: 45, status: 'Upcoming', image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop' },
  { id: 'EVT-002', title: 'NRI Virtual Connect', type: 'Virtual', date: '2024-11-20', location: 'Zoom', attendees: 120, status: 'Completed', image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2070&auto=format&fit=crop' },
  { id: 'EVT-003', title: 'Iyer Community Gathering', type: 'In-Person', date: '2025-01-10', location: 'Music Academy, Chennai', attendees: 200, status: 'Upcoming', image: 'https://images.unsplash.com/photo-1561582238-1639f7a77e5d?q=80&w=2070&auto=format&fit=crop' },
];

export const MOCK_TICKETS: SupportTicket[] = [
  { 
    id: 'TKT-1029', user: 'Priya S', userId: 'USR-8821', subject: 'Payment failed for Gold Plan', category: 'Billing', priority: 'High', status: 'Open', lastUpdated: '10m ago',
    messages: [
      { sender: 'user', text: 'I tried to upgrade to Gold but the payment failed and money was deducted.', time: '10:00 AM' }
    ]
  },
  { 
    id: 'TKT-1030', user: 'Rahul V', userId: 'USR-1002', subject: 'How to hide phone number?', category: 'Account', priority: 'Low', status: 'In Progress', lastUpdated: '1h ago',
    messages: [
      { sender: 'user', text: 'I want to hide my number from free users.', time: '9:00 AM' },
      { sender: 'agent', text: 'You can do this from Settings > Privacy.', time: '9:15 AM' }
    ]
  },
];

export const MOCK_MODERATION: ModerationItem[] = [
  { id: 'MOD-001', userId: 'USR-5512', userName: 'Arun K', type: 'Bio', content: 'Call me at 9876543210 for quick marriage. No time pass.', aiScore: 85, flags: ['Phone Number Detected', 'Solicitation'], status: 'Pending', timestamp: '5m ago' },
  { id: 'MOD-002', userId: 'USR-3321', userName: 'Divya M', type: 'Photo', content: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1888&auto=format&fit=crop', aiScore: 10, flags: [], status: 'Pending', timestamp: '15m ago' },
  { id: 'MOD-003', userId: 'USR-9988', userName: 'Bad User', type: 'Bio', content: 'I hate this app. Everyone is fake.', aiScore: 92, flags: ['Toxic Language', 'Negative Sentiment'], status: 'Pending', timestamp: '1h ago' },
];

export const MOCK_CMS: CMSContent[] = [
  { id: 'CMS-001', section: 'Home', key: 'Hero Title', value: 'Divine Connections Start Here', type: 'text', lastUpdated: '2 days ago' },
  { id: 'CMS-002', section: 'Banners', key: 'Promo Banner 1', value: 'https://example.com/banner1.jpg', type: 'image', lastUpdated: '1 week ago' },
  { id: 'CMS-003', section: 'SEO', key: 'Meta Description', value: 'Best Tamil Matrimony Site', type: 'text', lastUpdated: '1 month ago' },
];
