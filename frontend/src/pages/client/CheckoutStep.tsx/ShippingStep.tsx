import { MyButton } from "@/components/ui/input/my-button";
import { MyInputForText } from "@/components/ui/input/my-input-text";
import MyRadioSelect from "@/components/ui/input/my-radio-select";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import type { Address, CreateAddressPayload } from "@/services/addressService";

type ShippingStepType = {
  onChange: (value: number) => void;
  address?: Address | null;
  onNewAddressData?: (data: CreateAddressPayload | null) => void;
};

export default function ShippingStep({ onChange, address, onNewAddressData }: ShippingStepType) {
  const [selectedOption, setSelectedOption] = useState("1");
  const [formData, setFormData] = useState({
    receive_name: "",
    receive_phone: "",
    city: "",
    district: "Quận/Huyện mặc định",
    ward: "",
    street: "",
    email: ""
  });

  const handleNext = () => {
    if (!address && onNewAddressData) {
       onNewAddressData({
          receive_name: formData.receive_name || formData.email,
          receive_phone: formData.receive_phone,
          city: formData.city,
          ward: formData.ward,
          district: formData.district,
          street: formData.street,
          is_default: true,
       });
    } else if (onNewAddressData) {
       onNewAddressData(null);
    }
    onChange(2);
  };

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

        {address ? (
          <div className="w-full rounded-2xl border border-gray-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-gray-700">
              Địa chỉ giao hàng
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <div>
                {address.receive_name} • {address.receive_phone}
              </div>
              <div>{address.street}</div>
              <div>
                {address.ward}, {address.city}
              </div>
              {address.note ? (
                <div className="text-xs text-gray-500 mt-2">
                  Ghi chú: {address.note}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            {/* Họ và tên */}
            <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
              <MyInputForText
                value={formData.receive_name}
                onChange={(e) => setFormData(p => ({ ...p, receive_name: e.target.value }))}
                htmlFor="last-name"
                title="Họ và Tên"
                placeholder="Nguyễn Văn A"
                className="sm:flex-1 w-full"
              />
            </div>

            {/* Email + SĐT */}
            <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
              <MyInputForText
                value={formData.email}
                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                htmlFor="email"
                title="Email"
                placeholder="sgu@example.com"
                className="sm:flex-1"
              />
              <MyInputForText
                value={formData.receive_phone}
                onChange={(e) => setFormData(p => ({ ...p, receive_phone: e.target.value }))}
                htmlFor="phone"
                title="Số điện thoại"
                placeholder="0123456789"
                className="sm:flex-1"
              />
            </div>
          </>
        )}

        {selectedOption === "1" && (
          <>
            {/* Tỉnh/Thành + Xã/Phường */}
            <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
              <MyInputForText
                value={formData.city}
                onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                htmlFor="city"
                title="Tỉnh/Thành"
                placeholder="Thành phố Hồ Chí Minh"
                className="sm:flex-1"
              />
              <MyInputForText
                value={formData.ward}
                onChange={(e) => setFormData(p => ({ ...p, ward: e.target.value }))}
                htmlFor="ward"
                title="Xã/Phường"
                placeholder="Phường Chợ Quán"
                className="sm:flex-1"
              />
            </div>

            {/* Quận/Huyện + Đường */}
            <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
              <MyInputForText
                value={formData.district}
                onChange={(e) => setFormData(p => ({ ...p, district: e.target.value }))}
                htmlFor="district"
                title="Quận/Huyện"
                placeholder="Quận 5"
                className="sm:flex-1"
              />
              <MyInputForText
                value={formData.street}
                onChange={(e) => setFormData(p => ({...p, street: e.target.value}))}
                htmlFor="address"
                title="Đường"
                placeholder="273, An Dương Vương"
                className="sm:flex-1"
              />
            </div>
          </>
        )}

        <MyButton
          text="Tiếp tục thanh toán"
          classname="flex-1 py-2"
          onClick={handleNext}
          icon={ArrowRight}
          src="/checkout"
        />
      </div>
    </div>
  );
}
