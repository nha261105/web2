import { Link } from "react-router";

// SHADCN IMPORT
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
// ICON IMPORT
import { Factory, Search, Heart, User, ShoppingCart } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-6 py-3 gap-8 h-16 max-w-7xl mx-auto">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <Factory size={45} color="#1251e5" strokeWidth={2} />
          <span className="text-3xl font-bold text-[#1251e5] hidden sm:block">
            RentalEM
          </span>
        </Link>

        {/* SEARCH - CENTER */}
        <Field className="relative flex-1 max-w-md">
          <InputGroup>
            <InputGroupInput
              id="input-search"
              placeholder="Tìm kiếm sản phẩm...."
            />
            <Search />
          </InputGroup>
        </Field>

        {/* USER: WISHLIST, ACCOUNT, CART */}
        <div className="flex gap-4 ">
          <button className="hover:text-[#e51212] transition-colors">
            <Heart size={24} />
          </button>
          <button className="hover:text-[#0a0af2] transition-colors">
            <User size={24} />
          </button>
          <button className="hover:text-[#e5c912] transition-colors">
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>

      {/* NavBar: TRANG CHỦ, THIẾT BỊ, GIỚI THIỆU, LIÊN HỆ */}
      <nav className="bg-blue-500 px-3 py-3 flex justify-center">
        <ul id="nav" className="flex gap-22.5">
          <li>
            <a href="">Trang Chủ</a>
          </li>
          <li>
            <a href="">Thiết Bị</a>
          </li>
          <li>
            <a href="">Giới thiệu</a>
          </li>
          <li>
            <a href="">Liên Hệ</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
