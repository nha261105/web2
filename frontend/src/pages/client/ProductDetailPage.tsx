import { useMemo, useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PRODUCTS } from "./data";

export default function ProductDetailPage() {
  const PRESET_DURATIONS = [1, 3, 7, 14];
  const { id } = useParams();

  const product = useMemo(() => PRODUCTS.find((item) => item.id === id), [id]);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [rentalDays, setRentalDays] = useState(1);
  const [customDays, setCustomDays] = useState(1);
  const [quantity, setQuantity] = useState(1);

  const images = useMemo(() => {
    if (!product) return [] as string[];
    const list = [product.image, ...(product.gallery || [])].filter(
      Boolean,
    ) as string[];
    return Array.from(new Set(list));
  }, [product]);

  useEffect(() => {
    if (images.length) setSelectedImage(images[0]);
    else setSelectedImage(undefined);
  }, [images]);

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const totalPrice = product.price * rentalDays * quantity;

  if (!product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-2xl font-bold text-slate-900">
          Không tìm thấy sản phẩm
        </p>
        <p className="mt-2 text-slate-600">
          Sản phẩm bạn chọn không tồn tại hoặc đã được gỡ khỏi hệ thống.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <ArrowLeft size={18} />
          Quay về trang chủ
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Quay lại danh sách sản phẩm
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
            <img
              src={selectedImage ?? images[0] ?? product.image}
              alt={product.title}
              className="h-105 w-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {images.slice(0, 6).map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`overflow-hidden rounded-xl border bg-slate-100 transition-shadow focus:outline-none ${
                  selectedImage === image
                    ? "ring-2 ring-blue-600 border-transparent"
                    : "border-slate-200"
                }`}
              >
                <img
                  src={image}
                  alt={product.title}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="pt-2">
            <p className="mb-3 text-lg font-bold text-slate-900">
              Thông số kỹ thuật
            </p>
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              {Object.entries(product.specs).map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-2 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0"
                >
                  <p className="font-semibold text-slate-700">{label}</p>
                  <p className="text-slate-600">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            {product.category}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-4 flex items-center gap-2 text-slate-600">
            <Star size={16} className="fill-amber-400 text-amber-400" />
            <span className="font-medium">{product.rating}</span>
            <span>({product.reviews} đánh giá)</span>
            <span className="text-slate-300">|</span>
            <span className="font-medium">Thương hiệu: {product.brand}</span>
          </div>

          <div className="mt-6 flex items-end gap-3">
            <p className="text-4xl font-extrabold text-slate-900">
              {formatVND(product.price)}
            </p>
            <p className="pb-1 text-base text-slate-500">/ ngày</p>
          </div>

          <p className="mt-6 text-[17px] leading-relaxed text-slate-600">
            {product.description}
          </p>

          <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-5">
            <div>
              <p className="mb-3 text-lg font-semibold text-slate-900">
                Thời gian thuê
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {PRESET_DURATIONS.map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => {
                      setRentalDays(days);
                      setCustomDays(days);
                    }}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                      rentalDays === days
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 text-slate-700 hover:border-blue-200 hover:text-blue-600"
                    }`}
                  >
                    {days === 1 ? "1 Ngày" : `${days} Ngày`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-lg font-semibold text-slate-900">
                Custom days
              </p>
              <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.max(1, customDays - 1);
                    setCustomDays(next);
                    setRentalDays(next);
                  }}
                  className="h-11 w-12 grid place-items-center text-slate-600 hover:bg-slate-50"
                >
                  <Minus size={18} />
                </button>
                <div className="w-16 text-center font-semibold text-slate-900">
                  {customDays}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const next = customDays + 1;
                    setCustomDays(next);
                    setRentalDays(next);
                  }}
                  className="h-11 w-12 grid place-items-center text-slate-600 hover:bg-slate-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-lg font-semibold text-slate-900">
                Số lượng
              </p>
              <div className="inline-flex items-center overflow-hidden rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="h-11 w-12 grid place-items-center text-slate-600 hover:bg-slate-50"
                >
                  <Minus size={18} />
                </button>
                <div className="w-16 text-center font-semibold text-slate-900">
                  {quantity}
                </div>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="h-11 w-12 grid place-items-center text-slate-600 hover:bg-slate-50"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 px-5 py-4">
              <div className="flex items-center justify-between gap-3 text-slate-700">
                <p>
                  {formatVND(product.price)} / ngày x {rentalDays} ngày x{" "}
                  {quantity}
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {formatVND(totalPrice)}
                </p>
              </div>
              <div className="mt-1 flex items-center justify-between text-slate-700">
                <p>Giao hàng</p>
                <p className="font-semibold text-emerald-600">Miễn phí</p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <ShieldCheck className="text-emerald-600" size={18} />
              Bảo hiểm thiết bị toàn phần
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-700">
              <Truck className="text-blue-600" size={18} />
              Giao nhận nhanh trong ngày
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button className="h-12 rounded-xl bg-blue-600 px-6 text-base font-semibold text-white hover:bg-blue-700">
              <ShoppingCart className="mr-2" size={18} />
              Thêm vào giỏ
            </Button>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-slate-300 px-6 text-base font-semibold text-slate-800 hover:bg-slate-100"
            >
              Thuê ngay
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
