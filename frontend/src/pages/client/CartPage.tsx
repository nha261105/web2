import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import MyTrash2 from "@/components/icons/my-trash2";
import { MyButton } from "@/components/ui/input/my-button";
import MyHref from "@/components/ui/my-href";
import { MyInputCheckbox } from "@/components/ui/input/my-input-checkbox";
import { MyInputText } from "@/components/ui/input/my-input-text";
import MyNavigateLink from "@/components/ui/my-navigate-link";
import MyNumericInput from "@/components/ui/my-numeric-input";
import {
  CartLayout,
  LeftCartLayout,
  RightCartLayout,
} from "@/layouts/client/CartLayout";
import { ArrowRight, ShieldCheck, Tag } from "lucide-react";
import {
  getMyCart,
  updateCartItemQuantity,
  updateCartReturnDate,
  removeCartItem,
  type CartItem,
} from "@/services/cartService";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN").format(value) + " đ";

const getTodayDateString = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10);
};

import { useCallback } from "react";

const getRentalDaysFromDates = (startDate: string, endDate: string) => {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / 86400000);
  return diffDays + 1;
};

export default function CartPage() {
  const today = getTodayDateString();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [returnDate, setReturnDate] = useState<string>(today);
  const [rentalDays, setRentalDays] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadCart = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    setErrorMessage("");

    const response = await getMyCart();

    if (response.success && response.data?.items) {
      const items = response.data.items as CartItem[];
      const currentDate = getTodayDateString();
      const cartReturnDate = items[0]?.return_date ?? currentDate;
      setCartItems(items);
      setSelectedItemIds((prevSelected) => {
          if (isInitial) return items.map((item) => item.id);
          const activeIds = items.map(i => i.id);
          return prevSelected.filter(id => activeIds.includes(id));
      });
      setReturnDate(cartReturnDate);
      setRentalDays(getRentalDaysFromDates(currentDate, cartReturnDate));
    } else {
      setCartItems([]);
      setSelectedItemIds([]);
      setRentalDays(1);
      if (isInitial) setErrorMessage(response.message || "Không tải được giỏ hàng.");
    }

    if (isInitial) setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCart(true);
  }, [loadCart]);

  const selectedItemIdsSet = useMemo(
    () => new Set(selectedItemIds),
    [selectedItemIds],
  );

  const selectedCount = selectedItemIds.length;
  const allItemsSelected =
    cartItems.length > 0 && selectedCount === cartItems.length;

  /**
   * Tính tổng số tiền có trong giỏ hàng
   */
  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        if (!selectedItemIdsSet.has(item.id)) return sum;
        return sum + item.unit_price * item.quantity * rentalDays;
      }, 0),
    [cartItems, rentalDays, selectedItemIdsSet],
  );

  /**
   * Cập nhật số lượng sản phẩm
   * @param item Sản phẩm
   * @param quantity Số lượng
   * @returns void
   */
  const handleCartItemChange = async (item: CartItem, quantity: number) => {
    if (quantity === item.quantity) return;

    const previousItems = cartItems;
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity } : cartItem,
      ),
    );

    const response = await updateCartItemQuantity(item.id, {
      quantity,
    });
    if (!response.success) {
      setCartItems(previousItems);
      setErrorMessage(response.message || "Không thể cập nhật giỏ hàng.");
    }
  };

  /**
   * Hàm cập nhật lại ngày trả
   * @param date Ngày trả
   * @returns void
   */
  const handleReturnDateChange = async (date: string) => {
    if (date === returnDate) return;

    if (date < today) {
      toast.error("Ngày trả không được chọn trước ngày hiện tại.");
      return;
    }

    const previousDate = returnDate;
    const currentDate = getTodayDateString();
    setReturnDate(date);
    setRentalDays(getRentalDaysFromDates(currentDate, date));

    const response = await updateCartReturnDate({ return_date: date });
    if (!response.success) {
      setReturnDate(previousDate);
      setRentalDays(getRentalDaysFromDates(currentDate, previousDate));
      setErrorMessage(response.message || "Không thể cập nhật ngày trả.");
      return;
    }
  };

  const toggleItemSelection = (itemId: number, checked: boolean) => {
    setSelectedItemIds((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId),
    );
  };

  const toggleSelectAll = (checked: boolean) => {
    setSelectedItemIds(checked ? cartItems.map((item) => item.id) : []);
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = async (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
    const response = await removeCartItem(itemId);

    if (!response.success) {
      setErrorMessage(response.message || "Không thể xóa sản phẩm khỏi giỏ.");
    } else {
      window.dispatchEvent(new Event("cart_changed"));
      loadCart();
    }
  };

  return (
    <CartLayout>
      <MyNavigateLink
        items={[{ text: "Trang chủ", link: "/" }, { text: "Giỏ hàng" }]}
      />

      <div className="w-full flex flex-row items-center gap-2">
        <div className="text-xl text-black font-semibold">Giỏ hàng</div>
        <div className="text-lg text-gray-500 font-normal">
          ({cartItems.length} sản phẩm)
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

            {!isLoading && cartItems.length > 0 && (
              <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="text-sm font-medium text-slate-700">
                      Ngày trả
                    </div>
                    <div className="flex flex-row flex-wrap items-center gap-4">
                      <input
                        type="date"
                        value={returnDate}
                        min={today}
                        onChange={(e) => handleReturnDateChange(e.target.value)}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                      />
                      <div className="text-sm text-slate-500">
                        Số ngày thuê:{" "}
                        <span className="font-semibold text-slate-900">
                          {rentalDays}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-3">
                    <MyInputCheckbox
                      htmlFor="cart-select-all"
                      checked={allItemsSelected}
                      text={`Chọn tất cả (${selectedCount}/${cartItems.length})`}
                      onChange={toggleSelectAll}
                    />
                  </div>
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
                  item.unit_price * item.quantity * rentalDays,
                );
                const image =
                  item.product?.image ??
                  "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

                return (
                  <div
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                    key={item.id}
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
                      <div className="flex items-start gap-3">
                        <MyInputCheckbox
                          htmlFor={`cart-item-${item.id}`}
                          checked={selectedItemIdsSet.has(item.id)}
                          onChange={(checked) =>
                            toggleItemSelection(item.id, checked)
                          }
                        />
                        <img
                          src={image}
                          alt={name}
                          className="h-24 w-24 rounded-2xl object-cover"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <div className="text-base font-semibold text-slate-900">
                              {name}
                            </div>
                            <div className="text-sm text-slate-500">
                              {priceLabel}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void handleRemoveItem(item.id)}
                            className="text-slate-400 transition hover:text-red-600"
                          >
                            <MyTrash2 size={19} />
                          </button>
                        </div>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-row flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500">
                                Số lượng
                              </span>
                              <MyNumericInput
                                min={1}
                                max={100}
                                value={item.quantity}
                                onChange={(quantity) =>
                                  void handleCartItemChange(item, quantity)
                                }
                              />
                            </div>
                          </div>
                          <div className="text-sm font-semibold text-slate-900">
                            {itemTotal}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-3">
              <div className="flex flex-row gap-2 items-center">
                <Tag size={18} strokeWidth={2.5} className="text-blue-700" />
                <div className="text-base font-semibold">Mã giảm giá</div>
              </div>
              <div className="w-full flex flex-row justify-between items-center gap-3">
                <MyInputText
                  defaultValue=""
                  placeholder="Nhập mã giảm giá (thử RENT10)"
                />
                <MyButton text="Áp dụng" classname="px-3" />
              </div>
              <div className="text-sm text-gray-500">
                Thử: WELCOME50K, SALE100K, VIP150K
              </div>
            </div>
          </div>
        </LeftCartLayout>

        <RightCartLayout>
          <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-3">
            <div className="text-lg font-semibold">Tóm tắt đơn hàng</div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Tạm tính</div>
                <div className="text-sm font-semibold">
                  {formatCurrency(subtotal)}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Giao hàng</div>
                <div className="text-sm text-green-600 font-semibold">Miễn phí</div>
              </div>
            </div>
            <hr />
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <div className="text-lg font-medium">Tổng cộng</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(subtotal)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                Đã chọn {selectedCount}/{cartItems.length} sản phẩm. Tổng số
                ngày thuê:{" "}
                <span className="font-semibold text-slate-900">
                  {rentalDays}
                </span>
              </div>
              <MyButton
                text="Tiến hành thanh toán"
                classname={`flex-1 py-2 ${selectedCount === 0 ? "opacity-50 pointer-events-none" : ""}`}
                src={selectedCount === 0 ? undefined : "/checkout"}
                icon={ArrowRight}
              />
              <MyHref text="← Tiếp tục mua sắm" src="/" />
            </div>
            <hr />
            <div className="flex flex-row items-center gap-2">
              <ShieldCheck size={17} className="text-green-700" />
              <div className="text-xs text-gray-500">
                Thanh toán bảo mật — mã hóa SSL
              </div>
            </div>
          </div>
        </RightCartLayout>
      </div>
    </CartLayout>
  );
}
