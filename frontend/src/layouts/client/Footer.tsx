import {
  Shield,
  Van,
  RefreshCw,
  Headphones,
  Factory,
  Send,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { MyInputText } from "@/components/ui/input/my-input-text";

export default function Footer() {
  return (
    <footer className="bg-slate-950 font-sans">
      <div className="border-b border-slate-800/60">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-blue-500 shadow-inner">
              <Shield size={24} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h3 className="mb-1 text-base font-bold text-slate-100">
                Bảo hiểm 100%
              </h3>
              <span className="text-sm font-medium leading-relaxed text-slate-400">
                Mọi sản phẩm đều được bảo vệ toàn diện
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-emerald-500 shadow-inner">
              <Van size={24} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h3 className="mb-1 text-base font-bold text-slate-100">
                Giao hàng hỏa tốc
              </h3>
              <span className="text-sm font-medium leading-relaxed text-slate-400">
                Nhận hàng trong ngày tại HCM/HN/ĐN
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-orange-500 shadow-inner">
              <RefreshCw size={24} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h3 className="mb-1 text-base font-bold text-slate-100">
                Đổi trả linh hoạt
              </h3>
              <span className="text-sm font-medium leading-relaxed text-slate-400">
                Quy trình xử lý nhanh chóng, minh bạch
              </span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-purple-500 shadow-inner">
              <Headphones size={24} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h3 className="mb-1 text-base font-bold text-slate-100">
                Hỗ trợ 24/7
              </h3>
              <span className="text-sm font-medium leading-relaxed text-slate-400">
                Luôn đồng hành cùng bạn mọi lúc
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 lg:flex-row lg:justify-between lg:gap-8">
        {/* Brand & Newsletter (Takes more space) */}
        <div className="flex flex-col gap-6 lg:w-[40%]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
              <Factory size={24} color="#ffffff" strokeWidth={2.5} />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">
              RentalTech
            </span>
          </div>
          <p className="text-base font-medium leading-relaxed text-slate-400 max-w-sm">
            Nền tảng cho thuê thiết bị công nghệ chuyên nghiệp hàng đầu. Nhận
            đúng thiết bị bạn cần, với chất lượng tốt nhất, đúng thời điểm.
          </p>

          <div className="mt-2 w-full max-w-sm">
            <FieldGroup className="flex flex-row w-full items-center gap-2">
              <MyInputText
                defaultValue=""
                placeholder="Nhập email của bạn..."
                className="text-white"
              />
              <Button
                type="submit"
                className="h-11 w-11 flex justify-center items-center rounded-xl bg-blue-600 transition-all hover:bg-blue-700 cursor-pointer"
              >
                <Send size={16} className="text-sm font-bold text-white " />
              </Button>
            </FieldGroup>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:w-[30%]">
          <h4 className="text-lg font-bold tracking-tight text-white">
            Liên hệ
          </h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-start gap-3 group">
              <div className="mt-0.5 text-slate-500 group-hover:text-blue-500 transition-colors">
                <MapPin size={20} />
              </div>
              <span className="text-sm font-medium leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                12 Nguyễn Huệ, Quận 1<br />
                TP. Hồ Chí Minh, Việt Nam
              </span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="text-slate-500 group-hover:text-emerald-500 transition-colors">
                <Phone size={20} />
              </div>
              <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                +84 28 1234 5678
              </span>
            </li>
            <li className="flex items-center gap-3 group">
              <div className="text-slate-500 group-hover:text-orange-500 transition-colors">
                <Mail size={20} />
              </div>
              <a
                href="mailto:support@rentaltech.vn"
                className="text-sm font-medium text-slate-400 group-hover:text-white transition-colors"
              >
                support@rentaltech.vn
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-6 lg:w-[20%]">
          <h4 className="text-lg font-bold tracking-tight text-white">
            Theo dõi chúng tôi
          </h4>
          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1"
            >
              <Facebook size={18} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 transition-all hover:bg-pink-600 hover:text-white hover:border-pink-600 hover:-translate-y-1"
            >
              <Instagram size={18} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-800 text-slate-400 transition-all hover:bg-blue-700 hover:text-white hover:border-blue-700 hover:-translate-y-1"
            >
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/60 bg-slate-950/50">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <p className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} RentalTech. Bảo lưu mọi quyền.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
            >
              Chính sách bảo mật
            </a>
            <a
              href="#"
              className="text-sm font-medium text-slate-500 hover:text-white transition-colors"
            >
              Điều khoản dịch vụ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
