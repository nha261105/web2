export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  priceLabel: string;
  originalPrice?: string;
  image: string;
  gallery: string[];
  badge?: "new" | "sale" | "bestseller";
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  available: number;
  specs: Record<string, string>;
  tags: string[];
}

export type ProductCardType = "default" | "list" | "cart";
export const steps = [
  {
    id: "01",
    title: "Chọn thiết bị phù hợp",
    desc: "Khám phá hơn 500 thiết bị công nghệ chuyên nghiệp, lọc theo danh mục, thương hiệu, mức giá và trạng thái sẵn hàng.",
  },
  {
    id: "02",
    title: "Đặt lịch thuê linh hoạt",
    desc: "Chọn thời gian thuê và số lượng thiết bị đúng với tiến độ dự án của bạn.",
  },
  {
    id: "03",
    title: "Nhận thiết bị nhanh chóng",
    desc: "Nhận hàng đúng hẹn, bắt đầu công việc ngay mà không mất thời gian chờ đợi.",
  },
];

export const reviews = [
  {
    used_id: 1,
    user_name: "Sarah Chen",
    user_img: "",
    star: 5,
    desc: "RentalTech đã cứu buổi chụp cưới của mình. Mình cần gấp Sony A7 IV dự phòng vào phút chót và đội ngũ giao trong ngày. Thiết bị rất mới, đóng gói cẩn thận và mức giá cực kỳ hợp lý.",
  },
  {
    used_id: 2,
    user_name: "Marcus Williams",
    user_img: "",
    star: 4,
    desc: "Mình thuê combo quay sự kiện và trải nghiệm rất tốt. Thiết bị hoạt động ổn định, nhân viên hỗ trợ kỹ, thủ tục nhận trả nhanh gọn.",
  },
  {
    user_id: 3,
    user_name: "Aisha Patel",
    user_img: "",
    star: 5,
    desc: "Lần đầu thuê thiết bị ở RentalTech nhưng rất ấn tượng. Tư vấn đúng nhu cầu, giá minh bạch và giao hàng đúng giờ.",
  },
];
export const PRODUCTS: Product[] = [
  {
    id: "1",
    title: "MacBook Pro 16-inch M3 Max",
    description:
      "The ultimate laptop for professionals. Apple M3 Max chip with 40-core GPU, 16-inch Liquid Retina XDR display, and up to 22 hours battery life. Perfect for video editing, 3D rendering, and software development.",
    price: 89,
    priceLabel: "$89/day",
    image:
      "https://images.unsplash.com/photo-1642551123019-00407c2c2a1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1642551123019-00407c2c2a1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1558267535-896c0f00b67b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1658671141384-c4317684a1a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    badge: "new",
    category: "Laptops",
    brand: "Apple",
    rating: 4.9,
    reviews: 128,
    available: 8,
    specs: {
      Chip: "Apple M3 Max",
      RAM: "64GB",
      Storage: "1TB SSD",
      Display: '16.2" Liquid Retina XDR',
      Battery: "Up to 22h",
      Weight: "2.15 kg",
    },
    tags: ["laptop", "apple", "macbook", "professional"],
  },
  {
    id: "2",
    title: "Sony A7 IV Mirrorless Camera",
    description:
      "Full-frame mirrorless camera with 33MP sensor, 4K 60fps video, and advanced autofocus. Ideal for professional photography and videography projects.",
    price: 59,
    priceLabel: "$59/day",
    originalPrice: "$79/day",
    image:
      "https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1763089040164-7b6a26ff98da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1634812932028-3baa37d90b52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    badge: "sale",
    category: "Cameras",
    brand: "Sony",
    rating: 4.8,
    reviews: 96,
    available: 5,
    specs: {
      Sensor: "33MP Full-Frame BSI CMOS",
      Video: "4K 60fps",
      ISO: "100-51200",
      Autofocus: "Real-time Tracking AF",
      Weight: "659g",
      Mount: "Sony E-mount",
    },
    tags: ["camera", "sony", "mirrorless", "photography"],
  },
  {
    id: "3",
    title: "Sony WH-1000XM5 Headphones",
    description:
      "Industry-leading noise canceling headphones with 30-hour battery life, crystal clear hands-free calling, and superior sound quality for music and work.",
    price: 12,
    priceLabel: "$12/day",
    image:
      "https://images.unsplash.com/photo-1572119244337-bcb4aae995af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1572119244337-bcb4aae995af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1516656769714-e69dc19ad33d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    badge: "bestseller",
    category: "Audio",
    brand: "Sony",
    rating: 4.7,
    reviews: 214,
    available: 15,
    specs: {
      "Driver Unit": "30mm",
      "Frequency Response": "4Hz-40,000Hz",
      Battery: "30 hours",
      Weight: "250g",
      Connectivity: "Bluetooth 5.2, 3.5mm",
      NoiseCanceling: "Industry-leading",
    },
    tags: ["audio", "headphones", "sony", "noise-canceling"],
  },
  {
    id: "4",
    title: "DJI Mavic 3 Pro Drone Kit",
    description:
      "Professional-grade drone with triple camera system, 43-minute flight time, and intelligent flight modes. Perfect for aerial photography and videography.",
    price: 125,
    priceLabel: "$125/day",
    image:
      "https://images.unsplash.com/photo-1699084583993-16958aa157d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1699084583993-16958aa157d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1770411034013-e6cb865ed21a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    category: "Drones",
    brand: "DJI",
    rating: 4.9,
    reviews: 67,
    available: 4,
    specs: {
      Camera: "Triple Camera System",
      "Main Camera": "4/3 CMOS 20MP",
      "Flight Time": "43 minutes",
      "Max Speed": "21 m/s",
      Range: "15 km",
      Weight: "958g",
    },
    tags: ["drone", "dji", "aerial", "photography"],
  },
  {
    id: "5",
    title: "Meta Quest 3 VR Headset",
    description:
      "Next-generation mixed reality headset with 4K+ display, full-color passthrough, and access to the largest VR library for immersive experiences.",
    price: 45,
    priceLabel: "$45/day",
    image:
      "https://images.unsplash.com/photo-1660190366607-9b192135e0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1660190366607-9b192135e0d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    badge: "new",
    category: "VR & AR",
    brand: "Meta",
    rating: 4.6,
    reviews: 45,
    available: 6,
    specs: {
      Display: "Pancake LCD 2064×2208/eye",
      Processor: "Snapdragon XR2 Gen 2",
      RAM: "8GB",
      Storage: "128GB",
      Battery: "2–3 hours",
      Weight: "515g",
    },
    tags: ["vr", "meta", "virtual-reality", "gaming"],
  },
  {
    id: "6",
    title: 'iPad Pro 12.9" M2 Wi-Fi',
    description:
      "The ultimate iPad with M2 chip, ProMotion display up to 120Hz, and Apple Pencil support. Perfect for digital design, presentations, and creative work.",
    price: 35,
    priceLabel: "$35/day",
    image:
      "https://images.unsplash.com/photo-1759820941220-fed6a1010146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1759820941220-fed6a1010146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    badge: "bestseller",
    category: "Tablets",
    brand: "Apple",
    rating: 4.8,
    reviews: 182,
    available: 10,
    specs: {
      Chip: "Apple M2",
      Display: '12.9" Liquid Retina XDR',
      Storage: "256GB",
      Connectivity: "Wi-Fi 6E, Bluetooth 5.3",
      Battery: "Up to 10h",
      Weight: "682g",
    },
    tags: ["tablet", "apple", "ipad", "creative"],
  },
  {
    id: "7",
    title: "Epson PowerLite 4K Projector",
    description:
      "Ultra HD 4K projector with 5000 lumens brightness, perfect for corporate presentations, outdoor screenings, and event productions.",
    price: 80,
    priceLabel: "$80/day",
    image:
      "https://images.unsplash.com/photo-1687794079217-c877ba6aae84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1687794079217-c877ba6aae84?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    category: "Projectors",
    brand: "Epson",
    rating: 4.5,
    reviews: 38,
    available: 3,
    specs: {
      Resolution: "4K UHD (3840×2160)",
      Brightness: "5000 lumens",
      "Contrast Ratio": "2,500,000:1",
      "Throw Ratio": "1.35–2.20:1",
      Connectivity: "HDMI, USB, Wi-Fi",
      Weight: "6.8 kg",
    },
    tags: ["projector", "epson", "presentation", "4k"],
  },
  {
    id: "8",
    title: "Sony FX3 Cinema Line Camera",
    description:
      "Full-frame cinema camera designed for filmmakers. Features 12.1MP sensor, 4K 120fps, 15+ stops dynamic range, and compact body.",
    price: 145,
    priceLabel: "$145/day",
    originalPrice: "$175/day",
    image:
      "https://images.unsplash.com/photo-1634812932028-3baa37d90b52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1634812932028-3baa37d90b52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
      "https://images.unsplash.com/photo-1763089040164-7b6a26ff98da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600",
    ],
    badge: "sale",
    category: "Cameras",
    brand: "Sony",
    rating: 4.9,
    reviews: 54,
    available: 2,
    specs: {
      Sensor: "12.1MP Full-Frame CMOS",
      Video: "4K 120fps",
      "Dynamic Range": "15+ stops",
      ISO: "80-102400",
      Mount: "Sony E-mount",
      Weight: "715g",
    },
    tags: ["camera", "sony", "cinema", "video"],
  },
];

export const CATEGORIES = [
  { id: "laptops", name: "Laptops", count: 42, icon: "laptop" },
  { id: "cameras", name: "Cameras", count: 35, icon: "camera" },
  { id: "audio", name: "Audio", count: 28, icon: "headphones" },
  { id: "drones", name: "Drones", count: 15, icon: "wind" },
  { id: "vr", name: "VR & AR", count: 12, icon: "glasses" },
  { id: "tablets", name: "Tablets", count: 22, icon: "tablet-smartphone" },
  { id: "projectors", name: "Projectors", count: 8, icon: "projector" },
  { id: "accessories", name: "Accessories", count: 64, icon: "cable" },
];

export const BRANDS = [
  "Apple",
  "Sony",
  "DJI",
  "Meta",
  "Epson",
  "Canon",
  "Nikon",
  "Samsung",
];

export const ORDERS = [
  {
    id: "ORD-001",
    date: "2026-02-10",
    items: 3,
    total: 312,
    status: "Delivered",
    products: ['MacBook Pro 16"', "Sony Camera", "Tripod"],
  },
  {
    id: "ORD-002",
    date: "2026-02-15",
    items: 1,
    total: 125,
    status: "Active",
    products: ["DJI Mavic 3 Pro"],
  },
  {
    id: "ORD-003",
    date: "2026-02-20",
    items: 2,
    total: 84,
    status: "Pending",
    products: ["iPad Pro", "Apple Pencil"],
  },
  {
    id: "ORD-004",
    date: "2026-01-28",
    items: 1,
    total: 45,
    status: "Delivered",
    products: ["Meta Quest 3"],
  },
  {
    id: "ORD-005",
    date: "2026-01-15",
    items: 4,
    total: 478,
    status: "Delivered",
    products: ["Sony FX3", "Lens Kit", "Tripod", "Microphone"],
  },
];
