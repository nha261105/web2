import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "@/services/catalogService";
import { signout } from "@/services/usersService";
import { getNotifications, markAsRead, markAllRead } from "@/services/notificationService";
import {
  Search,
  Heart,
  User,
  ShoppingCart,
  X,
  ChevronDown,
  Settings,
  Package,
  LogOut,
  LayoutDashboard,
  Bell,
  Loader2,
} from "lucide-react";
import { getMyCart } from "@/services/cartService";

type DeviceMenuColumn = {
  title: string;
  keywords: string[];
  fallbackItems: string[];
  items: Array<{ id: string; title: string }>;
};

const DEFAULT_DEVICE_COLUMNS: DeviceMenuColumn[] = [
  {
    title: "Máy ảnh",
    keywords: ["may anh", "camera", "canon", "sony", "nikon", "fujifilm"],
    fallbackItems: [
      "Sony A7 IV",
      "Canon EOS R6",
      "Nikon Z6 II",
      "Fujifilm X-T5",
    ],
    items: [],
  },
  {
    title: "Flycam",
    keywords: ["flycam", "drone", "dji", "mavic", "mini"],
    fallbackItems: [
      "DJI Mavic 3",
      "DJI Air 3",
      "DJI Mini 4 Pro",
      "DJI Avata 2",
    ],
    items: [],
  },
  {
    title: "Phụ kiện quay",
    keywords: ["gimbal", "tripod", "lens", "ong kinh", "filter", "rig"],
    fallbackItems: ["DJI RS 4", "DJI RS 4 Pro", "Sony FE 24-70", "Filter ND"],
    items: [],
  },
  {
    title: "Âm thanh & livestream",
    keywords: ["audio", "micro", "mic", "livestream", "stream", "rode"],
    fallbackItems: [
      "Rode Wireless Pro",
      "DJI Mic 2",
      "Shure SM7B",
      "ATEM Mini Pro",
    ],
    items: [],
  },
];

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const buildDeviceColumns = (
  products: Array<{ id: string; title: string; category: string }>,
): DeviceMenuColumn[] => {
  return DEFAULT_DEVICE_COLUMNS.map((column) => {
    const matched = products
      .filter((product) => {
        const haystack = normalizeText(`${product.title} ${product.category}`);
        return column.keywords.some((keyword) =>
          haystack.includes(normalizeText(keyword)),
        );
      })
      .map((product) => ({ id: product.id, title: product.title }));

    const items = Array.from(
      new Map(matched.map((item) => [item.title, item])).values(),
    ).slice(0, 8);

    return {
      ...column,
      items: items.length
        ? items
        : column.fallbackItems.map((title) => ({ id: "", title })),
    };
  });
};

interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  roles?: Array<{ id: number; name: string }>;
}

export default function Header() {
  const navigator = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [allProducts, setAllProducts] = useState<
    Array<{ id: string; title: string; category: string }>
  >([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Menu State
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [deviceColumns, setDeviceColumns] = useState<DeviceMenuColumn[]>(
    DEFAULT_DEVICE_COLUMNS,
  );

  // Refs
  const megaAreaRef = useRef<HTMLLIElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const searchBoxRef = useRef<HTMLDivElement | null>(null);
  const notifRef = useRef<HTMLDivElement | null>(null);

  // ─── AUTH STATE  ───────────────────────────────────────
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("auth_user");
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // ─── NOTIFICATION STATE ─────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState<Array<{
    id: number;
    title: string;
    content: string;
    type: string;
    is_read: boolean;
    created_at: string;
  }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  
  const [cartCount, setCartCount] = useState(0);

  // ─── Load device sections ─────────────────────────────────────────
  useEffect(() => {
    async function loadDeviceSections() {
      try {
        const productItems = await getProducts();
        setAllProducts(
          productItems.map((item) => ({
            id: item.id,
            title: item.title,
            category: item.category,
          })),
        );
        setDeviceColumns(buildDeviceColumns(productItems));
      } catch {
        setAllProducts([]);
        setDeviceColumns(buildDeviceColumns([]));
      }
    }

    void loadDeviceSections();
  }, []);

  // ─── Auth storage listener ────────────────────────────────────
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("auth_user");
        setAuthUser(saved && saved !== "undefined" ? JSON.parse(saved) : null);
      } catch {
        setAuthUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth_changed", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth_changed", handleStorageChange);
    };
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!authUser) return;
    setNotifLoading(true);
    try {
      const res = await getNotifications(1, 10);
      if (res.success) {
        setNotifications(res.data ?? []);
        setUnreadCount(res.meta?.unread_count ?? 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setNotifLoading(false);
    }
  };

  // Mark as read
  const handleMarkAsRead = async (id: number) => {
    const res = await markAsRead(id);
    if (res.success) {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    const res = await markAllRead();
    if (res.success) {
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!isNotificationOpen) return;
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isNotificationOpen]);

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [authUser]);

  // ─── Listen for cart changes ──────────────────────────────────────────
  useEffect(() => {
    const fetchCartCount = async () => {
      if (!authUser) {
        setCartCount(0);
        return;
      }
      const response = await getMyCart();
      if (response.success && response.data?.items) {
        setCartCount(response.data.items.length);
      } else {
        setCartCount(0);
      }
    };

    fetchCartCount();

    const handleCartChange = () => fetchCartCount();
    window.addEventListener("cart_changed", handleCartChange);

    return () => window.removeEventListener("cart_changed", handleCartChange);
  }, [authUser]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => setKeyword("");

  const handleSubmitSearch = () => {
    const trimmed = keyword.trim();
    const query = trimmed ? `?search=${encodeURIComponent(trimmed)}` : "";
    navigator(`/products${query}`);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const matchedSearchProducts = useMemo(() => {
    const q = normalizeText(keyword.trim());
    if (!q) return [] as Array<{ id: string; title: string; category: string }>;

    return allProducts
      .filter((item) =>
        normalizeText(`${item.title} ${item.category}`).includes(q),
      )
      .slice(0, 5);
  }, [allProducts, keyword]);

  useEffect(() => {
    if (!isMegaOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        megaAreaRef.current &&
        !megaAreaRef.current.contains(e.target as Node)
      )
        setIsMegaOpen(false);
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, [isMegaOpen]);

  useEffect(() => {
    if (!isAccountOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(e.target as Node)
      )
        setIsAccountOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isAccountOpen]);

  useEffect(() => {
    if (!isSearchFocused) return;

    const handler = (e: MouseEvent) => {
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isSearchFocused]);

  const handleLogout = async () => {
    await signout();
    localStorage.removeItem("auth_user");
    localStorage.removeItem("token");
    setAuthUser(null);
    setIsAccountOpen(false);
    window.dispatchEvent(new Event("auth_changed"));
    navigator("/");
  };

  const handleAccountClick = () => {
    setIsAccountOpen((p) => !p);
  };

  const avatarUrl = authUser
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.full_name)}&background=2563eb&color=ffffff&size=128`
    : "";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/85">
      {/* TOP BAR */}
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          to="/"
          onClick={handleBackToTop}
          className="flex items-center gap-3 shrink-0 z-10"
        >
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-md shadow-blue-500/20">
            <span className="text-base font-extrabold tracking-wide">RT</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-2xl font-bold leading-none tracking-tight text-slate-900">
              RentalTech
            </p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Thuê nhanh, dùng chuẩn
            </p>
          </div>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 justify-center min-w-0 px-2">
          <form
            className="group w-full max-w-2xl"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitSearch();
            }}
            role="search"
            aria-label="Tìm kiếm sản phẩm"
          >
            <div ref={searchBoxRef} className="relative w-full">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Tìm thiết bị cần thuê (laptop, máy ảnh, drone...)"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
              {keyword.length > 0 && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full grid place-items-center bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Tìm
              </button>

              {isSearchFocused && keyword.trim().length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                  {matchedSearchProducts.length > 0 ? (
                    <ul className="divide-y divide-slate-100">
                      {matchedSearchProducts.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => {
                              navigator(`/products/${item.id}`);
                              setIsSearchFocused(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-50"
                          >
                            <p className="text-sm font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-500">
                              {item.category}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="px-4 py-4 text-center text-sm text-slate-500">
                      Không tìm thấy sản phẩm nào
                    </p>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Mobile search icon */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            aria-label="Tìm kiếm"
          >
            <Search size={20} />
          </button>
          {keyword.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              className="h-10 w-10 rounded-full grid place-items-center bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Xóa nội dung tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Right icons */}
        <div className="flex gap-2 sm:gap-3 shrink-0 ml-auto z-10">
          <button
            type="button"
            className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition-colors"
            aria-label="Danh sách yêu thích"
          >
            <Heart size={24} />
          </button>

          {/* Notifications */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors relative"
              aria-label="Thông báo"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 rounded-full bg-red-500 text-white text-xs px-1 flex items-center justify-center font-semibold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 top-full mt-3 w-96 max-h-125 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50">
                  <h3 className="text-sm font-semibold text-slate-900">Thông báo</h3>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>

                <div className="max-h-100 overflow-y-auto">
                  {notifLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      <p className="text-sm">Chưa có thông báo nào</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`border-b border-slate-100 last:border-0 cursor-pointer transition-colors hover:bg-slate-50 ${!notif.is_read ? 'bg-blue-50/30' : ''
                          }`}
                        onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                      >
                        <div className="px-4 py-3">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${!notif.is_read ? 'text-slate-900' : 'text-slate-600'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {notif.content}
                              </p>
                              <p className="text-xs text-slate-400 mt-1.5">
                                {new Date(notif.created_at).toLocaleString('vi-VN')}
                              </p>
                            </div>
                            {!notif.is_read && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="border-t border-slate-100 p-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsNotificationOpen(false);
                        navigator("/account?tab=notifications");
                      }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Account */}
          <div ref={accountMenuRef} className="relative">
            <button
              type="button"
              onClick={handleAccountClick}
              className="cursor-pointer h-10 w-10 rounded-full flex items-center justify-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            >
              {authUser ? (
                <img
                  src={avatarUrl}
                  alt={authUser.full_name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User size={24} />
              )}
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-lg border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-clip">
                {authUser ? (
                  <>
                    <div className="bg-slate-50 px-4 py-4">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {authUser.full_name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {authUser.email}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 p-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigator("/account?tab=profile");
                        }}
                        className="cursor-pointer flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ của tôi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigator("/account?tab=orders");
                        }}
                        className="cursor-pointer flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                      >
                        <Package className="w-4 h-4" />
                        Đơn thuê của tôi
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAccountOpen(false);
                          navigator("/account?tab=settings");
                        }}
                        className="cursor-pointer flex items-center gap-3 rounded-2xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                      >
                        <Settings className="w-4 h-4" />
                        Cài đặt
                      </button>
                    </div>
                    {/* Admin Panel - từ feature của bạn */}
                    {authUser.roles?.some((role) => role.name === "ADMIN") && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-[#0052CC] hover:bg-gray-50 transition-colors mx-2"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center justify-center gap-2 bg-rose-50 p-3 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col p-4 gap-2">
                    <Link
                      to="/signin"
                      onClick={() => {
                        setIsAccountOpen(false);
                      }}
                      className="block rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => {
                        setIsAccountOpen(false);
                      }}
                      className="block rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Tạo tài khoản
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            type="button"
            className="cursor-pointer relative h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-amber-500 hover:bg-slate-100 transition-colors"
            aria-label="Giỏ hàng"
            onClick={() => navigator("/cart")}
          >
            <ShoppingCart size={24} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-orange-500 text-white text-xs px-1 grid place-items-center font-semibold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isMobileSearchOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/40 p-4">
          <div className="mx-auto h-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                Tìm kiếm
              </span>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(false)}
                className="rounded-md p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm thiết bị cần thuê"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
              {keyword.length > 0 && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full grid place-items-center bg-slate-100 text-slate-500 hover:text-slate-700"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSubmitSearch}
              className="mt-3 w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Tìm sản phẩm
            </button>
          </div>
        </div>
      )}

      {/* Desktop nav */}
      <nav className="hidden sm:block relative">
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-3 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 text-sm font-semibold text-slate-700">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/combos" className="hover:text-blue-600 transition-colors">
                Gói Combo
              </Link>
            </li>
            <li
              ref={megaAreaRef}
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <button
                type="button"
                className={`inline-flex items-center gap-2 transition-colors ${isMegaOpen ? "text-blue-600" : "hover:text-blue-600"}`}
                onClick={() => setIsMegaOpen((p) => !p)}
                aria-haspopup="menu"
                aria-expanded={isMegaOpen}
              >
                Thiết bị
                <ChevronDown
                  size={14}
                  className={`transition-transform ${isMegaOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isMegaOpen && (
                <div
                  className="absolute inset-x-0 top-full z-50 -translate-y-2.5"
                  onMouseLeave={() => setIsMegaOpen(false)}
                >
                  <div className="mx-auto w-[min(1200px,94vw)]">
                    <div className="max-h-[72vh] overflow-y-auto rounded-3xl bg-white p-6 text-slate-700 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/60">
                      <div className="mb-4 pb-4">
                        <div className="h-px w-full bg-linear-to-r from-transparent via-slate-200 to-transparent mb-3" />
                        <p className="text-sm font-medium text-slate-500">
                          Danh mục thiết bị và sản phẩm gợi ý
                        </p>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {deviceColumns.map((column) => (
                          <div
                            key={column.title}
                            className="rounded-2xl bg-slate-50/90 p-4 shadow-sm ring-1 ring-slate-200/70"
                          >
                            <p className="mb-3 text-base font-bold text-slate-900">
                              {column.title}
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600">
                              {column.items.map((item) => (
                                <li key={item.title}>
                                  <Link
                                    to={
                                      item.id
                                        ? `/products/${item.id}`
                                        : `/products?search=${encodeURIComponent(item.title)}`
                                    }
                                    className="transition-colors hover:text-blue-600"
                                  >
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile mega menu */}
      {isMegaOpen && (
        <div className="fixed inset-x-0 bottom-14 z-40 max-h-[56vh] overflow-y-auto bg-white p-4 shadow-[0_-8px_30px_-4px_rgba(15,23,42,0.08)] sm:hidden before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-px before:bg-linear-to-r before:from-transparent before:via-slate-200 before:to-transparent">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">Thiết bị</p>
            <button
              type="button"
              onClick={() => setIsMegaOpen(false)}
              className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Đóng danh mục thiết bị"
            >
              <X size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {deviceColumns.map((column) => (
              <div
                key={column.title}
                className="rounded-xl bg-slate-50/95 p-3 shadow-sm"
              >
                <p className="mb-2 text-sm font-semibold text-slate-800">
                  {column.title}
                </p>
                <div className="flex flex-wrap gap-2">
                  {column.items.map((product) => (
                    <Link
                      key={product.title}
                      to={
                        product.id
                          ? `/products/${product.id}`
                          : `/products?search=${encodeURIComponent(product.title)}`
                      }
                      onClick={() => setIsMegaOpen(false)}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/80 hover:ring-blue-200 hover:text-blue-600"
                    >
                      {product.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md supports-backdrop-filter:bg-white/90">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-300/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl grid-cols-5 gap-1 px-2 pt-1.5 pb-2">
          <Link
            to="/"
            className="flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
          >
            Trang chủ
          </Link>
          <button
            type="button"
            onClick={() => setIsMegaOpen((prev) => !prev)}
            className={`flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium transition-colors hover:bg-slate-100 active:scale-[0.98] ${isMegaOpen ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-blue-600"}`}
            aria-label="Danh mục thiết bị"
          >
            Thiết bị
          </button>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
            aria-label="Tìm kiếm"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={handleAccountClick}
            className="flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
            aria-label="Tài khoản"
          >
            Tài khoản
          </button>
          <button
            type="button"
            onClick={() => navigator("/cart")}
            className="relative flex min-h-13 flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
            aria-label="Giỏ hàng"
          >
            Giỏ hàng
          </button>
        </div>
      </nav>
    </header>
  );
}