import { useEffect, useMemo, useState } from "react";
import MyTrash2 from "@/components/icons/my-trash2";
import { MyButton } from "@/components/ui/input/my-button";
import MyHref from "@/components/ui/my-href";
import { MyInputText } from "@/components/ui/input/my-input-text";
import MyNavigateLink from "@/components/ui/my-navigate-link";
import MyNumericInput from "@/components/ui/my-numeric-input";
import {
  CartLayout,
  LeftCartLayout,
  RightCartLayout,
} from "@/layouts/client/CartLayout";
import { ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { getMyCart, type CartItem } from "@/services/cartService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      setErrorMessage("");

      const response = await getMyCart();

      if (response.success && response.data?.items) {
        setCartItems(response.data.items);
      } else {
        setCartItems([]);
        setErrorMessage(response.message || "Không tải được giỏ hàng.");
      }

      setIsLoading(false);
    };

    loadCart();
  }, []);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity * item.rental_days,
        0,
      ),
    [cartItems],
  );

  const totalItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  );

  return (
    <CartLayout>
      <MyNavigateLink
        items={[{ text: "Home", link: "/" }, { text: "Shopping Cart" }]}
      />

      <div className="w-full flex flex-row items-center gap-2">
        <div className="text-xl text-black font-semibold">Shopping Cart</div>
        <div className="text-lg text-gray-500 font-normal">
          ({totalItems} items)
        </div>
      </div>

      <div className="w-full flex flex-row justify-between gap-10 flex-wrap">
        <LeftCartLayout>
          <div className="w-full flex flex-col gap-4">
            {isLoading && (
              <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500">
                Đang tải giỏ hàng...
              </div>
            )}

            {!isLoading && errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {!isLoading && !errorMessage && cartItems.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-600">
                <div className="text-lg font-semibold mb-2">Giỏ hàng trống</div>
                <div className="text-sm text-gray-500">
                  Bạn chưa có sản phẩm nào trong giỏ. Hãy chọn thiết bị bạn muốn
                  thuê và thêm vào giỏ.
                </div>
              </div>
            )}

            {!isLoading &&
              cartItems.length > 0 &&
              cartItems.map((item) => {
                const name =
                  item.product?.name ?? item.combo?.name ?? "Unknown item";
                const priceLabel = `${formatCurrency(item.unit_price)}/day`;
                const itemTotal = formatCurrency(
                  item.unit_price * item.quantity * item.rental_days,
                );
                const image =
                  item.product?.image ??
                  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

                return (
                  <div
                    className="flex flex-row border-gray-300 bg-white border p-5 rounded-lg gap-3"
                    key={item.id}
                  >
                    <img
                      src={image}
                      alt={name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="w-full flex flex-col justify-between">
                      <div className="w-full flex flex-row justify-between gap-3">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm font-semibold hover:cursor-pointer hover:text-blue-700">
                            {name}
                          </div>
                          <div className="text-xs font-medium text-gray-500">
                            {priceLabel}
                          </div>
                        </div>
                        <MyTrash2 size={19} />
                      </div>
                      <div className="w-full flex flex-row justify-between items-end">
                        <div className="flex flex-row gap-x-9 gap-y-1 flex-wrap">
                          <div className="flex flex-row gap-2 items-center">
                            <div className="w-8 text-sm text-gray-500">SL:</div>
                            <MyNumericInput
                              min={1}
                              max={100}
                              defaultValue={item.quantity}
                            />
                          </div>
                          <div className="flex flex-row gap-2 items-center">
                            <div className="w-8 text-sm text-gray-500">
                              Ngày:
                            </div>
                            <MyNumericInput
                              min={1}
                              max={100}
                              defaultValue={item.rental_days}
                            />
                          </div>
                        </div>
                        <div className="text-sm font-bold">{itemTotal}</div>
                      </div>
                    </div>
                  </div>
                );
              })}

            <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-3">
              <div className="flex flex-row gap-2 items-center">
                <Tag size={18} strokeWidth={2.5} className="text-blue-700" />
                <div className="text-base font-semibold">Promo Code</div>
              </div>
              <div className="w-full flex flex-row justify-between items-center gap-3">
                <MyInputText
                  defaultValue=""
                  placeholder="Enter promo code (try RENT10)"
                />
                <MyButton text="Apply" classname="px-3" />
              </div>
              <div className="text-sm text-gray-500">
                Try: RENT10, FIRST15, SAVE20
              </div>
            </div>
          </div>
        </LeftCartLayout>

        <RightCartLayout>
          <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-3">
            <div className="text-lg font-semibold">Order Summary</div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="text-sm font-semibold">
                  {formatCurrency(subtotal)}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Delivery</div>
                <div className="text-sm text-green-600 font-semibold">Free</div>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <div className="text-lg font-medium">Total</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(subtotal)}
                </div>
              </div>
              <MyButton
                text="Proceed to Checkout"
                classname={`flex-1 py-2 ${cartItems.length === 0 ? "opacity-50 pointer-events-none" : ""}`}
                src={cartItems.length === 0 ? undefined : "/checkout"}
                icon={ArrowRight}
              />
              <MyHref text="← Continue Shopping" src="/" />
            </div>
            <hr />
            <div className="flex flex-row items-center gap-2">
              <ShieldCheck size={17} className="text-green-700" />
              <div className="text-xs text-gray-500">
                Secure checkout — SSL encrypted
              </div>
            </div>
          </div>
        </RightCartLayout>
      </div>
    </CartLayout>
  );
}
