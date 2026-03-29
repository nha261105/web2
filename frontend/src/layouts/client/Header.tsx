import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search, Heart, User, ShoppingCart, X,
  ChevronDown, Settings, Package, LogOut,
} from "lucide-react";
import { signout } from "@/services/usersService";

const MEGA_MENU_SECTIONS = [
  {
    title: "LAPTOP VĂN PHÒNG",
    items: ["MacBook Air M2","MacBook Pro M3","Dell XPS 13","HP Spectre x360","Lenovo ThinkPad X1","ASUS Zenbook 14","Acer Swift 5","Surface Laptop 6","LG Gram 16"],
  },
  {
    title: "LAPTOP GAMING",
    items: ["ROG Zephyrus G14","ROG Strix G16","MSI Katana 15","Acer Predator Helios","Lenovo Legion 5","HP Omen 16","Alienware m16","Gigabyte Aorus 15","Dell G15"],
  },
  {
    title: "MÁY ẢNH & LEN",
    items: ["Sony A7 IV","Sony FX30","Canon EOS R6","Canon R5","Nikon Z6 II","Fujifilm X-T5","24-70mm f/2.8","70-200mm f/2.8","16-35mm f/4"],
  },
  {
    title: "DRONE & GIMBAL",
    items: ["DJI Mini 4 Pro","DJI Air 3","DJI Mavic 3","DJI Avata 2","DJI RS 4","DJI RS 4 Pro","Zhiyun Crane 4","Insta360 Flow Pro","Hohem iSteady M7"],
  },
  {
    title: "AUDIO & STREAMING",
    items: ["Rode Wireless Pro","DJI Mic 2","Shure SM7B","Elgato Wave 3","Elgato Facecam Pro","ATEM Mini Pro","GoXLR Mini","Stream Deck MK.2","Neewer Key Light"],
  },
  {
    title: "MÁY CHIẾU & MÀN HÌNH",
    items: ["BenQ TK700","Epson EH-TW7000","ViewSonic X100","Samsung Smart Monitor","LG UltraFine 32","Dell 4K 27","Màn chiếu 120 inch","Giá treo máy chiếu","Bộ chuyển HDMI"],
  },
];

interface AuthUser {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export default function Header() {
  const navigator = useNavigate();
  const [keyword, setKeyword] = useState("");
  
  // Menu State
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Refs
  const megaAreaRef = useRef<HTMLLIElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  // ─── AUTH STATE (Đồng bộ với LocalStorage) ────────────────────────────────
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("auth_user");
      return (saved && saved !== "undefined") ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem("auth_user");
        setAuthUser((saved && saved !== "undefined") ? JSON.parse(saved) : null);
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

  const avatarUrl = authUser
    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(authUser.full_name)}&background=2563eb&color=ffffff&size=128`
    : "";

  const clearSearch = () => setKeyword("");

  useEffect(() => {
      if (!isMegaOpen) return;
      const handler = (e: MouseEvent) => {
        if (megaAreaRef.current && !megaAreaRef.current.contains(e.target as Node))
          setIsMegaOpen(false);
      };
      document.addEventListener("mousemove", handler);
      return () => document.removeEventListener("mousemove", handler);
    }, [isMegaOpen]);

    useEffect(() => {
      if (!isAccountOpen) return;
      const handler = (e: MouseEvent) => {
        if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node))
          setIsAccountOpen(false);
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isAccountOpen]);

  const handleLogout = async () => {
      await signout();
      localStorage.removeItem("auth_user");
      localStorage.removeItem("token");
      setAuthUser(null);
      setIsAccountOpen(false);
      window.dispatchEvent(new Event("auth_changed")); // Thông báo cho toàn app
      navigator("/");
    };

    const handleAccountClick = () => {
      if (!authUser) {
        navigator("/signin");
      } else {
        setIsAccountOpen((p) => !p);
      }
    };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-50 shadow-sm">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 gap-4 h-20 max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="h-11 w-11 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
            RT
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 hidden sm:block">
            RentalTech
          </span>
        </Link>

        {/* Desktop search */}
        <div className="hidden sm:block flex-1 max-w-3xl">
          <form onSubmit={(e) => e.preventDefault()} role="search">
            <div className="relative flex-1 max-w-xl">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm thiết bị cần thuê (laptop, camera, drone...)"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-10 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />
              {keyword.length > 0 && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full grid place-items-center bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Mobile search icon */}
        <div className="flex items-center gap-2 sm:hidden">
          <button type="button" onClick={() => setIsMobileSearchOpen(true)}
            className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors">
            <Search size={20} />
          </button>
        </div>

        {/* Right icons */}
        <div className="flex gap-2 sm:gap-3 shrink-0">
          <button type="button"
            className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition-colors">
            <Heart size={24} />
          </button>

          {/* Account */}
          <div ref={accountMenuRef} className="relative">
            <button type="button"
              className="cursor-pointer h-10 min-w-10 rounded-full px-2 flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              onClick={handleAccountClick}
              aria-expanded={authUser ? isAccountOpen : undefined}
            >
              {!!authUser && authUser ? (
                <>
                  <img src={avatarUrl} alt={authUser.full_name}
                    className="h-8 w-8 rounded-full object-cover" />
                  <span className="hidden sm:inline-block text-sm font-medium max-w-28 truncate">
                    {authUser.full_name}
                  </span>
                </>
              ) : (
                <User size={24} />
              )}
            </button>

            {!!authUser && isAccountOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-lg border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-clip">
                <div className="bg-slate-50 px-4 py-4">
                  <p className="text-sm font-semibold text-slate-900 truncate">{authUser?.full_name}</p>
                  <p className="text-xs text-slate-500 truncate">{authUser?.email}</p>
                </div>
                <div className="flex flex-col gap-1 p-3">
                  {[
                    { label: "My Profile", tab: "profile",  icon: User },
                    { label: "My Orders",  tab: "orders",   icon: Package },
                    { label: "Settings",   tab: "settings", icon: Settings },
                  ].map((item) => (
                    <button key={item.tab} type="button"
                      onClick={() => { setIsAccountOpen(false); navigator(`/account?tab=${item.tab}`); }}
                      className="cursor-pointer flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors w-full text-left"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 bg-rose-50 p-3 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart */}
          <button type="button"
            className="cursor-pointer relative h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-amber-500 hover:bg-slate-100 transition-colors"
            onClick={() => navigator("/cart")}>
            <ShoppingCart size={24} />
            <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-orange-500 text-white text-xs px-1 grid place-items-center font-semibold">
              2
            </span>
          </button>
        </div>
      </div>

      {/* Mobile search overlay */}
      {isMobileSearchOpen && (
        <div className="sm:hidden fixed inset-0 z-50 bg-black/40 p-4">
          <div className="mx-auto h-full max-w-md rounded-xl bg-white p-4 shadow-lg">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Tìm kiếm</span>
              <button type="button" onClick={() => setIsMobileSearchOpen(false)}
                className="rounded-md p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={keyword} onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm thiết bị cần thuê"
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200" />
              {keyword.length > 0 && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full grid place-items-center bg-slate-100 text-slate-500 hover:text-slate-700">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop nav */}
      <nav className="hidden sm:block relative">
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-3 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 text-sm font-semibold text-slate-700">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">Trang Chủ</Link>
            </li>
            <li ref={megaAreaRef} onMouseEnter={() => setIsMegaOpen(true)} onMouseLeave={() => setIsMegaOpen(false)}>
              <button type="button"
                className={`inline-flex items-center gap-2 transition-colors ${isMegaOpen ? "text-blue-600" : "hover:text-blue-600"}`}
                onClick={() => setIsMegaOpen((p) => !p)}
                aria-haspopup="menu" aria-expanded={isMegaOpen}
              >
                Thiết Bị
                <ChevronDown size={14} className={`transition-transform ${isMegaOpen ? "rotate-180" : ""}`} />
              </button>
              {isMegaOpen && (
                <div className="absolute inset-x-0 top-full z-50 -translate-y-2.5"
                  onMouseLeave={() => setIsMegaOpen(false)}>
                  <div className="mx-auto w-[min(1200px,94vw)]">
                    <div className="max-h-[72vh] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 text-slate-700 shadow-lg">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {MEGA_MENU_SECTIONS.map((section) => (
                          <div key={section.title} className="p-4">
                            <p className="mb-3 text-base font-bold text-slate-900">{section.title}</p>
                            <ul className="space-y-2 text-sm text-slate-600">
                              {section.items.map((item) => (
                                <li key={item}>
                                  <Link to="/" className="transition-colors hover:text-blue-600">{item}</Link>
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
            <li><Link to="/" className="hover:text-blue-600 transition-colors">Giới thiệu</Link></li>
            <li><Link to="/" className="hover:text-blue-600 transition-colors">Liên Hệ</Link></li>
          </ul>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <Link to="/" className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600">
            <span>Trang Chủ</span>
          </Link>
          <button type="button" onClick={() => setIsMegaOpen((p) => !p)}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600">
            Thiết Bị
          </button>
          <button type="button" onClick={() => setIsMobileSearchOpen(true)}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600">
            Tìm kiếm
          </button>
          <button type="button" onClick={handleAccountClick}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600">
            Tài khoản
          </button>
          <button type="button" onClick={() => navigator("/cart")}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600 relative">
            Giỏ hàng
          </button>
        </div>
      </nav>
    </header>
  );
}