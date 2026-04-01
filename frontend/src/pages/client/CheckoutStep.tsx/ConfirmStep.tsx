import { MyBackButton, MyButton } from "@/components/ui/input/my-button";
import { MyFrameWithInfo2 } from "@/components/ui/my-frame";
import { ArrowRight, Search } from "lucide-react";
import { Fragment } from "react/jsx-runtime";
import { type CartItem } from "@/services/cartService";

type ConfirmStepType = {
  onChange: (value: number) => void;
  onSuccess: (value: boolean) => void;
  items: CartItem[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

export default function ConfirmStep({
  onChange,
  onSuccess,
  items,
}: ConfirmStepType) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity * item.rental_days,
    0,
  );

  return (
    <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-8">
      <div className="flex flex-row gap-2 items-center">
        <Search size={20} className="text-blue-700" />
        <div className="text-base font-semibold">Xem lại đơn hàng của bạn</div>
      </div>
      <div className="flex flex-col w-full bg-white gap-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-5 text-center text-gray-500">
            Giỏ hàng trống
          </div>
        ) : (
          items.map((item) => {
            const name =
              item.product?.name ?? item.combo?.name ?? "Unknown item";
            const itemTotal =
              item.unit_price * item.quantity * item.rental_days;
            return (
              <Fragment key={item.id}>
                <div className="flex flex-row gap-2 items-center">
                  <div className="w-full flex flex-col justify-between">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-xs font-semibold">{name}</div>
                      <div className="text-xs font-medium text-gray-500">
                        {item.quantity} x {item.rental_days} ngày
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-bold">
                    {formatCurrency(itemTotal)}
                  </div>
                </div>
                <hr />
              </Fragment>
            );
          })
        )}
      </div>

      <div className="w-full flex flex-col gap-5">
        <MyFrameWithInfo2
          txts={["Gửi đến", "Thanh toán", "Thành tiền"]}
          txts2={[
            "Thông tin giao hàng",
            "Thẻ tín dụng",
            formatCurrency(subtotal),
          ]}
        />

        <div className="flex flex-row gap-3 items-center">
          <MyBackButton
            text="Quay lại"
            className="flex-1"
            onHandle={() => {
              onChange(2);
            }}
          />
          <MyButton
            text="Thanh toán"
            classname="flex-1"
            color="orange"
            onClick={() => onSuccess(true)}
            icon={ArrowRight}
          />
        </div>
      </div>
    </div>
  );
}
