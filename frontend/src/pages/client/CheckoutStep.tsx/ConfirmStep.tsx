import { MyBackButton, MyButton } from "@/components/ui/my-button";
import { MyFrameWithInfo2 } from "@/components/ui/my-frame";
import { ArrowRight, Search } from "lucide-react";
import { Fragment } from "react/jsx-runtime";

type ConfirmStepType = {
  onChange: (value: number) => void;
  onSuccess: (value: boolean) => void;
};

export default function ConfirmStep({ onChange, onSuccess }: ConfirmStepType) {
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
    <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-8">
      <div className="flex flex-row gap-2 items-center">
        <Search size={20} className="text-blue-700" />
        <div className="text-base font-semibold">Xem lại đơn hàng của bạn</div>
      </div>
      <div className="flex flex-col w-full bg-white gap-3">
        {products.map((item, index) => (
          <Fragment key={index}>
            <div className="flex flex-row gap-2 items-center">
              <img
                src={item.img}
                alt="meme"
                className="w-15 h-15 rounded-md cursor-pointer"
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
            <hr />
          </Fragment>
        ))}
      </div>

      <div className="w-full flex flex-col gap-5">
        <MyFrameWithInfo2
          txts={["Gửi đến", "Thanh toán", "Thành tiền"]}
          txts2={["Nguyễn Thanh Sang", "Thẻ tín dụng", "3636 VNĐ"]}
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
            classname="flex-1 bg-orange-400 hover:bg-orange-500 active:bg-orange-600"
            onClick={() => onSuccess(true)}
            icon={<ArrowRight size={20} className="text-white" />}
          />
        </div>
      </div>
    </div>
  );
}
