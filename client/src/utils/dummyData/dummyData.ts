import { Star, Clock, CheckCircle, AlertCircle } from "lucide-react";

// Types
export interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  coverImage: string | null;
  coverImageId: string | null;
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  status: "posted" | "pending" | "draft" | "deleted" | "edited";
  likesCount: number;
  createdAt: Date;
  deletedAt: Date | null;
}

export interface BookImage {
  url: string;
  publicId: string;
}

export interface Book {
  id: string;
  title: string;
  images: BookImage[];
  description: string;
  genre: string;
  releaseDate: string;
  purchaseLinks: string[];
  authorId: string;
  author?: {
    id: string;
    name: string;
    email: string;
  };
  state: "pending" | "approved" | "not_approved";
  approved: boolean;
  isAdvertised: boolean;
  trial: string | null;
  likesCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface Publisher {
  id: string;
  name: string;
  publisherId: string;
  email: string;
  number: string;
  logo: string;
  logoId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: string;
  isLoggedIn: boolean;
  isEmailVerified?: boolean;
  profilePicture?: string | null;
  bio?: string;
  followersCount?: number;
  followingCount?: number;
  books?: any[];
  blogs?: any[];
  interests?: string[];
  socialLinks?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardTask {
  id: number;
  title: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  dueDate: string;
}

export interface DashboardActivity {
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

// Mock Data Sets
const now = Date.now();

export const MOCK_ARTICLES: Blog[] = [
  {
    id: "1",
    title: "The Future of Digital Publishing",
    content: "Digital publishing is evolving rapidly...",
    tags: ["publishing", "digital", "trends"],
    coverImage: "https://images.unsplash.com/photo-1456327102063-fb5054efe647?w=400",
    coverImageId: "cover1",
    userId: "1",
    user: { id: "1", name: "John Doe", email: "john@example.com" },
    status: "posted",
    likesCount: 234,
    createdAt: new Date("2024-03-15"),
    deletedAt: null
  },
  {
    id: "2",
    title: "10 Tips for Aspiring Authors",
    content: "Writing a book is a journey...",
    tags: ["writing", "authors", "tips"],
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400",
    coverImageId: "cover2",
    userId: "2",
    user: { id: "2", name: "Jane Smith", email: "jane@example.com" },
    status: "posted",
    likesCount: 567,
    createdAt: new Date("2024-03-10"),
    deletedAt: null
  },
  {
    id: "3",
    title: "Understanding Book Genres",
    content: "A comprehensive guide to book genres...",
    tags: ["genres", "books", "guide"],
    coverImage: null,
    coverImageId: null,
    userId: "4",
    user: { id: "4", name: "Sarah Johnson", email: "sarah@example.com" },
    status: "pending",
    likesCount: 0,
    createdAt: new Date("2024-03-18"),
    deletedAt: null
  },
  {
    id: "4",
    title: "Marketing Your First Book",
    content: "Essential marketing strategies...",
    tags: ["marketing", "promotion", "books"],
    coverImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    coverImageId: "cover4",
    userId: "1",
    user: { id: "1", name: "John Doe", email: "john@example.com" },
    status: "draft",
    likesCount: 0,
    createdAt: new Date("2024-03-20"),
    deletedAt: null
  },
  {
    id: "5",
    title: "The Rise of Audiobooks",
    content: "How audiobooks are changing reading habits...",
    tags: ["audiobooks", "trends", "technology"],
    coverImage: "https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=400",
    coverImageId: "cover5",
    userId: "5",
    user: { id: "5", name: "Mike Wilson", email: "mike@example.com" },
    status: "edited",
    likesCount: 89,
    createdAt: new Date("2024-03-05"),
    deletedAt: null
  }
];

export const MOCK_BOOKS: Book[] = [
  {
    id: "1",
    title: "The Midnight Library",
    images: [{ url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=200", publicId: "book1" }],
    description: "Between life and death there is a library.",
    genre: "Fiction",
    releaseDate: "2024-01-15",
    purchaseLinks: ["https://amazon.com/book1"],
    authorId: "1",
    author: { id: "1", name: "John Doe", email: "john@example.com" },
    state: "approved",
    approved: true,
    isAdvertised: true,
    trial: null,
    likesCount: 1234,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
    deletedAt: null
  },
  {
    id: "2",
    title: "Atomic Habits",
    images: [{ url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200", publicId: "book2" }],
    description: "No matter your goals, Atomic Habits offers a proven framework.",
    genre: "Self-Help",
    releaseDate: "2024-02-01",
    purchaseLinks: ["https://amazon.com/book2"],
    authorId: "2",
    author: { id: "2", name: "Jane Smith", email: "jane@example.com" },
    state: "approved",
    approved: true,
    isAdvertised: false,
    trial: null,
    likesCount: 2345,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-18"),
    deletedAt: null
  },
  {
    id: "3",
    title: "The Silent Patient",
    images: [{ url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200", publicId: "book3" }],
    description: "A shocking psychological thriller.",
    genre: "Thriller",
    releaseDate: "2024-01-20",
    purchaseLinks: ["https://amazon.com/book3"],
    authorId: "4",
    author: { id: "4", name: "Sarah Johnson", email: "sarah@example.com" },
    state: "pending",
    approved: false,
    isAdvertised: false,
    trial: "Chapter 1 preview available",
    likesCount: 567,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-10"),
    deletedAt: null
  }
];

export const MOCK_PUBLISHERS: Publisher[] = [
  {
    id: "1",
    name: "Penguin Random House",
    publisherId: "PRH001",
    email: "contact@penguinrandomhouse.com",
    number: "+1 (212) 123-4567",
    logo: "https://ui-avatars.com/api/?name=PRH&background=0D387D&color=fff",
    logoId: "logo_prh_001",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-20"),
    deletedAt: null
  },
  {
    id: "2",
    name: "HarperCollins Publishers",
    publisherId: "HC002",
    email: "info@harpercollins.com",
    number: "+1 (212) 207-7000",
    logo: "https://ui-avatars.com/api/?name=HC&background=4D127A&color=fff",
    logoId: "logo_hc_002",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-03-18"),
    deletedAt: null
  },
  {
    id: "3",
    name: "Simon & Schuster",
    publisherId: "SS003",
    email: "publishers@simonandschuster.com",
    number: "+1 (212) 698-7000",
    logo: "https://ui-avatars.com/api/?name=SS&background=065F46&color=fff",
    logoId: "logo_ss_003",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-03-15"),
    deletedAt: null
  },
  {
    id: "4",
    name: "Hachette Livre",
    publisherId: "HL004",
    email: "contact@hachette.com",
    number: "+33 (1) 43-92-30-00",
    logo: "https://ui-avatars.com/api/?name=HL&background=854D0E&color=fff",
    logoId: "logo_hl_004",
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-03-12"),
    deletedAt: null
  },
  {
    id: "5",
    name: "Macmillan Publishers",
    publisherId: "MP005",
    email: "info@macmillan.com",
    number: "+1 (646) 307-5151",
    logo: "https://ui-avatars.com/api/?name=MP&background=0D387D&color=fff",
    logoId: "logo_mp_005",
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-03-10"),
    deletedAt: null
  }
];

export const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    role: "author",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Passionate writer and storyteller. Author of multiple best-selling novels.",
    followersCount: 1234,
    followingCount: 567,
    books: [{ id: "b1" }, { id: "b2" }],
    blogs: [{ id: "bl1" }],
    interests: ["Fiction", "Fantasy", "Sci-Fi"],
    socialLinks: ["https://twitter.com/johndoe", "https://github.com/johndoe"],
    createdAt: new Date("2024-01-15").toISOString(),
    updatedAt: new Date("2024-03-20").toISOString()
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    username: "janesmith",
    role: "reader",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Avid reader and book reviewer",
    followersCount: 456,
    followingCount: 789,
    books: [],
    blogs: [],
    interests: ["Romance", "Mystery", "Thriller"],
    socialLinks: [],
    createdAt: new Date("2024-02-01").toISOString(),
    updatedAt: new Date("2024-03-18").toISOString()
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@penclub.com",
    username: "admin",
    role: "admin",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Platform Administrator",
    followersCount: 999,
    followingCount: 100,
    books: [],
    blogs: [],
    interests: ["Management", "Technology"],
    socialLinks: [],
    createdAt: new Date("2024-01-01").toISOString(),
    updatedAt: new Date("2024-03-15").toISOString()
  },
  {
    id: "4",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    username: "sarahj",
    role: "author",
    isLoggedIn: false,
    isEmailVerified: false,
    profilePicture: null,
    bio: "Poet and creative writer",
    followersCount: 2345,
    followingCount: 234,
    books: [{ id: "b3" }],
    blogs: [{ id: "bl2" }, { id: "bl3" }],
    interests: ["Poetry", "Drama"],
    socialLinks: ["https://instagram.com/sarahj"],
    createdAt: new Date("2024-02-20").toISOString(),
    updatedAt: new Date("2024-03-10").toISOString()
  },
  {
    id: "5",
    name: "Mike Wilson",
    email: "mike@example.com",
    username: "mikew",
    role: "reader",
    isLoggedIn: true,
    isEmailVerified: true,
    profilePicture: null,
    bio: "Tech enthusiast and book lover",
    followersCount: 789,
    followingCount: 345,
    books: [],
    blogs: [],
    interests: ["Technology", "Science Fiction"],
    socialLinks: ["https://twitter.com/mikew"],
    createdAt: new Date("2024-03-01").toISOString(),
    updatedAt: new Date("2024-03-25").toISOString()
  }
];

export const MOCK_TASKS: DashboardTask[] = [
  {
    id: 1,
    title: "Review quarterly report",
    completed: false,
    priority: "high",
    dueDate: "Today",
  },
  {
    id: 2,
    title: "Update user documentation",
    completed: true,
    priority: "medium",
    dueDate: "Tomorrow",
  },
  {
    id: 3,
    title: "Fix navigation bug",
    completed: false,
    priority: "high",
    dueDate: "Today",
  },
  {
    id: 4,
    title: "Prepare team meeting",
    completed: false,
    priority: "low",
    dueDate: "Tomorrow",
  },
  {
    id: 5,
    title: "Deploy latest updates",
    completed: true,
    priority: "medium",
    dueDate: "Yesterday",
  },
];

export const MOCK_ACTIVITIES: DashboardActivity[] = [
  {
    type: "user",
    title: "New user registered",
    description: "John Doe joined the platform",
    timestamp: new Date(now - 1000 * 60 * 15).toISOString(),
    status: "completed",
  },
  {
    type: "document",
    title: "Document uploaded",
    description: "Q4 Report.pdf was uploaded",
    timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
    status: "completed",
  },
  {
    type: "comment",
    title: "New comment",
    description: "Sarah commented on your post",
    timestamp: new Date(now - 1000 * 60 * 120).toISOString(),
    status: "pending",
  },
  {
    type: "view",
    title: "High traffic alert",
    description: "Page views increased by 150%",
    timestamp: new Date(now - 1000 * 60 * 180).toISOString(),
  },
  {
    type: "user",
    title: "Subscription renewed",
    description: "Premium plan renewed by Acme Corp",
    timestamp: new Date(now - 1000 * 60 * 240).toISOString(),
    status: "completed",
  },
];

export const MOCK_CHART_DATA = [
  { label: "Mon", value: 45 },
  { label: "Tue", value: 62 },
  { label: "Wed", value: 78 },
  { label: "Thu", value: 55 },
  { label: "Fri", value: 89 },
  { label: "Sat", value: 42 },
  { label: "Sun", value: 38 },
];

export const MOCK_LINE_CHART_DATA = [
  { label: "Jan", value: 34 },
  { label: "Feb", value: 45 },
  { label: "Mar", value: 62 },
  { label: "Apr", value: 50 },
  { label: "May", value: 78 },
  { label: "Jun", value: 92 },
];

export const MOCK_QUICK_STATS = [
  { icon: Star, label: "Rating", value: "4.8", change: 12 },
  { icon: Clock, label: "Response Time", value: "2.4m", change: -8 },
  { icon: CheckCircle, label: "Completion", value: "94%", change: 5 },
  { icon: AlertCircle, label: "Issues", value: "3", change: -15 },
];
