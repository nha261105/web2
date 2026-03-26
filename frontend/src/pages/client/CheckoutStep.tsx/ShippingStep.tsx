import { MyButton } from "@/components/ui/input/my-button";
import { MyInputForText } from "@/components/ui/input/my-input-text";
import MyRadioSelect from "@/components/ui/input/my-radio-select";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";

type ShippingStepType = {
  onChange: (value: number) => void;
};

export default function ShippingStep({ onChange }: ShippingStepType) {
  const [selectedOption, setSelectedOption] = useState("1");

  return (
    <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-8">
      <div className="flex flex-row gap-2 items-center">
        <MapPin size={20} className="text-blue-700" />
        <div className="text-base font-semibold">Shipping & Contact Info</div>
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
          onClick={() => onChange(2)}
          icon={ArrowRight}
          src="/checkout"
        />
      </div>
    </div>
  );
}
