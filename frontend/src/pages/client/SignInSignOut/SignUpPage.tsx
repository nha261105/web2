import { MyHrefText } from "@/components/ui/input/my-href";
import { MyInputCheckbox } from "@/components/ui/input/my-input-checkbox";
import { MyButton, MyGoogleButton } from "@/components/ui/input/my-button";
import MyHref from "@/components/ui/my-href";
import {
  MyInputForTextIcon,
  MyInputForTextPass,
} from "@/components/ui/input/my-input-text";
import { signup } from "@/services/usersService";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAccept, setIsAccept] = useState(false);

  const handleSignUp = async () => {
    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    if (!fullName || !email.trim() || !phone.trim() || !password) {
      toast.error("Vui long nhap day du thong tin");
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      toast.error("So dien thoai phai co 10 chu so");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Mat khau nhap lai khong khop");
      return;
    }

    if (!isAccept) {
      toast.error("Ban can dong y dieu khoan");
      return;
    }

    const result = await signup(email.trim(), password, fullName, phone.trim());

    if (result.success) {
      localStorage.removeItem("token");
      toast.success("Dang ky thanh cong, vui long dang nhap");
      navigate("/signin", { replace: true });
      return;
    }

    toast.error(result.message || "Dang ky that bai");
  };

  const textLeftPanel = [
    "500+ products",
    "Free delivery $200+",
    "Hỗ trợ 24/7",
    "4.9★ Rating",
  ];

  return (
    <>
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        {/* Left Panel */}
        <div className="lg:flex flex-1 h-full bg-orange-500 hidden justify-center items-center">
          <div className="flex flex-col justify-between items-center gap-3 p-5">
            <div className="flex justify-center items-center bg-white/20 p-5 w-fit rounded-2xl aspect-square">
              <div className="text-2xl text-white font-bold">RT</div>
            </div>
            <div className="text-white text-3xl font-semibold">
              Join 12,000+ happy renter
            </div>
            <div className="text-white text-lg">
              Create your free account and start renting today.
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
              <div className="text-2xl font-semibold">Đăng ký tài khoản</div>
              <div className="flex flex-row items-center gap-2">
                <div className="text-gray-500">Bạn đã có tài khoản?</div>
                <MyHref text="Đăng nhập" src="/signin" />
              </div>
            </div>
            <div className="w-full flex flex-row gap-x-3 gap-y-3 flex-wrap">
              <MyInputForTextIcon
                defaultValue=""
                htmlFor="first-name"
                title="Họ"
                placeholder="Nguyễn Thanh"
                className="sm:flex-1"
                onChange={setFirstName}
              />
              <MyInputForTextIcon
                defaultValue=""
                htmlFor="last-name"
                title="Tên"
                placeholder="Sang"
                className="sm:flex-1"
                onChange={setLastName}
              />
            </div>
            <div className="flex w-full flex-col">
              <MyInputForTextIcon
                defaultValue=""
                htmlFor="email"
                icon={Mail}
                placeholder="Nhập email của bạn"
                title="Email"
                className=""
                onChange={setEmail}
              />
            </div>
            <div className="flex w-full flex-col">
              <MyInputForTextIcon
                defaultValue=""
                htmlFor="phone"
                placeholder="Nhập số điện thoại"
                title="Số điện thoại"
                className=""
                onChange={setPhone}
              />
            </div>
            <div className="flex w-full flex-col">
              <MyInputForTextPass
                defaultValue=""
                htmlFor="password"
                placeholder="Nhập mật khẩu"
                title="Mật khẩu"
                className=""
                onChange={setPassword}
              />
            </div>
            <div className="flex w-full flex-col gap-1.5">
              <MyInputForTextPass
                defaultValue=""
                htmlFor="re-password"
                placeholder="Nhập lại mật khẩu"
                title="Nhập lại mật khẩu"
                className=""
                onChange={setConfirmPassword}
              />
              <div className="flex w-full flex-row justify-start items-center gap-1">
                <MyInputCheckbox
                  htmlFor="policy"
                  text="Tôi đồng ý với tất cả "
                  checked={isAccept}
                  onChange={setIsAccept}
                />
                <MyHref text="điều khoản" src="#" />
              </div>
            </div>
            <MyButton text="Đăng ký" icon={ArrowRight} onClick={handleSignUp} />
            <MyHrefText text="Hoặc đăng ký với" />
            <MyGoogleButton className="" onHandle={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
}
