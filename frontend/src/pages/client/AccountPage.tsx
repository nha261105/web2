import { MyButton } from "@/components/ui/input/my-button";
import { useState } from "react";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(false);

  return (
    <div className="w-full flex-1 flex flex-col gap-3 justify-center items-center bg-gray-50 px-5">
      {!isLogin && (
        <>
          <div className="text-base font-semibold text-gray-500">
            Vui lòng đăng nhập tài khoản.
          </div>
          {/* <MyButton
            text="Đăng nhập"
            classname="w-fit px-3"
            src="/signin"
            onClick={() => {}}
        /> */}
          <MyButton
            text="Test"
            classname="w-fit px-3"
            onClick={() => {
              setIsLogin(true);
            }}
          />
        </>
      )}
      {isLogin && <></>}
    </div>
  );
}
