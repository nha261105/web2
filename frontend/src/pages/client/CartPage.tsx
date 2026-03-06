import MyTrash2 from "@/components/icons/my-trash2";
import { MyButton } from "@/components/ui/my-button";
import MyHref from "@/components/ui/my-href";
import { MyInputText } from "@/components/ui/my-input-text";
import MyNavigateLink from "@/components/ui/my-navigate-link";
import MyNumericInput from "@/components/ui/my-numeric-input";
import {
  CartLayout,
  LeftCartLayout,
  RightCartLayout,
} from "@/layouts/client/CartLayout";
import { ArrowRight, ShieldCheck, Tag } from "lucide-react";

export default function CartPage() {
  const products = [
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "$89/day",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "$89/day",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "$89/day",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "$89/day",
      total: "$3204",
    },
    {
      img: "https://lh7-rt.googleusercontent.com/docsz/AD_4nXd-JmBSGuLeZSkBuj38razGDVv45PcjJ6KhweCCwwHv1HfqwAwW8lY8HEba9IzJK0B_Z_9E8vcAiV02YF4jLO9eGgA6f-zqqOsCr8FtmhgCreaR5SSd9FxkuK2fr0Vdj6J_6r1tNHNmYACFiWkAs4EO1KHK?key=tE_qip6BHPL4g00JXL_X6Q",
      name: "MacBook Pro 16-inch M3 Max",
      price: "$89/day",
      total: "$3204",
    },
  ];

  return (
    <CartLayout>
      <MyNavigateLink
        items={[{ text: "Home", link: "/" }, { text: "Shopping Cart" }]}
      />
      <div className="w-full flex flex-row items-center gap-2">
        <div className="text-xl text-black font-semibold">Shopping Cart</div>
        <div className="text-lg text-gray-500 font-normal">
          ({products.length} items)
        </div>
      </div>
      <div className="w-full flex flex-row justify-between gap-10 flex-wrap">
        <LeftCartLayout>
          {products.map((item, index) => (
            <div
              className="flex flex-row border-gray-300 bg-white border p-5 rounded-lg gap-3"
              key={index}
            >
              <img
                src={item.img}
                alt="meme"
                className="w-20 h-20 rounded-lg cursor-pointer"
              />
              <div className="w-full flex flex-col justify-between">
                <div className="w-full flex flex-row justify-between">
                  <div className="flex flex-col gap-0.5">
                    <div className="text-sm font-semibold hover:cursor-pointer hover:text-blue-700">
                      {item.name}
                    </div>
                    <div className="text-xs font-medium text-gray-500">
                      {item.price}
                    </div>
                  </div>
                  <MyTrash2 size={19} />
                </div>
                <div className="w-full flex flex-row justify-between items-end">
                  <div className="flex flex-row gap-x-9 gap-y-1 flex-wrap">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-8 text-sm text-gray-500">SL:</div>
                      <MyNumericInput min={1} max={100} defaultValue={1} />
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                      <div className="w-8  text-sm text-gray-500">Ngày:</div>
                      <MyNumericInput min={1} max={100} defaultValue={1} />
                    </div>
                  </div>
                  <div className="text-sm font-bold">{item.total}</div>
                </div>
              </div>
            </div>
          ))}
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
              <MyButton text="Apply"  classname="px-3"/>
            </div>
            <div className="text-sm text-gray-500">
              Try: RENT10, FIRST15, SAVE20
            </div>
          </div>
        </LeftCartLayout>
        <RightCartLayout>
          <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-3">
            <div className="text-lg font-semibold">Order Summary</div>
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
            <div className="flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <div className="text-lg font-medium">Total</div>
                <div className="text-lg font-semibold">$385</div>
              </div>
              <MyButton
                text="Proceed to Checkout"
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
