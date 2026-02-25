import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import type { Product, ProductCardType } from "../data";
import { useRef, useState } from "react";
import { QuantityControl } from "./QuantityControl";
type ProductCardProps = {
  product: Product;
  variants?: ProductCardType;
  quantity?: number;
  days?: number;
  onIncreaseQuantity?: () => void;
  onDecreaseQuantity?: () => void;
  onDecreaseDays?: () => void;
  onIncreaseDays?: () => void;
  onUpdateQuantity?: (quantity: number) => void;
  onUpdateDays?: (quantity: number) => void;
  onRemove?: () => void;
  onAddToCart?: () => void;
};
export const ProductsCard = ({
  product,
  variants = "default",
  quantity = 1,
  days = 1,
  onIncreaseQuantity,
  onDecreaseQuantity,
  onDecreaseDays,
  onUpdateDays,
  onIncreaseDays,
  onUpdateQuantity,
  onRemove,
  onAddToCart,
}: ProductCardProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const thumbnail = product.image;

  const [isFav, setIsFav] = useState(false);
  const badgeLabel =
    product.badge == "sale"
      ? `${5}% GIẢM`
      : product.badge === "bestseller"
        ? "Bán chạy"
        : product.badge === "new"
          ? "Mới"
          : null;
  const badgeClass =
    product.badge === "sale"
      ? "bg-red-500"
      : product.badge === "bestseller"
        ? "bg-amber-500"
        : product.badge === "new"
          ? "bg-emerald-500"
          : "bg-gray-400";

  const formatVND = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const isList = variants === "list";
  const isCart = variants === "cart";
  if (isCart) {
    return (
      <div className="relative w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-start gap-4 p-4">
          <img
            ref={imgRef}
            src={thumbnail}
            alt=""
            className="h-28 rounded-lg w-30 object-cover"
          />
          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-between items-center">
              <p className="text-xl font-bold">{product.title}</p>
              <button
                onClick={onRemove}
                className="hover:scale-110 transition-opacity text-gray-700 hover:text-red-600"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <div className="flex flex-col gap-2 mt-1">
              <div className="flex flex-col gap-2 items-start">
                <p className="text-[14px] text-gray-700">{product.category}</p>
                <p className=" flex flex-row-reverse text-[13px] font-normal">
                  {formatVND(product.price)} / ngày
                </p>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row items-start gap-16">
                  <QuantityControl
                    name="Số lượng thuê"
                    quantity={quantity}
                    maxQuantity={product.available}
                    onQuantityChange={onUpdateQuantity || (() => {})}
                    onIncrease={onIncreaseQuantity}
                    onDecrease={onDecreaseQuantity}
                  />
                  <QuantityControl
                    name="Số ngày thuê"
                    quantity={days}
                    maxQuantity={product.available}
                    onQuantityChange={onUpdateDays || (() => {})}
                    onIncrease={onIncreaseDays}
                    onDecrease={onDecreaseDays}
                  />
                </div>
                <div className="">
                  <p className="text-xl font-bold">
                    {formatVND(product.price * quantity)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={
        isList
          ? "group relative flex items-start gap-4 rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 p-3 md:p-4"
          : "group flex flex-col rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300"
      }
    >
      {isList && (
        <span
          className={`absolute top-3 right-3 px-2.5 py-1 text-[11px] font-semibold rounded-full shadow ${
            product.available > 0
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {product.available > 0
            ? `Còn hàng (${product.available} sản phẩm)`
            : "Hết hàng"}
        </span>
      )}
      <div
        className={
          isList
            ? "relative w-36 h-36 md:w-44 md:h-44 shrink-0 overflow-hidden rounded-xl bg-gray-100"
            : "relative aspect-square w-full overflow-hidden bg-gray-100"
        }
      >
        <img
          ref={imgRef}
          src={thumbnail}
          alt={product.title}
          className={
            isList
              ? "w-full h-full object-cover"
              : "w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          }
        />
        {badgeLabel && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-[16px] font-semibold text-white rounded-lg shadow ${badgeClass}`}
          >
            {badgeLabel}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsFav((v) => !v);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center opacity-0 translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
          aria-label="Add to wishlist"
        >
          <Heart
            size={18}
            className={isFav ? "text-red-500 fill-red-500" : "text-gray-700"}
          />
        </button>
      </div>
      <div
        className={
          isList
            ? "flex-1 flex flex-col gap-2"
            : "flex flex-col gap-3 px-2 py-3"
        }
      >
        <p
          className={
            isList
              ? "font-bold text-lg md:text-xl text-gray-900"
              : "font-bold text-md text-gray-900"
          }
        >
          {product.title}
        </p>
        {!isList && (
          <p className="font-sans text-gray-700 text-[14px]">
            {product.category}
          </p>
        )}

        {isList ? (
          <>
            <p className="text-sm text-gray-300 md:text-gray-700">
              {product.category}
            </p>
            <p className="text-sm text-gray-200 md:text-gray-700 line-clamp-2">
              {product.description}
            </p>
          </>
        ) : (
          variants === "default" && (
            <p className="font-sans text-gray-700 text-xs line-clamp-3">
              {product.description}
            </p>
          )
        )}

        <div className="flex items-center gap-1">
          <Star size={15} />
          <p className="text-xs text-gray-700">{product.rating}</p>
          <p className="text-xs text-gray-700">({product.reviews})</p>
        </div>

        <div
          className={
            isList
              ? "mt-2 flex items-center justify-between"
              : "flex flex-row gap-2 items-center justify-between"
          }
        >
          <div className="flex items-baseline gap-2">
            <p
              className={
                isList ? "font-extrabold text-2xl" : "font-bold text-2xl"
              }
            >
              {formatVND(product.price)}
            </p>
            {product.badge === "sale" && (
              <p className="text-sm line-through text-gray-500">
                {formatVND(product.price)}
              </p>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onAddToCart?.();
            }}
            disabled={!onAddToCart || product.available === 0}
            className={
              isList
                ? `flex items-center gap-2 text-sm hover:opacity-80 ${
                    !onAddToCart || product.available === 0
                      ? "cursor-not-allowed opacity-50"
                      : ""
                  }`
                : "p-2 rounded-full hover:bg-gray-100 transition-colors"
            }
            aria-label="Add to cart"
          >
            {isList && (
              <div className="flex flex-row gap-3">
                <ShoppingCart size={isList ? 18 : 20} />
                <span>Thêm vào giỏ</span>
              </div>
            )}
          </button>
        </div>

        {!isList && (
          <>
            <div>
              {product.available > 0 ? (
                <p className="font-sans text-green-600 text-xs">
                  Còn hàng ({product.available} sản phẩm)
                </p>
              ) : (
                <p className="font-sans text-red-600 text-xs">Hết hàng</p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onAddToCart?.();
              }}
              className={`w-full mt-2 px-4 py-2 rounded-lg text-black font-semibold ${
                product.available > 0 && onAddToCart
                  ? "bg-white-600 hover:bg-gray=100 cursor-pointer"
                  : "bg-white-600 cursor-not-allowed opacity-50"
              }`}
              disabled={!onAddToCart || product.available === 0}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingCart size={18} />
                Thêm vào giỏ
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
