import { useState } from "react";
import { Link } from "react-router";

// ICON IMPORT
import {
  Search,
  Heart,
  User,
  ShoppingCart,
  X,
  ChevronDown,
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

  const clearSearch = () => setKeyword("");

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 py-3 gap-4 h-20 max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="h-11 w-11 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center">
            RT
          </div>
          <span className="text-2xl font-bold text-blue-700 hidden sm:block">
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
                className="h-12 w-full rounded-xl border border-slate-300 bg-slate-50 pl-12 pr-24 text-[15px] text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-200"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {keyword.length > 0 && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="h-7 w-7 rounded-full grid place-items-center text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
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

      <nav className="relative bg-blue-600 text-white">
        <div className="mx-auto flex max-w-7xl justify-center px-3 py-3 sm:px-6 lg:px-8">
          <ul
            id="nav"
            className="flex flex-wrap justify-center gap-6 sm:gap-10 text-sm sm:text-base font-medium"
          >
            <li>
              <Link to="/" className="hover:underline underline-offset-4">
                Trang Chủ
              </Link>
            </li>
            <li
              className="relative"
              onMouseEnter={() => setIsMegaOpen(true)}
              onMouseLeave={() => setIsMegaOpen(false)}
            >
              <button
                type="button"
                className="inline-flex items-center gap-1 hover:underline underline-offset-4"
                onClick={() => setIsMegaOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isMegaOpen}
              >
                Thiết Bị
                <ChevronDown
                  size={16}
                  className={`transition-transform ${isMegaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isMegaOpen && (
                <div className="absolute left-1/2 top-full z-50 w-[min(1200px,96vw)] -translate-x-1/2 pt-3">
                  <div className="max-h-[68vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-2xl">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                      {MEGA_MENU_SECTIONS.map((section) => (
                        <div key={section.title}>
                          <p className="mb-2 border-b border-slate-200 pb-2 text-lg font-semibold text-orange-600">
                            {section.title}
                          </p>
                          <ul className="space-y-1.5 text-[16px]">
                            {section.items.map((item) => (
                              <li key={item}>
                                <Link
                                  to="/"
                                  className="text-slate-600 transition-colors hover:text-blue-600"
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                          <Link
                            to="/"
                            className="mt-2 inline-block text-lg font-medium text-orange-600 hover:underline"
                          >
                            Xem thêm
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
            <li>
              <Link to="/" className="hover:underline underline-offset-4">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:underline underline-offset-4">
                Liên Hệ
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
