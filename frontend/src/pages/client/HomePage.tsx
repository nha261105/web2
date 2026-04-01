import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ProductsCard } from "./ProductContext/ProductCard";
import { reviews, steps } from "./data";
import type { Product } from "./data";
import { getCategories, getProducts } from "@/services/catalogService";
import { addToCart } from "@/services/cartService";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
  Package,
  CheckCircle,
  Heart,
  ChevronDown,
} from "lucide-react";

/** File đặt trong `public/` — tên dài được encode an toàn cho URL */
const SERVICE_EXPERIENCE_VIDEO =
  "/" +
  encodeURIComponent(
    "From KlickPin CF Mattia Giannattasio on Instagram tools come and go but i always end up using more than one from notebooks to ipads cameras to voice notes i like building … [Video] [Video] _ Filmmaking inspir.mp4",
  );

const HERO_SLIDES = [
  {
    id: 1,
    badge: "Tặng kèm hướng dẫn bay cho người mới",
    title: "Bay Cao Hơn Cùng Drone",
    subtitle:
      "Thuê drone DJI quay chụp trên không với mức giá linh hoạt theo ngày, phù hợp từ cá nhân đến ekip chuyên nghiệp.",
    primaryCta: "Thuê Drone Ngay",
    secondaryCta: "Xem tất cả sản phẩm",
    imageUrl:
      "https://i.pinimg.com/736x/79/b0/42/79b04283a0624e302a58fd156ab333a7.jpg",
    bgClass: "from-[#1f6f68] via-[#175f5a] to-[#134a46]",
  },
  {
    id: 2,
    badge: "Bộ máy quay chuyên nghiệp cho creator",
    title: "Quay Đẹp Hơn Với Máy Quay Cinema",
    subtitle:
      "Combo Sony FX và Canon C-series giúp ekip tối ưu chi phí mà vẫn đảm bảo chất lượng hình ảnh cao.",
    primaryCta: "Thuê Máy Quay",
    secondaryCta: "Khám phá combo",
    imageUrl:
      "https://i.pinimg.com/736x/6d/25/ba/6d25ba67856e1cc0c55301c1f0a60b95.jpg",
    bgClass: "from-[#1f4f74] via-[#163e5c] to-[#112f46]",
  },
  {
    id: 3,
    badge: "Sẵn sàng livestream chỉ trong 10 phút",
    title: "Lên Sóng Nhanh Với Bộ Creator",
    subtitle:
      "Micro, đèn và switcher chuyên dụng giúp bạn bắt đầu livestream chuyên nghiệp trong vài phút.",
    primaryCta: "Lên Cấu Hình Ngay",
    secondaryCta: "Xem thiết bị audio",
    imageUrl:
      "https://i.pinimg.com/736x/e7/0d/fc/e70dfca256415c558601f07953312df0.jpg",
    bgClass: "from-[#206645] via-[#184f35] to-[#123b29]",
  },
];

const RENTAL_GALLERY = [
  {
    src: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
    alt: "Sự kiện hội nghị",
    caption: "Hội nghị & sự kiện doanh nghiệp",
  },
  {
    src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    alt: "Chụp cưới",
    caption: "Chụp ảnh – quay phim cưới",
  },
  {
    src: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
    alt: "Quay phim studio",
    caption: "Studio & sản xuất nội dung",
  },
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    alt: "Livestream",
    caption: "Livestream & truyền hình",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
    alt: "Sự kiện âm nhạc",
    caption: "Âm nhạc & festival",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80",
    alt: "Giáo dục",
    caption: "Đào tạo & workshop",
  },
];

const FAQ_ITEMS = [
  {
    q: "Thuê tối thiểu bao nhiêu ngày?",
    a: "Hầu hết thiết bị cho thuê từ 1 ngày. Một số dòng chuyên dụng có thể yêu cầu tối thiểu 3 ngày — bạn sẽ thấy rõ khi đặt hàng.",
  },
  {
    q: "Có cọc hay giấy tờ gì không?",
    a: "Có khoản cọc theo giá trị thiết bị, hoàn lại khi trả đúng hạn và tình trạng thiết bị tốt. CMND/CCCD hoặc giấy phép kinh doanh (B2B) để xác minh.",
  },
  {
    q: "Giao nhận ở đâu?",
    a: "Giao tận nơi tại TP.HCM, Hà Nội, Đà Nẵng và ship toàn quốc. Bạn có thể chọn khung giờ phù hợp khi đặt.",
  },
  {
    q: "Thiết bị lỗi giữa chừng thì sao?",
    a: "Liên hệ hotline — chúng tôi hỗ trợ đổi thiết bị tương đương hoặc hoàn tiền theo chính sách từng đơn.",
  },
  {
    q: "Có hỗ trợ hướng dẫn sử dụng không?",
    a: "Có. Nhiều mặt hàng kèm hướng dẫn nhanh; cần sâu hơn có thể book tư vấn online hoặc tại cửa hàng.",
  },
];

const BRANDS = [
  { name: "Apple" },
  { name: "Sony" },
  { name: "Canon" },
  { name: "DJI" },
  { name: "Meta" },
  { name: "Nikon" },
];

/** Đường chia section: mờ hai đầu, đậm nhẹ ở giữa — không đổi màu nền */
function SectionDivider() {
  return (
    <div
      className="flex w-full justify-center py-8 sm:py-10"
      aria-hidden="true"
    >
      <div className="h-px w-[85%] max-w-4xl bg-linear-to-r from-transparent via-slate-400/18 to-transparent sm:max-w-5xl" />
    </div>
  );
}

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [animateFeatured, setAnimateFeatured] = useState(false);
  const [animateGallery, setAnimateGallery] = useState(false);
  const [serviceVideoSrc, setServiceVideoSrc] = useState<string | null>(null);
  const serviceExperienceSectionRef = useRef<HTMLElement | null>(null);
  const serviceVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => {
      if (timer) {
        window.clearInterval(timer);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return;

      if (!animateGallery) {
        const gallerySection = document.getElementById("gallery-section");
        if (gallerySection) {
          const rect = gallerySection.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.7) {
            setAnimateGallery(true);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [animateGallery]);

  /** Bước 1: chỉ tải file video khi section sắp vào màn hình */
  useEffect(() => {
    const section = serviceExperienceSectionRef.current;
    if (!section || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setServiceVideoSrc(SERVICE_EXPERIENCE_VIDEO);
        }
      },
      { rootMargin: "140px 0px", threshold: 0 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /** Bước 2: phát / tạm dừng theo visibility (tiết kiệm CPU khi cuộn xuống) */
  useEffect(() => {
    if (!serviceVideoSrc) return;
    const section = serviceExperienceSectionRef.current;
    const video = serviceVideoRef.current;
    if (!section || !video || typeof IntersectionObserver === "undefined")
      return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "0px", threshold: 0.15 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [serviceVideoSrc]);

  useEffect(() => {
    async function loadCatalogData() {
      try {
        const [categoryItems, productItems] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(
          categoryItems?.map((item) => ({ id: item.id, name: item.name })) ||
            [],
        );
        setProducts(productItems || []);

        setTimeout(() => {
          setAnimateFeatured(true);
        }, 100);
      } catch (error) {
        console.warn("Failed to load catalog data:", error);
        setCategories([]);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    }

    loadCatalogData();
  }, []);

  const visibleProducts = selectedCategoryId
    ? products.filter((product) => {
        const category = categories.find(
          (item) => item.name.toLowerCase() === product.category.toLowerCase(),
        );
        return category?.id === selectedCategoryId;
      })
    : products;

  const featuredProducts = visibleProducts.slice(0, 8);

  const handleAddToCart = async (product: Product) => {
    const response = await addToCart({
      product_id: Number(product.id),
      quantity: 1,
      rental_days: 1,
    });

    if (response.success) {
      toast.success("Đã thêm sản phẩm vào giỏ hàng");
    } else {
      toast.error(response.message || "Thêm vào giỏ hàng thất bại");
    }
  };

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
    <div className="w-full bg-[#fafafa]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 font-sans">
        {/* Hero Section */}
        <section
          className={`relative isolate overflow-hidden rounded-[32px] px-6 py-14 text-white shadow-2xl transition-colors duration-700 ease-in-out sm:px-10 sm:py-16 lg:px-12 lg:py-20 bg-linear-to-br ${currentSlide.bgClass}`}
        >
          <div className="absolute inset-y-0 right-0 z-0 hidden w-[54%] overflow-hidden lg:block">
            <img
              key={currentSlide.id}
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="h-full w-full object-cover object-center opacity-35"
            />
          </div>
          <div className="absolute inset-0 z-0 bg-linear-to-r from-black/35 via-black/15 to-transparent" />
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_70%_35%,rgba(255,255,255,0.14),transparent_42%)]" />

          <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse hidden md:block" />
          <div
            className="absolute top-40 right-32 w-3 h-3 bg-white/10 rounded-full animate-bounce hidden md:block"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-white/15 rounded-full animate-pulse hidden md:block"
            style={{ animationDelay: "1s" }}
          />

          <div className="relative z-10 max-w-3xl lg:max-w-[46%]">
            <p className="inline-flex rounded-full bg-white/20 px-4 py-1.5 text-sm font-bold tracking-wide uppercase">
              {currentSlide.badge}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              {currentSlide.title}
            </h1>
            <p className="mt-5 text-base font-medium leading-relaxed text-white/90 sm:text-lg">
              {currentSlide.subtitle}
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/products">
                <Button className="h-12 rounded-xl bg-orange-500 px-6 text-base font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:bg-orange-600 hover:-translate-y-0.5">
                  {currentSlide.primaryCta}
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button
                  variant="outline"
                  className="h-12 rounded-xl border-white/30 bg-white/10 px-6 text-base font-bold text-white transition-all hover:bg-white/20 hover:border-white/50"
                >
                  {currentSlide.secondaryCta}
                </Button>
              </Link>
            </div>
          </div>

          <button
            type="button"
            onClick={goToPrevSlide}
            aria-label="Slide trước"
            className="absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 md:grid"
          >
            <ChevronLeft size={24} strokeWidth={2.5} />
          </button>

          <button
            type="button"
            onClick={goToNextSlide}
            aria-label="Slide sau"
            className="absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30 active:scale-95 md:grid"
          >
            <ChevronRight size={24} strokeWidth={2.5} />
          </button>

          <div className="relative z-10 mt-12 flex items-center justify-center gap-3">
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

        <SectionDivider />

        {/* Trải nghiệm dịch vụ — video lazy; nền đồng bộ, không khối màu */}
        <section ref={serviceExperienceSectionRef} className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 lg:items-center">
              {/* Video — tối ưu: preload none, muted loop, chỉ gắn src khi gần viewport */}
              <div className="lg:col-span-7 order-2 lg:order-1">
                <div className="relative mx-auto w-full max-w-3xl lg:max-w-none">
                  <div className="relative overflow-hidden rounded-2xl bg-slate-950 shadow-[0_24px_60px_-16px_rgba(15,23,42,0.35)]">
                    <div className="aspect-video w-full">
                      <video
                        ref={serviceVideoRef}
                        src={serviceVideoSrc ?? undefined}
                        className="h-full w-full object-cover"
                        muted
                        playsInline
                        loop
                        preload="none"
                        poster="/heroslide2.png"
                        disablePictureInPicture
                        controls={false}
                        aria-label="Video cảm hứng filmmaking — thiết bị đa dạng cho creator"
                      />
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/45 to-transparent" />
                  </div>
                </div>
              </div>

              {/* Nội dung — chia đoạn bằng line ngang */}
              <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col justify-center">
                <div className="inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                  <span className="h-px w-8 bg-linear-to-r from-transparent to-slate-400" />
                  Trải nghiệm dịch vụ
                </div>

                <h2 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
                  Từ ý tưởng đến khung hình
                </h2>

                <p className="mt-4 text-lg leading-relaxed text-slate-600">
                  Giống như trong video: notebook, iPad, máy quay, ghi âm — mỗi
                  dự án cần nhiều công cụ. RentalTech giúp bạn lắp đúng bộ thiết
                  bị, đúng thời gian, không ôm chi phí mua mới.
                </p>

                <div className="my-8 flex justify-center">
                  <div className="h-px w-full max-w-md bg-linear-to-r from-transparent via-slate-400/20 to-transparent" />
                </div>

                <ul className="space-y-0">
                  <li className="flex gap-4 pb-5">
                    <CheckCircle
                      className="mt-0.5 size-6 shrink-0 text-emerald-600"
                      aria-hidden
                    />
                    <div>
                      <h3 className="font-bold text-slate-900">
                        Thiết bị đủ loại cho ekip
                      </h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                        Máy quay, ống kính, âm thanh, ánh sáng — gói theo ngày
                        hoặc theo dự án.
                      </p>
                    </div>
                  </li>
                  <li className="flex flex-col gap-0">
                    <div className="mb-5 h-px w-full bg-linear-to-r from-transparent via-slate-400/22 to-transparent" />
                    <div className="flex gap-4 pb-5">
                      <CheckCircle
                        className="mt-0.5 size-6 shrink-0 text-emerald-600"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Giá thuê rõ ràng
                        </h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                          Báo giá theo ngày/cọc minh bạch, phù hợp cả cá nhân
                          lẫn sản xuất nhỏ.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li className="flex flex-col gap-0">
                    <div className="mb-5 h-px w-full bg-linear-to-r from-transparent via-slate-400/22 to-transparent" />
                    <div className="flex gap-4">
                      <CheckCircle
                        className="mt-0.5 size-6 shrink-0 text-emerald-600"
                        aria-hidden
                      />
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Hỗ trợ khi bạn cần
                        </h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-slate-600">
                          Tư vấn chọn máy, giao nhận linh hoạt, kỹ thuật đồng
                          hành khi setup.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>

                <div className="mt-10 flex justify-center">
                  <div className="h-px w-full max-w-md bg-linear-to-r from-transparent via-slate-400/20 to-transparent" />
                </div>

                <div className="mt-8">
                  <Link to="/products">
                    <Button className="h-12 rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700">
                      Khám phá thiết bị
                      <ArrowRight className="ml-2 size-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Featured Products Section */}
        <section>
          <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Sản phẩm nổi bật
              </h2>
              <p className="mt-3 text-lg font-medium text-slate-500">
                Trải nghiệm ngay hôm nay
              </p>
            </div>
            <Link to="/products">
              <Button
                variant="ghost"
                className="group text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-bold text-base h-12 px-6 rounded-xl"
              >
                Xem tất cả sản phẩm
                <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategoryId(null)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                selectedCategoryId === null
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 hover:bg-slate-200/80 hover:text-blue-700 hover:ring-slate-300/80"
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  selectedCategoryId === category.id
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 hover:bg-slate-200/80 hover:text-blue-700 hover:ring-slate-300/80"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoadingProducts &&
              Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-slate-200 h-48 rounded-2xl mb-4"></div>
                  <div className="bg-slate-200 h-4 rounded mb-2"></div>
                  <div className="bg-slate-200 h-4 rounded w-2/3"></div>
                </div>
              ))}
            {!isLoadingProducts && featuredProducts.length === 0 && (
              <div className="col-span-full rounded-xl bg-slate-50/90 p-6 text-center text-slate-600 shadow-sm ring-1 ring-slate-200/60">
                <Package className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                <p className="text-lg font-medium mb-2">
                  Chưa có sản phẩm để hiển thị
                </p>
                <p className="text-sm text-slate-500">
                  Vui lòng thử lại sau hoặc liên hệ hỗ trợ
                </p>
              </div>
            )}
            {!isLoadingProducts &&
              featuredProducts.map((product, index) => {
                const cardAnimationClass = animateFeatured
                  ? "translate-y-0 opacity-100"
                  : "translate-y-3 opacity-0";

                return (
                  <div
                    key={product.id}
                    className={`transition-all duration-500 ${cardAnimationClass}`}
                    style={{ transitionDelay: `${index * 70}ms` }}
                  >
                    <ProductsCard
                      product={product}
                      variants="default"
                      onAddToCart={() => void handleAddToCart(product)}
                    />
                  </div>
                );
              })}
          </div>

          <div className="mt-14 flex justify-center">
            <Link to="/products">
              <Button
                size="lg"
                className="group h-14 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 px-10 text-lg font-bold text-white shadow-lg shadow-blue-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-600/30 hover:scale-105"
              >
                Khám phá tất cả sản phẩm
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        <SectionDivider />

        {/* Brands Section */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Star className="w-4 h-4 fill-emerald-700" />
                Đối tác uy tín
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
                Hợp tác với các thương hiệu hàng đầu
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Thiết bị chính hãng từ những tên tuổi lớn, đảm bảo chất lượng
                tốt nhất cho dự án của bạn
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
              {BRANDS.map((brand) => (
                <div
                  key={brand.name}
                  className="group flex items-center justify-center rounded-2xl bg-slate-50/90 p-6 shadow-sm ring-1 ring-slate-200/55 transition-all duration-300 hover:bg-white hover:shadow-md hover:ring-slate-300/65"
                >
                  <div className="w-20 h-12 flex items-center justify-center">
                    <div className="text-slate-600 font-bold text-sm group-hover:text-slate-800 transition-colors">
                      {brand.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-sm text-slate-500 font-medium">
                Và hơn 50+ thương hiệu khác được tin dùng trên toàn thế giới
              </p>
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Rental moments — ảnh thực tế */}
        <section id="gallery-section" className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Cùng RentalTech
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
                Khoảnh khắc từ khách thuê
              </h2>
              <p className="text-lg text-slate-600">
                Máy quay, máy ảnh, âm thanh, livestream… phục vụ sự kiện, đám
                cưới, studio và nhiều hơn thế.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {RENTAL_GALLERY.map((item, index) => {
                const delay = animateGallery ? `${index * 80}ms` : "0ms";
                const anim = animateGallery
                  ? "translate-y-0 opacity-100"
                  : "translate-y-6 opacity-0";
                return (
                  <figure
                    key={item.caption}
                    className={`overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-all duration-700 hover:shadow-md hover:ring-slate-300/50 ${anim}`}
                    style={{ transitionDelay: delay }}
                  >
                    <div className="aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                        loading="lazy"
                      />
                    </div>
                    <figcaption className="border-t border-slate-100/90 px-4 py-3 text-left text-sm font-semibold text-slate-800">
                      {item.caption}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Process Section */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Quy Trình Thuê Tại RentalTech
            </h2>
            <p className="text-lg font-medium text-slate-500 leading-relaxed">
              Thuê thiết bị công nghệ chưa bao giờ nhanh đến vậy. Hoàn tất chỉ
              với 3 bước đơn giản.
            </p>
          </div>

          <div className="relative mx-auto max-w-5xl grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="pointer-events-none hidden md:block absolute top-12 left-[12%] right-[12%] h-px bg-linear-to-r from-transparent via-slate-300/35 to-transparent" />

            {steps.map((step) => (
              <div
                key={step.id}
                className="group relative z-10 rounded-3xl bg-white/95 p-8 text-center shadow-sm ring-1 ring-slate-200/55 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-slate-300/50"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50 transition-transform group-hover:scale-105">
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

        <SectionDivider />

        {/* Reviews Section */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Heart className="w-4 h-4" />
                Khách hàng nói gì về chúng tôi
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl mb-6">
                Được Tin Dùng Bởi Cộng Đồng Sáng Tạo
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3 rounded-full bg-amber-50/90 px-6 py-3 shadow-lg ring-1 ring-amber-200/45">
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
              <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4">
                Hàng ngàn dự án thành công đã tin tưởng lựa chọn thiết bị từ
                chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r, index) => (
                <div
                  key={`${r.used_id ?? r.user_id ?? "review"}-${index}`}
                  className="relative flex flex-col justify-between rounded-[32px] bg-white p-8 shadow-lg shadow-slate-200/35 ring-1 ring-slate-200/55 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-slate-300/50"
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

                  <div className="mt-8 space-y-5 pt-2">
                    <div className="h-px w-full bg-linear-to-r from-transparent via-slate-300/30 to-transparent" />
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
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
                </div>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* FAQ */}
        <section id="faq" className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-3">
                Câu hỏi thường gặp
              </h2>
              <p className="text-slate-600">
                Giải đáp nhanh trước khi bạn đặt thuê. Cần thêm chi tiết, cứ
                nhắn đội ngũ hỗ trợ.
              </p>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl bg-white/90 px-5 py-4 ring-1 ring-slate-200/55 open:shadow-sm open:ring-slate-200/50 transition-shadow"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-left font-semibold text-slate-900 marker:content-none">
                    <span>{item.q}</span>
                    <ChevronDown className="size-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="mt-3 space-y-3">
                    <div className="h-px bg-linear-to-r from-transparent via-slate-300/25 to-transparent" />
                    <p className="text-[15px] leading-relaxed text-slate-600">
                      {item.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <SectionDivider />

        {/* Final CTA — cùng nền trang, chỉ nhịp line phía trên */}
        <section className="py-14 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl mb-4 leading-snug">
              Sẵn sàng biến ý tưởng thành hiện thực?
            </h2>
            <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
              Chọn thiết bị phù hợp tiến độ dự án — thuê linh hoạt, giao nhận
              gọn, hỗ trợ khi bạn cần.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
              <Link to="/products" className="inline-flex">
                <Button
                  size="lg"
                  className="h-12 sm:h-11 rounded-xl bg-blue-600 px-8 text-base font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  <Package className="mr-2 size-5" />
                  Xem danh mục thiết bị
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
              <Link to="/products" className="inline-flex">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 sm:h-11 rounded-xl border-slate-300 bg-white text-slate-800 px-8 text-base font-semibold hover:bg-slate-50"
                >
                  Gợi ý theo nhu cầu
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Tư vấn miễn phí
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Giao trong ngày (khu vực chọn)
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Cọc minh bạch
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
