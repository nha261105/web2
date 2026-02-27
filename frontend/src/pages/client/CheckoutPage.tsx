import MyButton from "@/components/ui/my-button";
import { MyInputForText } from "@/components/ui/my-input-text";
import MyNavigateLink from "@/components/ui/my-navigate-link";
import MyProcessCheckout from "@/components/ui/my-process-checkout";
import MyRadioSelect from "@/components/ui/my-radio-select";
import {
  CartLayout,
  LeftCartLayout,
  RightCartLayout,
} from "@/layouts/client/CartLayout";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";

export default function CheckoutPage() {
  const [selectedOption, setSelectedOption] = useState("1");
  const products = [
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "3d × 1",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "3d × 1",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "3d × 1",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "3d × 1",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "3d × 1",
      total: "$3204",
    },
  ];

  return (
    <CartLayout>
      <MyNavigateLink
        items={[
          { text: "Home", link: "/" },
          { text: "Shopping Cart", link: "/cart" },
          { text: "Checkout" },
        ]}
      />
      <div className="w-full flex flex-row justify-center items-center gap-2">
        <MyProcessCheckout
          items={["Shipping", "Payment", "Confirm"]}
          position={1}
        />
      </div>
      <div className="w-full flex flex-row justify-between gap-10 flex-wrap">
        <LeftCartLayout>
          <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-8">
            <div className="flex flex-row gap-2 items-center">
              <MapPin size={20} className="text-blue-700" />
              <div className="text-base font-semibold">
                Shipping & Contact Info
              </div>
            </div>
            <div className="w-full flex flex-col gap-5">
              <div className="w-full flex flex-row justify-between gap-3 items-stretch">
                <MyRadioSelect
                  className="flex-1"
                  title="Home Delivery"
                  text="Delivered to your door"
                  name="delivery-method"
                  value={"1"}
                  selectedOption={selectedOption}
                  onChange={setSelectedOption}
                />
                <MyRadioSelect
                  className="flex-1"
                  title="Store Pickup"
                  text="Pickup from our warehouse"
                  name="delivery-method"
                  value={"2"}
                  selectedOption={selectedOption}
                  onChange={setSelectedOption}
                />
              </div>

              {/* Họ và tên */}
              <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
                <MyInputForText
                  defaultValue=""
                  htmlFor="first-name"
                  title="Họ"
                  placeholder="Nguyễn Thanh"
                  className="sm:flex-1"
                />
                <MyInputForText
                  defaultValue=""
                  htmlFor="last-name"
                  title="Tên"
                  placeholder="Sang"
                  className="sm:flex-1"
                />
              </div>

              {/* Email + SĐT */}
              <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
                <MyInputForText
                  defaultValue=""
                  htmlFor="email"
                  title="Email"
                  placeholder="sgu@example.com"
                  className="sm:flex-1"
                />
                <MyInputForText
                  defaultValue=""
                  htmlFor="phone"
                  title="Số điện thoại"
                  placeholder="0123456789"
                  className="sm:flex-1"
                />
              </div>

              {selectedOption === "1" && (
                <>
                  {/* Tỉnh/Thành + Xã/Phường */}
                  <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
                    <MyInputForText
                      defaultValue=""
                      htmlFor="city"
                      title="Tỉnh/Thành"
                      placeholder="Thành phố Hồ Chí Minh"
                      className="sm:flex-1"
                    />
                    <MyInputForText
                      defaultValue=""
                      htmlFor="ward"
                      title="Xã/Phường"
                      placeholder="Phường Chợ Quán"
                      className="sm:flex-1"
                    />
                  </div>

                  {/* Đường */}
                  <MyInputForText
                    defaultValue=""
                    htmlFor="address"
                    title="Đường"
                    placeholder="273, An Dương Vương"
                    className="sm:flex-1"
                  />
                </>
              )}

              <MyButton
                text="Tiếp tục thanh toán"
                classname="flex-1 py-2"
                icon={
                  <ArrowRight
                    size={20}
                    strokeWidth="2.25px"
                    className="text-white"
                  />
                }
                src="/checkout"
              />
            </div>
          </div>
        </LeftCartLayout>
        <RightCartLayout>
          <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-3">
            <div className="text-lg font-semibold">Order Summary</div>
            {products.map((item, index) => (
              <div
                className="flex flex-row bg-white gap-1 items-center"
                key={index}
              >
                <img
                  src={item.img}
                  alt="meme"
                  className="w-10 h-10 rounded-md cursor-pointer"
                />
                <div className="w-full flex flex-col justify-between">
                  <div className="w-full flex flex-row justify-between">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-xs font-semibold">{item.name}</div>
                      <div className="text-xs font-medium text-gray-500">
                        {item.price}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-xs font-bold">{item.total}</div>
              </div>
            ))}
            <hr />
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="text-sm font-semibold">$385</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Delivery</div>
                <div className="text-sm text-green-600 font-semibold">Free</div>
              </div>
            </div>
            <hr />
            <div className="flex flex-row justify-between items-center">
              <div className="text-lg font-medium">Total</div>
              <div className="text-lg font-semibold">$385</div>
            </div>
          </div>
        </RightCartLayout>
      </div>
    </CartLayout>
  );
}
