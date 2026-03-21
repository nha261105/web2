import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

// ICON IMPORT
import {
  Search,
  Heart,
  User,
  ShoppingCart,
  X,
  ChevronDown,
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
  const megaAreaRef = useRef<HTMLLIElement | null>(null);

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

        <div className="flex-1 max-w-3xl">
          <form
            className="group flex items-center gap-2"
            onSubmit={(event) => event.preventDefault()}
            role="search"
            aria-label="Tìm kiếm sản phẩm"
          >
            <div className="relative flex-1">
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
                    className="h-7 w-7 rounded-full grid place-items-center text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    aria-label="Xóa nội dung tìm kiếm"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="hidden sm:inline-flex h-12 items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className="flex gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-rose-500 hover:bg-slate-100 transition-colors"
            aria-label="Danh sách yêu thích"
          >
            <Heart size={24} />
          </button>
          <button
            type="button"
            className="h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition-colors"
            aria-label="Tài khoản"
          >
            <User size={24} />
          </button>
          <button
            type="button"
            className="relative h-10 w-10 rounded-full grid place-items-center text-slate-600 hover:text-amber-500 hover:bg-slate-100 transition-colors"
            aria-label="Giỏ hàng"
          >
            <ShoppingCart size={24} />
            <span className="absolute -right-1 -top-1 min-w-5 h-5 rounded-full bg-orange-500 text-white text-xs px-1 grid place-items-center font-semibold">
              2
            </span>
          </button>
        </div>
      </div>
      <nav className="relative">
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
                    <div className="max-h-[72vh] overflow-y-auto rounded-[16px] border border-slate-100 bg-white p-6 text-slate-700 shadow-lg">
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
    </header>
  );
}
