import MyNavigateLink from "@/components/ui/my-navigate-link";
import MyProcessCheckout from "@/components/ui/my-process-checkout";
import {
  CartLayout,
  LeftCartLayout,
  RightCartLayout,
} from "@/layouts/client/CartLayout";
import ShippingStep from "./CheckoutStep.tsx/ShippingStep";
import { Fragment, useEffect, useMemo, useState } from "react";
import PaymentStep from "./CheckoutStep.tsx/PaymentStep";
import ConfirmStep from "./CheckoutStep.tsx/ConfirmStep";
import { getMyCart, submitCheckout, type CartItem } from "@/services/cartService";
import type { Address, CreateAddressPayload } from "@/services/addressService";
import { getAddresses, createAddress } from "@/services/addressService";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { MyBackButton } from "@/components/ui/input/my-button";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const [stepCheckOut, setStepCheckOut] = useState(1);
  const [success, setSuccess] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddressData, setNewAddressData] = useState<CreateAddressPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.unit_price * item.quantity * item.rental_days,
        0,
      ),
    [cartItems],
  );

  useEffect(() => {
    const loadCheckout = async () => {
      setIsLoading(true);

      const cartResponse = await getMyCart();
      if (cartResponse.success && cartResponse.data?.items) {
        setCartItems(cartResponse.data.items);
      }

      const addressesResponse = await getAddresses();
      const fetchedAddresses =
        addressesResponse.data?.items || addressesResponse.data?.addresses || addressesResponse.data || [];
      if (Array.isArray(fetchedAddresses) && fetchedAddresses.length > 0) {
        setAddresses(fetchedAddresses);
        const selectedAddress =
            fetchedAddresses.find((address: Address) => address.is_default) ?? fetchedAddresses[0];
        if (selectedAddress) {
          setSelectedAddressId(selectedAddress.id);
        }
      }

      setIsLoading(false);
    };

    loadCheckout();
  }, []);

  const handleSubmitOrder = async () => {
    setIsLoading(true);

    let finalAddressId = selectedAddressId;

    if (newAddressData) {
      const addrRes = await createAddress(newAddressData);
      if (addrRes.success && addrRes.data) {
        // Backend returns either data.address or directly the object depending on your API structure. Adjust as needed.
        const createdAddressId = addrRes.data.id || addrRes.data.address?.id;
        if (createdAddressId) {
            finalAddressId = createdAddressId;
        }
      } else {
        toast.error("Không thể tạo địa chỉ mới!");
        setIsLoading(false);
        return;
      }
    }

    const res = await submitCheckout({
      address_id: finalAddressId,
      note: "Customer order",
    });
    setIsLoading(false);

    if (res.success) {
      toast.success("Order Placed Successfully!");
      setSuccess(true);
      setCartItems([]);
    } else {
      toast.error(res.message || "Checkout failed");
    }
  };

  if (success)
    return (
      <>
        <div className="flex flex-col w-full min-h-140 items-center gap-7 pt-10">
          <div className="flex justify-center items-center rounded-full bg-green-200 h-20 w-20">
            <Check size={40} className="text-green-600" />
          </div>
          <div className="text-2xl font-semibold">Thanh toán thành công!</div>
          <MyBackButton
            text="Quay về trang chủ"
            className="px-5 bg-white"
            onHandle={() => {
              setSuccess(false);
              navigate("/");
            }}
          />
        </div>
      </>
    );
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
          {stepCheckOut == 1 && (
            <ShippingStep 
              onChange={setStepCheckOut} 
              addresses={addresses} 
              selectedAddressId={selectedAddressId}
              onSelectAddress={setSelectedAddressId}
              onNewAddressData={setNewAddressData} 
            />
          )}
          {stepCheckOut == 2 && <PaymentStep onChange={setStepCheckOut} />}
          {stepCheckOut == 3 && (
            <ConfirmStep
              onChange={setStepCheckOut}
              items={cartItems}
              submitOrder={handleSubmitOrder}
            />
          )}
        </LeftCartLayout>
        <RightCartLayout>
          <div className="w-full flex flex-col border-gray-300 bg-white border p-5 rounded-lg gap-3">
            <div className="text-lg font-semibold">Order Summary</div>
            <div className="flex flex-col w-full bg-white gap-2">
              {isLoading ? (
                <div className="rounded-xl border border-gray-200 bg-white p-5 text-center text-gray-500">
                  Đang tải đơn hàng...
                </div>
              ) : cartItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5 text-center text-gray-500">
                  Giỏ hàng trống
                </div>
              ) : (
                cartItems.map((item) => {
                  const name =
                    item.product?.name ?? item.combo?.name ?? "Unknown item";
                  const itemTotal =
                    item.unit_price * item.quantity * item.rental_days;
                  return (
                    <Fragment key={item.id}>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="w-full flex flex-col gap-1">
                          <div className="text-xs font-semibold">{name}</div>
                          <div className="text-xs text-gray-500">
                            {item.quantity} x {item.rental_days} ngày
                          </div>
                        </div>
                        <div className="text-xs font-bold">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(itemTotal)}
                        </div>
                      </div>
                      <hr />
                    </Fragment>
                  );
                })
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Subtotal</div>
                <div className="text-sm font-semibold">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(subtotal)}
                </div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-sm text-gray-500">Delivery</div>
                <div className="text-sm text-green-600 font-semibold">Free</div>
              </div>
            </div>
            <hr />
            <div className="flex flex-row justify-between items-center">
              <div className="text-lg font-medium">Total</div>
              <div className="text-lg font-semibold">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(subtotal)}
              </div>
            </div>
          </div>
        </RightCartLayout>
      </div>
    </CartLayout>
  );
}
