import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getProducts } from "@/services/catalogService";

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

type DeviceSection = {
  category: string;
  products: string[];
};

const DEFAULT_DEVICE_SECTIONS: DeviceSection[] = [
  {
    category: "Laptop văn phòng",
    products: [
      "MacBook Air M2",
      "MacBook Pro M3",
      "Dell XPS 13",
      "HP Spectre x360",
      "Lenovo ThinkPad X1",
    ],
  },
  {
    category: "Laptop gaming",
    products: [
      "ROG Zephyrus G14",
      "ROG Strix G16",
      "MSI Katana 15",
      "Acer Predator Helios",
      "Lenovo Legion 5",
    ],
  },
  {
    category: "Máy ảnh & ống kính",
    products: [
      "Sony A7 IV",
      "Sony FX30",
      "Canon EOS R6",
      "Canon R5",
      "Nikon Z6 II",
    ],
  },
  {
    category: "Drone & gimbal",
    products: [
      "DJI Mini 4 Pro",
      "DJI Air 3",
      "DJI Mavic 3",
      "DJI Avata 2",
      "DJI RS 4",
    ],
  },
  {
    category: "Audio & livestream",
    products: [
      "Rode Wireless Pro",
      "DJI Mic 2",
      "Shure SM7B",
      "Elgato Wave 3",
      "ATEM Mini Pro",
    ],
  },
  {
    category: "Máy chiếu & màn hình",
    products: [
      "BenQ TK700",
      "Epson EH-TW7000",
      "ViewSonic X100",
      "Samsung Smart Monitor",
      "LG UltraFine 32",
    ],
  },
];

export default function Header() {
  const [keyword, setKeyword] = useState("");
  const [isMegaOpen, setIsMegaOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("Người dùng demo");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [deviceSections, setDeviceSections] = useState<DeviceSection[]>(
    DEFAULT_DEVICE_SECTIONS,
  );
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

  useEffect(() => {
    async function loadDeviceSections() {
      try {
        const productItems = await getProducts();

        const grouped = productItems.reduce(
          (acc, product) => {
            const category = product.category || "Thiết bị khác";
            acc[category] = acc[category] || [];
            acc[category].push(product.title);
            return acc;
          },
          {} as Record<string, string[]>,
        );

        const sections = Object.entries(grouped)
          .map(([category, products]) => ({
            category,
            products: Array.from(new Set(products)).slice(0, 8),
          }))
          .sort((a, b) => a.category.localeCompare(b.category, "vi"));

        if (sections.length > 0) {
          setDeviceSections(sections);
        }
      } catch {
        setDeviceSections(DEFAULT_DEVICE_SECTIONS);
      }
    }

    void loadDeviceSections();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur supports-backdrop-filter:bg-white/85">
      {/* TOP BAR */}
      <div className="mx-auto flex h-20 max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 shrink-0 z-10">
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

        <div className="hidden md:flex flex-1 justify-center min-w-0 px-2">
          <form
            className="group w-full max-w-2xl"
            onSubmit={(event) => event.preventDefault()}
            role="search"
            aria-label="Tìm kiếm sản phẩm"
          >
            <div className="relative w-full">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <input
                id="input-search"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="Tìm thiết bị cần thuê (laptop, máy ảnh, drone...)"
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto z-10">
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
                        navigator("/signin");
                        setIsAccountOpen(false);
                      }}
                      className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      Đăng nhập
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator("/signup");
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
                      <p className="text-xs text-slate-500">
                        demo@rentaltech.vn
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
                    <button
                      type="button"
                      onClick={() => {
                        setIsLoggedIn(false);
                        setIsAccountOpen(false);
                      }}
                      className="flex w-full items-center justify-center gap-2 bg-rose-50 p-3 text-sm font-semibold text-rose-600 hover:bg-rose-100 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
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
              navigator("/cart");
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
                Trang chủ
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
                      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {deviceSections.map((section) => (
                          <div
                            key={section.category}
                            className="rounded-2xl bg-slate-50/90 p-4 shadow-sm"
                          >
                            <p className="mb-3 text-base font-bold text-slate-900">
                              {section.category}
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600">
                              {section.products.map((item) => (
                                <li key={item}>
                                  <Link
                                    to="/products"
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
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </nav>

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
            {deviceSections.map((section) => (
              <div
                key={section.category}
                className="rounded-xl bg-slate-50/95 p-3 shadow-sm"
              >
                <p className="mb-2 text-sm font-semibold text-slate-800">
                  {section.category}
                </p>
                <div className="flex flex-wrap gap-2">
                  {section.products.map((product) => (
                    <Link
                      key={product}
                      to="/products"
                      onClick={() => setIsMegaOpen(false)}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200/80 hover:ring-blue-200 hover:text-blue-600"
                    >
                      {product}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur-md supports-backdrop-filter:bg-white/90">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-300/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl grid-cols-5 gap-1 px-2 pt-1.5 pb-2">
          <Link
            to="/"
            className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
          >
            Trang chủ
          </Link>
          <button
            type="button"
            onClick={() => setIsMegaOpen((prev) => !prev)}
            className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium transition-colors hover:bg-slate-100 active:scale-[0.98] ${isMegaOpen ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:text-blue-600"}`}
            aria-label="Danh mục thiết bị"
          >
            Thiết bị
          </button>
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
            aria-label="Tìm kiếm"
          >
            Tìm kiếm
          </button>
          <button
            type="button"
            onClick={() => navigator("/account?tab=profile")}
            className="flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
            aria-label="Tài khoản"
          >
            Tài khoản
          </button>
          <button
            type="button"
            onClick={() => navigator("/cart")}
            className="relative flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-blue-600 active:scale-[0.98]"
            aria-label="Giỏ hàng"
          >
            Giỏ hàng
          </button>
        </div>
      </nav>
    </header>
  );
}
