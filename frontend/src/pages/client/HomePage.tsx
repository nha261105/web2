import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductsCard } from "./ProductContext/ProductCard";
import { PRODUCTS, reviews, steps } from "./data";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
} from "lucide-react";

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Tặng kèm hướng dẫn bay cho người mới",
    title: "Bay Cao Hơn\nCùng Drone",
    subtitle: "Thuê drone DJI quay chụp trên không chỉ từ 890.000đ/ngày",
    primaryCta: "Thuê Drone Ngay",
    secondaryCta: "Xem Tất Cả",
    imageUrl:
      "https://i.pinimg.com/736x/79/b0/42/79b04283a0624e302a58fd156ab333a7.jpg",
    bgClass: "bg-[linear-gradient(180deg,#2e7f7a_0%,#1f6f68_54%,#175f5a_100%)]",
  },
  {
    id: 2,
    badge: "Bộ máy quay chuyên nghiệp cho creator",
    title: "Quay Đẹp Hơn\nVới Máy Quay Cinema",
    subtitle: "Combo Sony FX và Canon C-series phù hợp mọi ekip sản xuất",
    primaryCta: "Thuê Máy Quay",
    secondaryCta: "Khám Phá Combo",
    imageUrl:
      "https://i.pinimg.com/736x/6d/25/ba/6d25ba67856e1cc0c55301c1f0a60b95.jpg",
    bgClass: "bg-[linear-gradient(180deg,#2d5d87_0%,#1f4f74_52%,#163e5c_100%)]",
  },
  {
    id: 3,
    badge: "Sẵn sàng livestream chỉ trong 10 phút",
    title: "Lên Sóng Nhanh\nVới Bộ Creator",
    subtitle: "Micro, đèn và switcher chuyên dụng chỉ từ 290.000đ/ngày",
    primaryCta: "Lên Cấu Hình Ngay",
    secondaryCta: "Xem Thiết Bị Audio",
    imageUrl:
      "https://i.pinimg.com/736x/e7/0d/fc/e70dfca256415c558601f07953312df0.jpg",
    bgClass: "bg-[linear-gradient(180deg,#2b7b58_0%,#206645_50%,#184f35_100%)]",
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  const goToNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const goToPrevSlide = () => {
    setActiveSlide(
      (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length,
    );
  };

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans space-y-24">
      <section
        className={`relative isolate overflow-hidden rounded-[32px] px-6 py-14 text-white shadow-2xl sm:px-12 sm:py-20 transition-colors duration-700 ease-in-out ${currentSlide.bgClass}`}
      >
        <div className="absolute inset-y-0 right-0 z-0 hidden w-[58%] overflow-hidden md:block lg:w-[54%]">
          <img
            key={currentSlide.id}
            src={currentSlide.imageUrl}
            alt={currentSlide.title.replace("\n", " ")}
            className="h-full w-full object-cover object-center opacity-30 mix-blend-screen"
          />
        </div>
        <div className="absolute inset-0 z-0 bg-linear-to-r from-black/30 via-black/10 to-transparent" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_75%_38%,rgba(255,255,255,0.16),transparent_42%)]" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_45%_120%,rgba(255,255,255,0.14),transparent_38%)]" />

        <button
          type="button"
          onClick={goToPrevSlide}
          aria-label="Slide trước"
          className="absolute left-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 sm:grid"
        >
          <ChevronLeft size={24} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={goToNextSlide}
          aria-label="Slide sau"
          className="absolute right-6 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 sm:grid"
        >
          <ChevronRight size={24} strokeWidth={2.5} />
        </button>

        <div
          key={currentSlide.id}
          className="relative z-10 max-w-2xl animate-fade-up"
        >
          <p className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold tracking-wide backdrop-blur-md uppercase">
            {currentSlide.badge}
          </p>
          <h1 className="mt-6 whitespace-pre-line text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-7xl">
            {currentSlide.title}
          </h1>
          <p className="mt-6 text-xl text-white/90 font-medium leading-relaxed max-w-xl">
            {currentSlide.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button className="h-14 rounded-xl bg-orange-500 px-8 text-lg font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:-translate-y-0.5">
              {currentSlide.primaryCta}
              <ArrowRight className="ml-2 size-5" />
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-xl border-white/30 bg-white/10 px-8 text-lg font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/50"
            >
              {currentSlide.secondaryCta}
            </Button>
          </div>
        </div>

        <div className="relative z-10 mt-16 flex items-center justify-center gap-3">
          {HERO_SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Chuyển đến slide ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === activeSlide
                  ? "w-10 bg-white"
                  : "w-2.5 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Sản Phẩm Nổi Bật
            </h2>
            <p className="mt-3 text-lg font-medium text-slate-500">
              Những thiết bị được thuê nhiều nhất tuần này cho dự án của bạn.
            </p>
          </div>
          <Button
            variant="ghost"
            className="group text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold text-base h-12 px-6 rounded-xl"
          >
            Xem Toàn Bộ Bộ Sưu Tập
            <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((product) => (
            <ProductsCard
              key={product.id}
              product={product}
              variants="default"
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Button
            size="lg"
            className="h-14 rounded-xl bg-blue-600 px-10 text-lg font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
          >
            Khám Phá Tất Cả Sản Phẩm
            <ArrowRight className="ml-2 size-5" />
          </Button>
        </div>
      </section>

      <section className="rounded-[40px] bg-slate-50 py-20 px-6 sm:px-12">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Quy Trình Thuê Tại RentalTech
          </h2>
          <p className="text-lg font-medium text-slate-500 leading-relaxed">
            Thuê thiết bị công nghệ chưa bao giờ nhanh đến vậy. Hoàn tất chỉ với
            3 bước đơn giản.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-linear-to-r from-blue-100 via-blue-200 to-green-100" />

          {steps.map((step) => (
            <div
              key={step.id}
              className="group relative z-10 rounded-[32px] border border-white bg-white/60 backdrop-blur-sm p-8 text-center shadow-lg shadow-slate-200/40 transition-all duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100 transition-transform group-hover:scale-110">
                <span
                  className={`text-3xl font-extrabold ${
                    step.id === "01"
                      ? "text-blue-600"
                      : step.id === "02"
                        ? "text-orange-500"
                        : "text-emerald-600"
                  }`}
                >
                  {step.id}
                </span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="text-[15px] font-medium leading-relaxed text-slate-500">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-20">
        <div className="mb-14 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-6">
            Được Tin Dùng Bởi Cộng Đồng Sáng Tạo
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-amber-50 border border-amber-100 px-6 py-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-base font-bold text-slate-700">
              4.9/5{" "}
              <span className="text-slate-500 font-medium ml-1">
                từ hơn 2.400 đánh giá
              </span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, index) => (
            <div
              key={r.used_id || index}
              className="relative flex flex-col justify-between rounded-[32px] border border-slate-100 bg-white p-8 shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
            >
              <div>
                <Quote className="absolute right-8 top-8 h-10 w-10 text-slate-100" />
                <div className="mb-5 flex gap-1">
                  {[...Array(r.star)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="relative z-10 text-lg font-medium leading-relaxed text-slate-700">
                  "{r.desc}"
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3 pt-6 border-t border-slate-50">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                  {r.user_name ? r.user_name.charAt(0) : "U"}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    {r.user_name || "Khách hàng đã xác thực"}
                  </p>
                  <p className="text-xs font-medium text-slate-500">
                    Đã thuê qua RentalTech
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
