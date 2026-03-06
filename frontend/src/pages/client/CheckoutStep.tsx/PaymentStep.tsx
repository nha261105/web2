import { ButtonIcon, MyBackButton, MyButton } from "@/components/ui/my-button";
import {
  MyFrameWithInfo,
  MyFrameWithTextButton,
} from "@/components/ui/my-frame";
import { MyInputForText } from "@/components/ui/my-input-text";
import { ArrowRight, Building2, CreditCard, Wallet } from "lucide-react";
import { useState } from "react";

type PaymentStepType = {
  onChange: (value: number) => void;
};

export default function PaymentStep({ onChange }: PaymentStepType) {
  const [selectedOption, setSelectedOption] = useState("Credit Card");

  return (
    <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-8">
      <div className="flex flex-row gap-2 items-center">
        <CreditCard size={20} className="text-blue-700" />
        <div className="text-base font-semibold">Phương thức thanh toán</div>
      </div>
      <div className="w-full flex flex-col gap-5">
        <div className="w-full flex flex-row justify-between gap-3 items-stretch">
          <div className="w-full flex flex-row justify-between gap-3 items-stretch">
            <ButtonIcon
              className="flex-1"
              icon={CreditCard}
              onChange={setSelectedOption}
              value="Credit Card"
              selectedOption={selectedOption}
              text="Credit Card"
            />
            <ButtonIcon
              className="flex-1"
              icon={Wallet}
              onChange={setSelectedOption}
              value="PayPal"
              selectedOption={selectedOption}
              text="PayPal"
            />
            <ButtonIcon
              className="flex-1"
              icon={Building2}
              onChange={setSelectedOption}
              value="Bank Transfer"
              selectedOption={selectedOption}
              text="Bank Transfer"
            />
          </div>
        </div>

        {selectedOption === "Credit Card" && (
          <>
            {/* Số thẻ */}
            <MyInputForText
              defaultValue=""
              htmlFor="card-number"
              title="Số thẻ"
              placeholder="4242 4242 4242 4242"
              className="sm:flex-1"
            />

            {/* Tên chủ thẻ */}
            <MyInputForText
              defaultValue=""
              htmlFor="card-holder-name"
              title="Tên chủ thẻ"
              placeholder="Nguyễn Thanh Sang"
              className="sm:flex-1"
            />

            {/* Ngày hết hạn + Mã bảo mật (CVV/CVC)*/}
            <div className="w-full flex flex-row gap-x-3 gap-y-5 flex-wrap">
              <MyInputForText
                defaultValue=""
                htmlFor="expiry-date"
                title="Ngày hết hạn"
                placeholder="MM/YY"
                className="sm:flex-1"
              />
              <MyInputForText
                defaultValue=""
                htmlFor="cvv"
                title="CVV"
                placeholder="123"
                className="sm:flex-1"
              />
            </div>
          </>
        )}
        {selectedOption == "PayPal" && (
          <MyFrameWithTextButton
            txt="Click continue to be redirected to PayPal"
            onHandle={() => {
              console.log("PayPal");
            }}
          />
        )}
        {selectedOption == "Bank Transfer" && (
          <MyFrameWithInfo
            title="Bank Transfer Details"
            txts={[
              "Bank: Chase Business",
              "Account: **** **** 4321",
              "Routing: 021000021",
            ]}
          />
        )}

        <div className="flex flex-row gap-3 items-center">
          <MyBackButton
            text="Quay lại"
            className="flex-1"
            onHandle={() => {
              onChange(1);
            }}
          />
          <MyButton
            text="Xác nhận"
            classname="flex-1"
            onClick={() => onChange(3)}
            icon={<ArrowRight size={20} className="text-white" />}
          />
        </div>
      </div>
    </div>
  );
}
