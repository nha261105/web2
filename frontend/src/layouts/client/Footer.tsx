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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
export default function Footer() {
  return (
    <footer className="bg-[#1e283b] flex flex-col py-5">
      {/* TOP FOOTER */}
      <div className="grid grid-cols-2 gap-6 px-6 mb-4 sm:grid-cols-4 max-w-7xl mx-auto w-full">
        <div className="flex gap-3 items-start">
          <Shield color="#fff" />
          <div className="flex flex-col">
            <b className="text-white">Bảo hiểm</b>
            <span className="text-white text-sm">
              Các sản phẩm đều có bảo hiểm đầy đủ
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <Van color="#fff" />
          <div className="flex flex-col">
            <b className="text-white">Giao hàng nhanh</b>
            <span className="text-white text-sm">Trong ngày HCM/HN/ĐN</span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <RefreshCw color="#fff" />
          <div className="flex flex-col">
            <b className="text-white">Đổi trả dễ dàng</b>
            <span className="text-white text-sm">
              Quá trình đổi-trả nhanh chóng
            </span>
          </div>
        </div>
        <div className="flex gap-3 items-start">
          <Headphones color="#fff" />
          <div className="flex flex-col">
            <b className="text-white">Hỗ trợ 24/7</b>
            <span className="text-white text-sm">Hỗ trợ mọi lúc</span>
          </div>
        </div>
      </div>
      <hr />
      <div className="px-6 py-4 flex flex-col gap-8 md:flex-row md:justify-between max-w-7xl mx-auto w-full">
        {/* INFO FOOTER */}
        <div className="flex flex-col gap-3 max-w-sm">
          <div className="flex items-center gap-2">
            <Factory size={44} color="#1251e5" strokeWidth={2} />
            <span className="text-2xl font-bold text-white hidden sm:block">
              RentalEM
            </span>
          </div>
          <p className="text-white text-sm leading-relaxed">
            Nền tảng đáng tin cậy để cho thuê thiết bị công nghệ chuyên nghiệp.
            Nhận đúng thiết bị bạn cần, đúng thời điểm.
          </p>
          <FieldGroup className="mt-2">
            <Field>
              <FieldLabel htmlFor="footer-mail" className="text-white">
                Email
              </FieldLabel>
              <Input
                id="footer-mail"
                type="email"
                placeholder="name@example.com"
                className="text-white"
              />
            </Field>
            <Button
              type="submit"
              className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
            >
              <Send size={16} />
            </Button>
          </FieldGroup>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold">Contact</h4>
          <div className="flex items-start gap-2 text-white">
            <MapPin size={18} className="mt-0.5" />
            <span>12 Nguyen Hue, Q1, Ho Chi Minh City</span>
          </div>
          <div className="flex items-start gap-2 text-white">
            <Phone size={18} className="mt-0.5" />
            <span>+84 28 1234 5678</span>
          </div>
          <div className="flex items-start gap-2 text-white">
            <Mail size={18} className="mt-0.5" />
            <span>support@rentalem.vn</span>
          </div>
        </div>

        {/* Follow */}
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-semibold">Follow</h4>
          <div className="flex gap-3">
            <button className="text-white hover:text-white transition-colors">
              <Facebook size={20} />
            </button>
            <button className="text-white hover:text-white transition-colors">
              <Instagram size={20} />
            </button>
            <button className="text-white hover:text-white transition-colors">
              <Linkedin size={20} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
