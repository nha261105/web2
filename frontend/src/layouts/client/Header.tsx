import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";

// ICON IMPORT
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
  //   ArrowRight,
} from "lucide-react";

const MEGA_MENU_SECTIONS = [
  {
    title: "LAPTOP VĂN PHÒNG",
    items: [
      "MacBook Air M2",
      "MacBook Pro M3",
      "Dell XPS 13",
      "HP Spectre x360",
      "Lenovo ThinkPad X1",
      "ASUS Zenbook 14",
      "Acer Swift 5",
      "Surface Laptop 6",
      "LG Gram 16",
    ],
  },
  {
    title: "LAPTOP GAMING",
    items: [
      "ROG Zephyrus G14",
      "ROG Strix G16",
      "MSI Katana 15",
      "Acer Predator Helios",
      "Lenovo Legion 5",
      "HP Omen 16",
      "Alienware m16",
      "Gigabyte Aorus 15",
      "Dell G15",
    ],
  },
  {
    title: "MÁY ẢNH & LEN",
    items: [
      "Sony A7 IV",
      "Sony FX30",
      "Canon EOS R6",
      "Canon R5",
      "Nikon Z6 II",
      "Fujifilm X-T5",
      "24-70mm f/2.8",
      "70-200mm f/2.8",
      "16-35mm f/4",
    ],
  },
  {
    title: "DRONE & GIMBAL",
    items: [
      "DJI Mini 4 Pro",
      "DJI Air 3",
      "DJI Mavic 3",
      "DJI Avata 2",
      "DJI RS 4",
      "DJI RS 4 Pro",
      "Zhiyun Crane 4",
      "Insta360 Flow Pro",
      "Hohem iSteady M7",
    ],
  },
  {
    title: "AUDIO & STREAMING",
    items: [
      "Rode Wireless Pro",
      "DJI Mic 2",
      "Shure SM7B",
      "Elgato Wave 3",
      "Elgato Facecam Pro",
      "ATEM Mini Pro",
      "GoXLR Mini",
      "Stream Deck MK.2",
      "Neewer Key Light",
    ],
  },
  {
    title: "MÁY CHIẾU & MÀN HÌNH",
    items: [
      "BenQ TK700",
      "Epson EH-TW7000",
      "ViewSonic X100",
      "Samsung Smart Monitor",
      "LG UltraFine 32",
      "Dell 4K 27",
      "Màn chiếu 120 inch",
      "Giá treo máy chiếu",
      "Bộ chuyển HDMI",
    ],
  },
];

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Demo User");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const megaAreaRef = useRef<HTMLLIElement | null>(null);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const navigator = useNavigate();

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=2563eb&color=ffffff&size=128`;

  const clearSearch = () => setKeyword("");

  useEffect(() => {
    if (!isMegaOpen) return;

    const handleMouseMove = (event: MouseEvent) => {
      const target = event.target as Node;
      if (megaAreaRef.current && !megaAreaRef.current.contains(target)) {
        setIsMegaOpen(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isMegaOpen]);

  useEffect(() => {
    if (!isAccountOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAccountOpen]);

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

        <div className="hidden sm:block flex-1 max-w-3xl">
          <form
            className="group flex items-center gap-2"
            onSubmit={(event) => event.preventDefault()}
            role="search"
            aria-label="Tìm kiếm sản phẩm"
          >
            <div className="relative flex-1 max-w-xl">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                id="input-search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm thiết bị cần thuê (laptop, camera, drone...)"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-24 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {keyword.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="h-7 w-7 rounded-full grid place-items-center bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 transition-colors"
                    aria-label="Xóa nội dung tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2 sm:hidden">
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

        <div className="flex gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition-colors"
            aria-label="Danh sách yêu thích"
          >
            <Heart size={24} />
          </button>
          <div ref={accountMenuRef} className="relative">
            <button
              type="button"
              className="cursor-pointer h-10 min-w-10 rounded-full px-2 flex items-center gap-2 text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              aria-label="Tài khoản"
              aria-expanded={isAccountOpen}
              onClick={() => setIsAccountOpen((prev) => !prev)}
            >
              {isLoggedIn ? (
                <>
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <span className="hidden sm:inline-block text-sm font-medium">
                    {username}
                  </span>
                </>
              ) : (
                <User size={24} />
              )}
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 top-full mt-3 w-64 rounded-lg border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-50 overflow-clip">
                {!isLoggedIn ? (
                  <div className="flex flex-col p-4 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setUsername("Demo User");
                        setIsAccountOpen(false);
                      }}
                      className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Đăng nhập
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(true);
                        setUsername("Demo User");
                        setIsAccountOpen(false);
                      }}
                      className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Tạo tài khoản
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="bg-slate-50 px-4 py-4">
                      <p className="text-sm font-semibold text-slate-900">
                        {username}
                      </p>
                      <p className="text-xs text-slate-500">user@demo.com</p>
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
                        My Profile
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
                        My Orders
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
                        Settings
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsAccountOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 bg-rose-50 p-3 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          <button
            type="button"
            className="cursor-pointer relative h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-amber-500 hover:bg-slate-100 transition-colors"
            aria-label="Giỏ hàng"
            onClick={() => {
              navigator("/cart/tab?");
            }}
          >
            <ShoppingCart size={24} />
            <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-orange-500 text-white text-xs px-1 grid place-items-center font-semibold">
              2
            </span>
          </button>
        </div>
      </div>

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
                aria-label="Đóng tìm kiếm"
              >
                <X size={20} />
              </button>
            </div>
            <form
              className="flex items-center gap-2"
              onSubmit={(event) => event.preventDefault()}
              role="search"
              aria-label="Tìm kiếm sản phẩm"
            >
              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="mobile-input-search"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm thiết bị cần thuê"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-10 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
                />
                {keyword.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-700 hover:bg-slate-200"
                    aria-label="Xóa nội dung tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      <nav className="hidden sm:block relative">
        <div className="mx-auto flex max-w-7xl justify-center px-4 py-3 sm:px-6 lg:px-8">
          <ul
            id="nav"
            className="flex items-center gap-8 text-sm font-semibold text-slate-700"
          >
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Trang Chủ
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
                onClick={() => setIsMegaOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isMegaOpen}
              >
                Thiết Bị
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
                    <div className="max-h-[72vh] overflow-y-auto rounded-3xl border border-slate-100 bg-white p-6 text-slate-700 shadow-lg">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {MEGA_MENU_SECTIONS.map((section) => (
                          <div key={section.title} className="p-4">
                            <p className="mb-3 text-base font-bold text-slate-900">
                              {section.title}
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600">
                              {section.items.map((item) => (
                                <li key={item}>
                                  <Link
                                    to="/"
                                    className="transition-colors hover:text-blue-600"
                                  >
                                    {item}
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
                Liên Hệ
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <Link
            to="/"
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600"
          >
            <span>Trang Chủ</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMegaOpen((prev) => !prev)}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600"
            aria-label="Danh mục thiết bị"
          >
            Thiết Bị
          </button>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600"
            aria-label="Tìm kiếm"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={() => navigator("/account?tab=profile")}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600"
            aria-label="Tài khoản"
          >
            Tài khoản
          </button>
          <button
            type="button"
            onClick={() => navigator("/cart")}
            className="flex flex-col items-center text-xs text-slate-600 hover:text-blue-600 relative"
            aria-label="Giỏ hàng"
          >
            Giỏ hàng
          </button>
        </div>
      </nav>
    </header>
  );
}
