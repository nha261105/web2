import { MyButton } from "@/components/ui/input/my-button";
import { MyInputForText } from "@/components/ui/input/my-input-text";
import MyRadioSelect from "@/components/ui/input/my-radio-select";
import { ArrowRight, MapPin, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import type { Address, CreateAddressPayload } from "@/services/addressService";
import toast from "react-hot-toast";

type ShippingStepType = {
  onChange: (value: number) => void;
  addresses: Address[];
  selectedAddressId: number | null;
  onSelectAddress: (id: number | null) => void;
  onNewAddressData: (data: CreateAddressPayload | null) => void;
};

export default function ShippingStep({ onChange, addresses, selectedAddressId, onSelectAddress, onNewAddressData }: ShippingStepType) {
  const [selectedOption, setSelectedOption] = useState("1");
  const [isAddingNew, setIsAddingNew] = useState(addresses.length === 0);
  const [formData, setFormData] = useState({
    receive_name: "",
    receive_phone: "",
    city: "",
    district: "",
    ward: "",
    street: "",
    email: ""
  });

  useEffect(() => {
    if (addresses.length === 0) {
      setIsAddingNew(true);
    }
  }, [addresses]);

  const handleNext = () => {
    if (selectedOption === "2") {
        // Store pickup - could skip address or use a default one. Let's just pass null for now or require basic info.
        onSelectAddress(null);
        onNewAddressData(null);
        onChange(2);
        return;
    }

    if (isAddingNew) {
        if (!formData.receive_name || !formData.receive_phone || !formData.city || !formData.district || !formData.ward || !formData.street) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }
        
        // Basic phone validation
        if (!/^[0-9]{10,11}$/.test(formData.receive_phone)) {
            toast.error("Số điện thoại không hợp lệ!");
            return;
        }

        onNewAddressData({
          receive_name: formData.receive_name,
          receive_phone: formData.receive_phone,
          city: formData.city,
          ward: formData.ward,
          district: formData.district,
          street: formData.street,
          is_default: addresses.length === 0,
        });
        onSelectAddress(null);
    } else {
        if (!selectedAddressId) {
            toast.error("Vui lòng chọn hoặc thêm địa chỉ giao hàng!");
            return;
        }
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
            text="Giao hàng tận nơi"
            name="delivery-method"
            value={"1"}
            selectedOption={selectedOption}
            onChange={setSelectedOption}
          />
          <MyRadioSelect
            className="flex-1"
            title="Store Pickup"
            text="Nhận tại cửa hàng"
            name="delivery-method"
            value={"2"}
            selectedOption={selectedOption}
            onChange={setSelectedOption}
          />
        </div>

        {selectedOption === "1" && (
            <>
                {addresses.length > 0 && (
                    <div className="flex flex-col gap-3">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Chọn địa chỉ giao hàng</div>
                        {addresses.map((addr) => (
                            <label key={addr.id} className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddressId === addr.id && !isAddingNew ? 'border-[#0052cc] bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                                <div className="mt-1">
                                    <input 
                                        type="radio" 
                                        name="selected_address" 
                                        checked={selectedAddressId === addr.id && !isAddingNew}
                                        onChange={() => {
                                            onSelectAddress(addr.id);
                                            setIsAddingNew(false);
                                        }}
                                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-gray-900">{addr.receive_name}</span>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-gray-600">{addr.receive_phone}</span>
                                        {addr.is_default ? (
                                            <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 rounded flex-shrink-0">Mặc định</span>
                                        ) : null}
                                    </div>
                                    <div className="text-sm text-gray-500">{addr.street}</div>
                                    <div className="text-sm text-gray-500">{addr.ward}, {addr.district}, {addr.city}</div>
                                </div>
                            </label>
                        ))}
                        
                        {!isAddingNew && (
                            <button 
                                type="button" 
                                onClick={() => setIsAddingNew(true)}
                                className="flex items-center gap-2 text-sm font-medium text-[#0052cc] hover:underline mt-2 self-start"
                            >
                                <Plus size={16} /> Thêm địa chỉ mới
                            </button>
                        )}
                    </div>
                )}

                {isAddingNew && (
                <div className={`${addresses.length > 0 ? "pt-5 border-t border-gray-200 mt-2" : ""}`}>
                    {addresses.length > 0 && (
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-700">Thêm địa chỉ mới</h3>
                            <button type="button" onClick={() => setIsAddingNew(false)} className="text-sm text-red-500 hover:underline">Hủy</button>
                        </div>
                    )}
                    
                    <div className="flex flex-col gap-5">
                        <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
                        <MyInputForText
                            value={formData.receive_name}
                            onChange={(e) => setFormData(p => ({ ...p, receive_name: e.target.value }))}
                            htmlFor="receive_name"
                            title="Họ và Tên người nhận *"
                            placeholder="Nguyễn Văn A"
                            className="sm:flex-1 w-full"
                        />
                        <MyInputForText
                            value={formData.receive_phone}
                            onChange={(e) => setFormData(p => ({ ...p, receive_phone: e.target.value }))}
                            htmlFor="receive_phone"
                            title="Số điện thoại *"
                            placeholder="0123456789"
                            className="sm:flex-1"
                        />
                        </div>

                        <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
                        <MyInputForText
                            value={formData.city}
                            onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                            htmlFor="city"
                            title="Tỉnh/Thành phố *"
                            placeholder="Thành phố Hồ Chí Minh"
                            className="sm:flex-1"
                        />
                        <MyInputForText
                            value={formData.district}
                            onChange={(e) => setFormData(p => ({ ...p, district: e.target.value }))}
                            htmlFor="district"
                            title="Quận/Huyện *"
                            placeholder="Quận 1"
                            className="sm:flex-1"
                        />
                        </div>

                        <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
                        <MyInputForText
                            value={formData.ward}
                            onChange={(e) => setFormData(p => ({ ...p, ward: e.target.value }))}
                            htmlFor="ward"
                            title="Xã/Phường *"
                            placeholder="Phường Phạm Ngũ Lão"
                            className="sm:flex-1"
                        />
                        <MyInputForText
                            value={formData.street}
                            onChange={(e) => setFormData(p => ({...p, street: e.target.value}))}
                            htmlFor="street"
                            title="Số nhà, Tên đường *"
                            placeholder="273, An Dương Vương"
                            className="sm:flex-1"
                        />
                        </div>
                    </div>
                </div>
                )}
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
