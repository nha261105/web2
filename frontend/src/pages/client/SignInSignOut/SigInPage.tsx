import { MyHrefText } from "@/components/ui/input/my-href";
import { MyInputCheckbox } from "@/components/ui/input/my-input-checkbox";
import { MyButton, MyGoogleButton } from "@/components/ui/input/my-button";
import MyHref from "@/components/ui/my-href";
import {
  MyInputForTextIcon,
  MyInputForTextPass,
} from "@/components/ui/input/my-input-text";
import { getAuthMe, signin } from "@/services/usersService";
import { checkToken } from "@/services/userTokensService";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

function extractRoles(payload: unknown): string[] {
  const data = payload as
    | {
        roles?: string[];
        user?: { roles?: Array<{ name?: string }> };
      }
    | undefined;

  if (Array.isArray(data?.roles)) {
    return data.roles;
  }

  if (Array.isArray(data?.user?.roles)) {
    return data.user.roles
      .map((role) => role?.name)
      .filter((name): name is string => Boolean(name));
  }

  return [];
}

function extractPermissions(payload: unknown): string[] {
  const data = payload as
    | {
        permissions?: string[];
        user?: { permissions?: string[] };
      }
    | undefined;

  if (Array.isArray(data?.permissions)) {
    return data.permissions;
  }

  if (Array.isArray(data?.user?.permissions)) {
    return data.user.permissions;
  }

  return [];
}

const ADMIN_ENTRY_PREFIXES = [
  "ADMIN_",
  "RBAC_",
  "USER_",
  "PRODUCT_",
  "CATEGORY_",
  "BRAND_",
  "COMBO_",
  "COUPON_",
  "RENTAL_",
  "RETURN_ORDER_",
  "TRANSACTION_",
  "RENTAL_POLICY_",
  "RENTAL_ISSUE_",
];

function hasAdminAccess(roles: string[] | undefined, permissions: string[]) {
  return Boolean(
    roles?.includes("ADMIN") ||
    permissions.some((permission) =>
      ADMIN_ENTRY_PREFIXES.some((prefix) => permission.startsWith(prefix)),
    ),
  );
}

export default function SignInPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);

  const getRedirectPath = (
    roles: string[] | undefined,
    permissions: string[],
  ) => {
    const canAccessAdmin = hasAdminAccess(roles, permissions);

    // Ưu tiên vào admin nếu tài khoản có quyền admin, bỏ qua redirect param.
    if (canAccessAdmin) return "/admin";

    // Nếu không có quyền admin thì mới dùng redirect param.
    const redirectParam = searchParams.get("redirect");
    if (redirectParam) return redirectParam;
    return "/";
  };

  useEffect(() => {
    async function validateToken() {
      const res = await checkToken();
      if (!res.success) {
        return;
      }

      const me = await getAuthMe();
      if (!me?.success) {
        return;
      }

      const roles = extractRoles(me?.data);
      const permissions = extractPermissions(me?.data);
      navigate(getRedirectPath(roles, permissions), { replace: true });
    }
    void validateToken();
  }, [navigate]);

  const handleSignIn = async () => {
    const res = await signin(email, password, isRemember);

    if (res.success) {
      const payload = (res.data?.data ?? res.data) as {
        user?: {
          status?: string;
          roles?: Array<{ id: number; name: string }>;
          permissions?: string[];
        };
        token?: { access_token?: string } | string;
        roles?: string[];
        permissions?: string[];
      };
      const userData = payload.user;

      if (!userData) {
        toast.error("Khong lay duoc thong tin nguoi dung");
        return;
      }

      // Kiểm tra user có bị khóa không
      if (userData.status !== "ACTIVE") {
        toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
        return;
      }

      toast.success("Đăng nhập thành công!");

      const token =
        typeof payload.token === "string"
          ? payload.token
          : payload.token?.access_token;

      if (!token) {
        toast.error("Khong lay duoc token dang nhap");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      localStorage.setItem(
        "auth_permissions",
        JSON.stringify(payload.permissions ?? userData.permissions ?? []),
      );

      const roles = extractRoles(payload);
      const permissions = extractPermissions(payload);
      const redirectPath = getRedirectPath(roles, permissions);
      navigate(redirectPath, { replace: true });
    } else {
      // Xử lý lỗi từ backend
      if (res.code === "FORBIDDEN" || res.message?.includes("khóa")) {
        toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
      } else {
        toast.error(res.message || "Sai email hoặc mật khẩu!");
      }
    }
  };

  const textLeftPanel = [
    "500+ professional tech products",
    "Flexible daily, weekly & monthly plans",
    "Miễn phí vận chuyển đơn từ 500.000₫",
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
            <MyGoogleButton className="" onHandle={() => {}} />
          </div>
        </div>
      </div>
    </>
  );
}
