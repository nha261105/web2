import {
  Shield,
  Headphones,
  Send,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  ArrowRight,
  Award,
  Star,
  CreditCard,
  Truck,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { MyInputText } from "@/components/ui/input/my-input-text";

const FOOTER_LINKS = {
  products: [
    { name: "Laptop & Máy tính", href: "/products?category=laptops" },
    { name: "Máy ảnh & Ống kính", href: "/products?category=cameras" },
    { name: "Drone & Gimbal", href: "/products?category=drones" },
    { name: "Audio & Âm thanh", href: "/products?category=audio" },
    { name: "VR & AR", href: "/products?category=vr" },
    { name: "Phụ kiện", href: "/products?category=accessories" },
  ],
  services: [
    { name: "Thuê theo ngày", href: "/services/daily" },
    { name: "Thuê dài hạn", href: "/services/longterm" },
    { name: "Dịch vụ setup", href: "/services/setup" },
    { name: "Bảo hiểm thiết bị", href: "/services/insurance" },
    { name: "Vận chuyển", href: "/services/shipping" },
  ],
  support: [
    { name: "Hướng dẫn thuê", href: "/help/guide" },
    { name: "Câu hỏi thường gặp", href: "/help/faq" },
    { name: "Chính sách đổi trả", href: "/help/return-policy" },
    { name: "Bảo hành", href: "/help/warranty" },
    { name: "Liên hệ hỗ trợ", href: "/contact" },
  ],
  company: [
    { name: "Về RentalTech", href: "/about" },
    { name: "Tuyển dụng", href: "/careers" },
    { name: "Tin tức", href: "/news" },
    { name: "Đối tác", href: "/partners" },
    { name: "Chương trình liên kết", href: "/affiliate" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-slate-950 font-sans">
      {/* Top Benefits Section */}
      <div className="relative bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 pb-px">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-slate-600/35 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-extrabold text-white mb-4">
              Phục vụ mọi hình thức thuê
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Doanh nghiệp, creator, đơn vị sự kiện hay cá nhân — đều có lộ trình
              thuê và hỗ trợ riêng, rõ ràng từ báo giá đến giao nhận.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group text-center">
              <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Shield size={28} strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-100 group-hover:text-blue-300 transition-colors">
                Bảo hiểm 100%
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-400">
                Mọi sản phẩm đều được bảo vệ toàn diện, hoàn tiền nếu có sự cố
              </p>
            </div>

            <div className="group text-center">
              <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-emerald-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Truck size={28} strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                Giao nhận nhanh
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-400">
                Giao hàng trong 2h tại HCM/HN, toàn quốc trong 24h
              </p>
            </div>

            <div className="group text-center">
              <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-2xl bg-linear-to-br from-orange-500 to-orange-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Award size={28} strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-100 group-hover:text-orange-300 transition-colors">
                Chất lượng đảm bảo
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-400">
                Thiết bị chính hãng, kiểm tra kỹ lưỡng trước khi giao
              </p>
            </div>

            <div className="group text-center">
              <div className="flex h-16 w-16 mx-auto mb-4 items-center justify-center rounded-2xl bg-linear-to-br from-purple-500 to-purple-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Headphones size={28} strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-100 group-hover:text-purple-300 transition-colors">
                Hỗ trợ chuyên nghiệp
              </h3>
              <p className="text-sm font-medium leading-relaxed text-slate-400">
                Đội ngũ kỹ thuật viên hỗ trợ 24/7, tư vấn miễn phí
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-600/20">
                <span className="text-lg font-extrabold tracking-wide">RT</span>
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-white">
                  RentalTech
                </p>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Thuê nhanh, dùng chuẩn
                </p>
              </div>
            </div>
            
            <p className="text-base font-medium leading-relaxed text-slate-400 mb-6 max-w-md">
              Nền tảng cho thuê thiết bị công nghệ chuyên nghiệp hàng đầu Việt Nam. 
              Phục vụ hơn 10,000+ khách hàng với đa dạng thiết bị chất lượng cao.
            </p>

            {/* Newsletter */}
            <div className="mb-6">
              <h4 className="text-lg font-bold text-white mb-3">Nhận tin tức mới nhất</h4>
              <FieldGroup className="flex flex-row w-full items-center gap-2 max-w-sm">
                <MyInputText
                  defaultValue=""
                  placeholder="Nhập email của bạn..."
                  className="text-white bg-slate-800 border-slate-700 focus:border-blue-500"
                />
                <Button
                  type="submit"
                  className="h-11 w-11 flex justify-center items-center rounded-xl bg-linear-to-r from-blue-600 to-blue-700 transition-all hover:from-blue-700 hover:to-blue-800 hover:scale-105"
                >
                  <Send size={16} className="text-white" />
                </Button>
              </FieldGroup>
              <p className="mt-3 text-xs text-slate-500">
                Ưu đãi độc quyền, thiết bị mới và tips hữu ích mỗi tuần.
              </p>
            </div>

            {/* Customer Rating */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div>
                <p className="text-sm font-bold text-white">4.9/5</p>
                <p className="text-xs text-slate-400">2,400+ đánh giá</p>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Sản phẩm</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.products.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Dịch vụ</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Hỗ trợ</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Contact */}
          <div>
            <h4 className="text-lg font-bold text-white mb-6">Công ty</h4>
            <ul className="space-y-3 mb-6">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 group">
                <div className="mt-0.5 text-slate-500 group-hover:text-blue-500 transition-colors">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Trụ sở chính</p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    12 Nguyễn Huệ, Quận 1<br />TP. Hồ Chí Minh
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="text-slate-500 group-hover:text-emerald-500 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Hotline</p>
                  <p className="text-sm text-slate-400">1900 1234</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 group">
                <div className="text-slate-500 group-hover:text-orange-500 transition-colors">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-300">Email</p>
                  <a
                    href="mailto:support@rentaltech.vn"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    support@rentaltech.vn
                  </a>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mt-6">
              <h5 className="text-sm font-bold text-white mb-3">Mạng xã hội</h5>
              <div className="flex gap-3">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/90 text-slate-400 shadow-inner shadow-black/25 ring-1 ring-white/5 transition-all hover:bg-blue-600 hover:text-white hover:ring-blue-500/40 hover:-translate-y-0.5"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/90 text-slate-400 shadow-inner shadow-black/25 ring-1 ring-white/5 transition-all hover:bg-linear-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:ring-pink-400/40 hover:-translate-y-0.5"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="#"
                  aria-label="YouTube"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/90 text-slate-400 shadow-inner shadow-black/25 ring-1 ring-white/5 transition-all hover:bg-red-600 hover:text-white hover:ring-red-500/40 hover:-translate-y-0.5"
                >
                  <Youtube size={18} />
                </a>
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/90 text-slate-400 shadow-inner shadow-black/25 ring-1 ring-white/5 transition-all hover:bg-blue-700 hover:text-white hover:ring-blue-400/40 hover:-translate-y-0.5"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="relative bg-slate-950">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-600/50 to-transparent" />
        <div className="mx-auto max-w-7xl px-6 py-8">
          {/* Payment Methods & Certifications */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 mb-6">
            <div className="w-full lg:w-auto">
              <p className="text-sm font-medium text-slate-400 mb-3">Phương thức thanh toán</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex h-9 items-center justify-center rounded-lg bg-slate-800/90 px-3 shadow-inner shadow-black/20 ring-1 ring-white/5">
                  <CreditCard size={16} className="text-slate-400" />
                </div>
                <div className="flex h-9 min-w-[3.25rem] items-center justify-center rounded-lg bg-slate-800/90 px-3 text-xs font-bold text-slate-400 shadow-inner shadow-black/20 ring-1 ring-white/5">
                  VISA
                </div>
                <div className="flex h-9 min-w-[3.25rem] items-center justify-center rounded-lg bg-slate-800/90 px-3 text-xs font-bold text-slate-400 shadow-inner shadow-black/20 ring-1 ring-white/5">
                  MC
                </div>
                <div className="flex h-9 min-w-[3.25rem] items-center justify-center rounded-lg bg-slate-800/90 px-3 text-xs font-bold text-slate-400 shadow-inner shadow-black/20 ring-1 ring-white/5">
                  Momo
                </div>
              </div>
            </div>
            
            <div className="hidden h-12 w-px bg-linear-to-b from-transparent via-slate-600/40 to-transparent lg:block" aria-hidden />
            
            <div className="w-full lg:w-auto">
              <p className="text-sm font-medium text-slate-400 mb-3">Chứng nhận & Bảo mật</p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-800/90 px-3 py-2 shadow-inner shadow-black/20 ring-1 ring-white/5">
                  <Shield size={16} className="text-emerald-400" />
                  <span className="text-xs font-medium text-slate-400">SSL Secure</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-800/90 px-3 py-2 shadow-inner shadow-black/20 ring-1 ring-white/5">
                  <Award size={16} className="text-blue-400" />
                  <span className="text-xs font-medium text-slate-400">Verified</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Copyright & Legal Links */}
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4 pt-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-600/45 to-transparent" />
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <p className="text-sm font-medium text-slate-500">
                © {new Date().getFullYear()} RentalTech JSC. All rights reserved.
              </p>
              <p className="text-xs text-slate-600">
                Giấy phép kinh doanh số: 0123456789 do Sở KH&ĐT TP.HCM cấp
              </p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              <a
                href="/privacy-policy"
                className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
              >
                Chính sách bảo mật
              </a>
              <a
                href="/terms-of-service"
                className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
              >
                Điều khoản dịch vụ
              </a>
              <a
                href="/cookie-policy"
                className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
              >
                Chính sách Cookie
              </a>
              <a
                href="/return-policy"
                className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
              >
                Chính sách đổi trả
              </a>
            </div>
          </div>
          
          {/* Additional Info */}
          <div className="relative mt-6 pt-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-slate-600/40 to-transparent" />
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-xs text-slate-600 leading-relaxed">
                  RentalTech là nền tảng cho thuê thiết bị công nghệ hàng đầu Việt Nam, được thành lập từ 2020. 
                  Chúng tôi cam kết mang đến trải nghiệm thuê thiết bị tốt nhất với hơn 500+ sản phẩm chất lượng cao 
                  từ các thương hiệu uy tín trên thế giới.
                </p>
              </div>
              
              <div className="text-right">
                <p className="text-xs text-slate-600">
                  Được thiết kế và phát triển tại Việt Nam 🇻🇳
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Version 2.1.0 - Build 2026.03.29
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
