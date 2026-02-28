import MyNavigateLink from "@/components/ui/my-navigate-link";
import MyProcessCheckout from "@/components/ui/my-process-checkout";
import {
  CartLayout,
  LeftCartLayout,
  RightCartLayout,
} from "@/layouts/client/CartLayout";
import ShippingStep from "./CheckoutStep.tsx/ShippingStep";
import { useState } from "react";
import PaymentStep from "./CheckoutStep.tsx/PaymentStep";
import ConfirmStep from "./CheckoutStep.tsx/ConfirmStep";

export default function CheckoutPage() {
  const [stepCheckOut, setStepCheckOut] = useState(1);
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
          position={stepCheckOut}
        />
      </div>
      <div className="w-full flex flex-row justify-between gap-10 flex-wrap">
        <LeftCartLayout>
          {stepCheckOut == 1 && <ShippingStep onChange={setStepCheckOut} />}
          {stepCheckOut == 2 && <PaymentStep onChange={setStepCheckOut} />}
          {stepCheckOut == 3 && <ConfirmStep onChange={setStepCheckOut} />}
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
