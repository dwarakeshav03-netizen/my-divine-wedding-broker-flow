
import { Profile } from "./mockData";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
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
  'Admin': ['user-database', 'interests', 'reports', 'support', 'app-management', 'settings', 'chatbot', 'events'], 
  'Moderator': ['app-management', 'reports', 'chatbot'], 
  'Support': ['support', 'user-database', 'interests', 'approvals-log', 'chatbot'], 
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

export const MOCK_GLOBAL_AUDIT_LOGS: GlobalAuditLog[] = [
    { id: 'LOG-001', actorId: 'ADM-001', actorName: 'Manoj Admin', actorRole: 'Admin', action: 'Approved User', target: 'USR-1002', module: 'User Mgmt', timestamp: '2024-03-20 10:30:00', severity: 'low', ip: '192.168.1.1' },
    { id: 'LOG-002', actorId: 'SA-001', actorName: 'Super Admin', actorRole: 'Super Admin', action: 'System Config Change', target: 'Payment Gateway', module: 'Settings', timestamp: '2024-03-20 09:15:00', severity: 'critical', ip: '10.0.0.1' },
    { id: 'LOG-003', actorId: 'ADM-004', actorName: 'Fiona Finance', actorRole: 'Finance', action: 'Refund Processed', target: 'TXN-9920', module: 'Finance', timestamp: '2024-03-19 14:20:00', severity: 'medium', ip: '192.168.1.15' },
    { id: 'LOG-004', actorId: 'ADM-003', actorName: 'Mike Moderator', actorRole: 'Moderator', action: 'Blocked User', target: 'USR-FAKE', module: 'Reports', timestamp: '2024-03-19 11:00:00', severity: 'medium', ip: '192.168.1.12' },
];

export interface SecurityEvent {
    id: string;
    type: 'Login Success' | 'Login Failed' | 'Password Change' | 'Suspicious Activity';
    user: string;
    ip: string;
    location: string;
    timestamp: string;
    status: 'Safe' | 'Warning' | 'Critical';
}

export const MOCK_SECURITY_EVENTS: SecurityEvent[] = [
    { id: 'SEC-001', type: 'Login Failed', user: 'admin@divine.com', ip: '45.23.12.1', location: 'Moscow, RU', timestamp: '10 mins ago', status: 'Warning' },
    { id: 'SEC-002', type: 'Suspicious Activity', user: 'USR-9921', ip: '103.21.44.2', location: 'Chennai, IN', timestamp: '1 hour ago', status: 'Critical' },
    { id: 'SEC-003', type: 'Login Success', user: 'support@divine.com', ip: '192.168.1.5', location: 'Bangalore, IN', timestamp: '2 hours ago', status: 'Safe' },
];

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

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 'TXN-8821', userId: 'USR-1002', userName: 'Arjun Reddy', userAvatar: 'https://ui-avatars.com/api/?name=Arjun+Reddy', amount: '₹10,999', plan: 'Platinum', status: 'success', date: '2024-03-15', expiryDate: '2025-03-15', method: 'UPI' },
    { id: 'TXN-8822', userId: 'USR-1005', userName: 'Priya Sharma', userAvatar: 'https://ui-avatars.com/api/?name=Priya+Sharma', amount: '₹6,999', plan: 'Diamond', status: 'pending', date: '2024-03-14', expiryDate: '2024-09-14', method: 'Card' },
    { id: 'TXN-8823', userId: 'USR-8899', userName: 'Suresh K', userAvatar: 'https://ui-avatars.com/api/?name=Suresh+K', amount: '₹3,999', plan: 'Gold', status: 'failed', date: '2024-03-13', expiryDate: '-', method: 'NetBanking' },
    { id: 'TXN-8824', userId: 'USR-7766', userName: 'Meena L', userAvatar: 'https://ui-avatars.com/api/?name=Meena+L', amount: '₹10,999', plan: 'Platinum', status: 'refunded', date: '2024-03-10', expiryDate: '-', method: 'PayPal' },
];

export const REVENUE_DATA = [
    { month: 'Jan', revenue: 120 },
    { month: 'Feb', revenue: 135 },
    { month: 'Mar', revenue: 150 },
    { month: 'Apr', revenue: 142 },
    { month: 'May', revenue: 160 },
    { month: 'Jun', revenue: 180 },
];

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

export const MOCK_REPORTS: ReportTicket[] = [
    { id: 'RPT-101', reporter: 'Priya S', reportedUser: 'Rahul V', reportedUserId: 'USR-1002', reportedUserAvatar: 'https://ui-avatars.com/api/?name=Rahul+V', reason: 'Inappropriate messages sent via chat.', category: 'Harassment', severity: 'high', status: 'open', timestamp: '2 hours ago', aiFlag: true, aiRiskScore: 85 },
    { id: 'RPT-102', reporter: 'Suresh K', reportedUser: 'Anjali M', reportedUserId: 'USR-9932', reportedUserAvatar: 'https://ui-avatars.com/api/?name=Anjali+M', reason: 'Fake profile picture, reverse image search shows stock photo.', category: 'Fake Profile', severity: 'medium', status: 'investigating', timestamp: '1 day ago', aiFlag: false, aiRiskScore: 40 },
    { id: 'RPT-103', reporter: 'Admin System', reportedUser: 'Bot User 1', reportedUserId: 'USR-BOT1', reportedUserAvatar: 'https://ui-avatars.com/api/?name=Bot', reason: 'Multiple rapid requests detected.', category: 'Spam', severity: 'critical', status: 'open', timestamp: '30 mins ago', aiFlag: true, aiRiskScore: 95 },
];

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

export const MOCK_COMMUNICATION_LOGS: CommunicationLog[] = [
    { id: 'LOG-C1', type: 'chat', senderId: 'USR-1002', senderName: 'Arjun', receiverId: 'USR-8821', receiverName: 'Priya', timestamp: '10:30 AM', status: 'completed', riskScore: 12, metadata: { contentSnippet: 'Hi, how are you? I saw your profile...' } },
    { id: 'LOG-C2', type: 'audio_call', senderId: 'USR-1005', senderName: 'Vikram', receiverId: 'USR-9921', receiverName: 'Ananya', timestamp: 'Yesterday', status: 'completed', riskScore: 5, metadata: { duration: '12:45' } },
    { id: 'LOG-C3', type: 'chat', senderId: 'USR-X', senderName: 'Spammer', receiverId: 'USR-1002', receiverName: 'Arjun', timestamp: '2 days ago', status: 'flagged', riskScore: 88, metadata: { contentSnippet: 'Send money to this account for premium...' } },
    { id: 'LOG-C4', type: 'interest', senderId: 'USR-1002', senderName: 'Arjun', receiverId: 'USR-9921', receiverName: 'Ananya', timestamp: '3 days ago', status: 'completed', riskScore: 0, metadata: {} },
];

export const COMMUNICATION_STATS = {
    totalMessages: 15420,
    activeCalls: 45,
    flaggedInteractions: 12,
    avgResponseTime: '2m'
};

export const SAFETY_ANALYTICS = {
  safeUsersPercentage: 98.5,
  criticalIssues: 5,
  dailyScans: 1500
};

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

export const MOCK_HOROSCOPE_SUBMISSIONS: HoroscopeSubmission[] = [
    { id: 'HOR-001', userId: 'USR-1002', userName: 'Arjun Reddy', userAvatar: 'https://ui-avatars.com/api/?name=Arjun', raasi: 'Mesha', nakshatra: 'Aswini', lagnam: 'Simha', dosham: 'None', fileUrl: 'horoscope.pdf', submittedAt: '2 hours ago', status: 'pending', aiMatchScore: 95, compatibilityCount: 12 },
    { id: 'HOR-002', userId: 'USR-9921', userName: 'Ananya M', userAvatar: 'https://ui-avatars.com/api/?name=Ananya', raasi: 'Kumbha', nakshatra: 'Shatabhisha', lagnam: 'Dhanusu', dosham: 'Chevvai', fileUrl: 'jathagam.jpg', submittedAt: 'Yesterday', status: 'approved', aiMatchScore: 88, compatibilityCount: 8 },
];

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

export const MOCK_COMMUNITY_STRUCTURE: CommunityStructure[] = [
    { id: 'hindu', name: 'Hindu', theme: 'orange', castes: [{ id: 'iyer', name: 'Iyer', subCastes: ['Vadakalai', 'Thenkalai'], profileCount: 1250 }, { id: 'mudaliar', name: 'Mudaliar', subCastes: [], profileCount: 3400 }] },
    { id: 'christian', name: 'Christian', theme: 'blue', castes: [{ id: 'rc', name: 'Roman Catholic', subCastes: [], profileCount: 800 }] },
    { id: 'muslim', name: 'Muslim', theme: 'green', castes: [{ id: 'sunni', name: 'Sunni', subCastes: [], profileCount: 650 }] },
];

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

export const MOCK_TICKETS: SupportTicket[] = [
    { id: 'TKT-001', user: 'Arjun Reddy', userId: 'USR-1002', subject: 'Payment failed but deducted', category: 'Billing', priority: 'High', status: 'Open', lastUpdated: '10 mins ago', messages: [{ sender: 'user', text: 'I tried to upgrade to Platinum but transaction failed.', time: '10:30 AM' }] },
    { id: 'TKT-002', user: 'Priya S', userId: 'USR-8821', subject: 'How to hide profile?', category: 'Technical', priority: 'Low', status: 'Resolved', lastUpdated: '2 days ago', messages: [{ sender: 'user', text: 'I want to hide my profile for a week.', time: 'Yesterday' }] },
];

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

export const MOCK_MODERATION: ModerationItem[] = [
    { id: 'MOD-001', userId: 'USR-5541', userName: 'Raj K', type: 'Photo', content: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop', aiScore: 12, flags: [], status: 'Pending', timestamp: '10 mins ago' },
    { id: 'MOD-002', userId: 'USR-6622', userName: 'Unknown', type: 'Bio', content: 'Call me at 9876543210 for immediate marriage.', aiScore: 95, flags: ['Phone Number', 'Solicitation'], status: 'Pending', timestamp: '1 hour ago' },
];

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

export const MOCK_CMS: CMSContent[] = [
    { id: 'cms-1', section: 'Home', key: 'Hero Title', value: 'Divine Connections', type: 'text', lastUpdated: '2 days ago' },
    { id: 'cms-2', section: 'Home', key: 'Hero Subtitle', value: 'Start here.', type: 'text', lastUpdated: '2 days ago' },
    { id: 'cms-3', section: 'Banners', key: 'Promo Banner', value: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop', type: 'image', lastUpdated: '1 week ago' },
];

export const ADMIN_STATS = {
    serverHealth: '99.9%',
    totalUsers: 12450,
};
