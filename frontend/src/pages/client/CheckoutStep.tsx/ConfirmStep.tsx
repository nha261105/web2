import { MyBackButton, MyButton } from "@/components/ui/my-button";
import { MyFrameWithInfo } from "@/components/ui/my-frame";
import { ArrowRight, Search } from "lucide-react";

type ConfirmStepType = {
  onChange: (value: number) => void;
};

export default function ConfirmStep({ onChange }: ConfirmStepType) {
  return (
    <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-8">
      <div className="flex flex-row gap-2 items-center">
        <Search size={20} className="text-blue-700" />
        <div className="text-base font-semibold">Xem lại đơn hàng của bạn</div>
      </div>
      <div className="w-full flex flex-col gap-5">
        <MyFrameWithInfo
          title="Bank Transfer Details"
          txts={[
            "Bank: Chase Business",
            "Account: **** **** 4321",
            "Routing: 021000021",
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
            text="Xác nhận"
            classname="flex-1"
            onClick={() => onChange(2)}
            icon={<ArrowRight size={20} className="text-white" />}
          />
        </div>
      </div>
    </div>
  );
}
