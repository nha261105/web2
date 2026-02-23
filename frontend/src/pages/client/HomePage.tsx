import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.css";
export default function HomePage() {
  return (
    <div className="bg-white">
      {/* CONTENT: HEROSLIDE + INFO , FEATURE PRODUCTS,ABOUT,CUSTOMER COMMENT */}
      {/* HERO SLIDE + INFO: products,customer,retal,rating */}
      <div className="relative h-[500px] sm:h-[5650px] overflow-hidden">
        {/* HERO SLIDE: dùng thư viện swiper */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          className="w-full"
        >
          <SwiperSlide>
            <img
              src="/heroslide1.png"
              alt=""
              className="w-full h-[380px] md:h-[460px] object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* OTHER SECTIONS */}
      </div>
    </div>
  );
}
