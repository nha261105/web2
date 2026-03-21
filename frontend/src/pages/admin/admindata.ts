import { Users, Package, ShoppingBag, DollarSign } from "lucide-react";

export const REVENUE_DATA = [
  { month: "Sep", revenue: 8200, orders: 82 },
  { month: "Oct", revenue: 9800, orders: 98 },
  { month: "Nov", revenue: 11200, orders: 112 },
  { month: "Dec", revenue: 14500, orders: 145 },
  { month: "Jan", revenue: 12300, orders: 123 },
  { month: "Feb", revenue: 15800, orders: 158 },
];

export const CATEGORY_DATA = [
  { category: "Laptops", rentals: 42, revenue: 5200 },
  { category: "Cameras", rentals: 35, revenue: 4100 },
  { category: "Audio", rentals: 28, revenue: 1680 },
  { category: "Drones", rentals: 15, revenue: 3750 },
  { category: "VR & AR", rentals: 12, revenue: 1080 },
];

export const RECENT_ORDERS = [
  {
    id: "ORD-0089",
    customer: "Emma Wilson",
    product: 'MacBook Pro 16"',
    days: 3,
    amount: 267,
    paymentStatus: "Paid",
    status: "Active",
    date: "Feb 22",
  },
  {
    id: "ORD-0088",
    customer: "James Lee",
    product: "DJI Mavic 3 Pro",
    days: 3,
    amount: 375,
    paymentStatus: "Pending",
    status: "Processing",
    date: "Feb 21",
  },
  {
    id: "ORD-0087",
    customer: "Aisha Patel",
    product: "Sony A7 IV",
    days: 2,
    amount: 118,
    paymentStatus: "Paid",
    status: "Delivered",
    date: "Feb 20",
  },
  {
    id: "ORD-0086",
    customer: "Marcus Chen",
    product: "Meta Quest 3",
    days: 3,
    amount: 135,
    paymentStatus: "Paid",
    status: "Delivered",
    date: "Feb 19",
  },
  {
    id: "ORD-0085",
    customer: "Lisa Johnson",
    product: "Sony FX3 Kit",
    days: 3,
    amount: 435,
    paymentStatus: "Paid",
    status: "Active",
    date: "Feb 19",
  },
];

export const STATUS_STYLES: Record<string, string> = {
  Active: "bg-blue-50 text-blue-700",
  Processing: "bg-yellow-50 text-yellow-700",
  Delivered: "bg-green-50 text-green-700",
  Cancelled: "bg-red-50 text-red-700",
};

export const METRICS = [
  {
    label: "Total Revenue",
    value: "$71,800",
    change: "+18.2%",
    up: true,
    icon: DollarSign,
    color: "bg-blue-50 text-[#0052CC]",
  },
  {
    label: "Total Orders",
    value: "718",
    change: "+12.5%",
    up: true,
    icon: ShoppingBag,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Active Products",
    value: "124",
    change: "+8 new",
    up: true,
    icon: Package,
    color: "bg-orange-50 text-[#FF6A00]",
  },
  {
    label: "New Users",
    value: "284",
    change: "-3.1%",
    up: false,
    icon: Users,
    color: "bg-purple-50 text-purple-600",
  },
];

export const ORDER_CARD = [
  {
    label: "Total Order",
    value: 8,
    text: "text-black",
  },
  {
    label: "Active",
    value: 2,
    text: "text-blue-400",
  },
  {
    label: "Delivered",
    value: 4,
    text: "text-green-500",
  },
  {
    label: "Revenue",
    value: 1464,
    text: "text-blue-800",
  },
];

export const USER_STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-50 text-green-700",
  Inactive: "bg-gray-100 text-gray-700",
  Suspended: "bg-red-50 text-red-700",
};

export const USERS = [
  {
    id: "USR-001",
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    role: "Admin",
    orders: 32,
    totalSpent: 4021,
    joined: "Jan 12, 2025",
    status: "Active",
  },
  {
    id: "USR-002",
    name: "James Lee",
    email: "james.lee@email.com",
    role: "Customer",
    orders: 11,
    totalSpent: 1399,
    joined: "Mar 02, 2025",
    status: "Active",
  },
  {
    id: "USR-003",
    name: "Aisha Patel",
    email: "aisha.patel@email.com",
    role: "Manager",
    orders: 21,
    totalSpent: 2884,
    joined: "Apr 21, 2025",
    status: "Inactive",
  },
  {
    id: "USR-004",
    name: "Marcus Chen",
    email: "marcus.chen@email.com",
    role: "Customer",
    orders: 8,
    totalSpent: 872,
    joined: "Jul 08, 2025",
    status: "Suspended",
  },
  {
    id: "USR-005",
    name: "Lisa Johnson",
    email: "lisa.johnson@email.com",
    role: "Customer",
    orders: 16,
    totalSpent: 2012,
    joined: "Sep 17, 2025",
    status: "Active",
  },
];

export const USER_CARD = [
  {
    label: "Total User",
    value: 5,
    text: "text-black",
  },
  {
    label: "Admin/Manager",
    value: 2,
    text: "text-blue-500",
  },
  {
    label: "Active",
    value: 3,
    text: "text-green-500",
  },
  {
    label: "Total Spent",
    value: "$11,188",
    text: "text-blue-800",
  },
];
