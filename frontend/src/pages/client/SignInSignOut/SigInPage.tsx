import { MyHrefText } from "@/components/ui/input/my-href";
import { MyInputCheckbox } from "@/components/ui/input/my-input-checkbox";
import { MyButton, MyGoogleButton } from "@/components/ui/input/my-button";
import MyHref from "@/components/ui/my-href";
import {
  MyInputForTextIcon,
  MyInputForTextPass,
} from "@/components/ui/input/my-input-text";
import { getMe, signin } from "@/services/usersService";
import { checkToken } from "@/services/userTokensService";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

interface Role {
  id: number;
  name: string;
}

export default function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);

  const getRedirectPathByRole = (roles: string[] | undefined) => {
    if (roles?.includes("ADMIN")) return "/admin";
    return "/";
  };

  useEffect(() => {
    async function validateToken() {
      const res = await checkToken();
      if (!res.success) {
        return;
      }

      const me = await getMe();
      if (!me?.success) {
        return;
      }

      const roles = me?.data?.roles as string[] | undefined;
      navigate(getRedirectPathByRole(roles), { replace: true });
    }
    void validateToken();
  }, [navigate]);

  const handleSignIn = async () => {
    const res = await signin(email, password, isRemember);

    if (res.success) {
      const userData = res.data.user;

      // Kiểm tra user có bị khóa không
      if (userData.status !== 'ACTIVE') {
        toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
        return;
      }

      toast.success("Đăng nhập thành công!");

      const token = res.data.token.access_token || res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      // Lấy roles từ userData để redirect
      const roles = userData?.roles?.map((role: Role) => role.name);
      const redirectPath = getRedirectPathByRole(roles);
      navigate(redirectPath, { replace: true });
    } else {
      // Xử lý lỗi từ backend
      if (res.code === 'FORBIDDEN' || res.message?.includes('khóa')) {
        toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
      } else {
        toast.error(res.message || "Sai email hoặc mật khẩu!");
      }
    }
  };
  
  const textLeftPanel = [
    "500+ professional tech products",
    "Flexible daily, weekly & monthly plans",
    "Free delivery on orders over $200",
    "24/7 expert support",
  ];

  return (
    <>
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        {/* Left Panel */}
        <div className="lg:flex flex-1 h-full bg-blue-700 hidden justify-center items-center">
          <div className="flex flex-col justify-between items-center gap-3 p-5">
            <div className="flex justify-center items-center bg-white/20 p-5 w-fit rounded-2xl aspect-square">
              <div className="text-2xl text-white font-bold">RT</div>
            </div>
            <div className="text-white text-3xl font-semibold">
              Welcome back to RentalTech
            </div>
            <div className="text-white text-lg">
              Your gateway to premium tech equipment rentals.
            </div>
            <div className="flex flex-col w-full gap-2">
              {textLeftPanel.map((item, index) => {
                return (
                  <Fragment key={index}>
                    <div className="flex flex-row w-full justify-start items-center gap-2">
                      <div className="rounded-full p-1 bg-white/20">
                        <Check size={18} className="text-white" />
                      </div>
                      <div className="text-white">{item}</div>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-1 h-full bg-white justify-center items-center px-10">
          <div className="flex flex-col w-full max-w-100 gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-2xl font-semibold">Đăng nhập tài khoản</div>
              <div className="flex flex-row items-center gap-2">
                <div className="text-gray-500">Bạn chưa có tài khoản?</div>
                <MyHref text="Đăng ký" src="/signup" />
              </div>
            </div>
            <div className="flex w-full flex-col">
              <MyInputForTextIcon
                defaultValue=""
                onChange={setEmail}
                htmlFor="email"
                icon={Mail}
                placeholder="Nhập email của bạn"
                title="Email"
                className=""
              />
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <MyInputForTextPass
                defaultValue=""
                htmlFor="password"
                onChange={setPassword}
                placeholder="Nhập mật khẩu của bạn"
                title="Mật khẩu"
                className=""
              />
              <div className="flex w-full flex-row justify-between items-center">
                <MyInputCheckbox
                  htmlFor="save-account"
                  text="Ghi nhớ 30 ngày"
                  checked={isRemember}
                  onChange={setIsRemember}
                />
                <MyHref text="Quên mật khẩu" src="#" />
              </div>
            </div>
            <MyButton
              text="Đăng nhập"
              icon={ArrowRight}
              onClick={handleSignIn}
            />
            <MyHrefText text="Hoặc đăng nhập với" />
            <MyGoogleButton className="" onHandle={() => { }} />
          </div>
        </div>
      </div>
    </>
  );
}