import { useState } from "react";
import { Eye, EyeOff, Save, Bell, Shield, Trash2 } from "lucide-react";
import { changePassword } from "@/services/usersService";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    newArrivals: true,
    priceDrops: true,
    sms: false,
  });

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwords.next !== passwords.confirm) {
      toast.error("Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    if (passwords.next.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    setIsSubmitting(true);
    const res = await changePassword({
      current_password: passwords.current,
      new_password: passwords.next,
      confirm_password: passwords.confirm,
    });
    setIsSubmitting(false);

    if (res.success) {
      toast.success("Đổi mật khẩu thành công!");
      setPasswords({ current: "", next: "", confirm: "" });
    } else {
      toast.error(res.message || "Đổi mật khẩu thất bại.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Password */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#0052CC]" /> Đổi mật khẩu
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Chọn mật khẩu mạnh để bảo vệ tài khoản của bạn
        </p>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {[
            { field: "current" as const, label: "Mật khẩu hiện tại" },
            { field: "next" as const, label: "Mật khẩu mới" },
            { field: "confirm" as const, label: "Xác nhận mật khẩu mới" },
          ].map((f) => (
            <div key={f.field}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {f.label}
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={passwords[f.field]}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, [f.field]: e.target.value }))
                  }
                  placeholder="••••••••"
                  required
                  className="w-full h-10 px-3 pr-10 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                />
                {f.field === "current" && (
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPass ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-10 px-6 bg-[#0052CC] text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#0747A6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" /> {isSubmitting ? "Đang lưu..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#0052CC]" /> Thiết lập thông báo
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Chọn loại thông báo bạn muốn nhận
        </p>

        <div className="space-y-4">
          {[
            {
              key: "orderUpdates",
              label: "Cập nhật đơn hàng",
              desc: "Thay đổi trạng thái, thông báo giao hàng",
            },
            {
              key: "promotions",
              label: "Khuyến mãi & Ưu đãi",
              desc: "Chương trình ưu đãi và mã giảm giá",
            },
            {
              key: "newsletter",
              label: "Bản tin",
              desc: "Tổng hợp sản phẩm mới hàng tuần",
            },
            {
              key: "newArrivals",
              label: "Sản phẩm mới",
              desc: "Khi có sản phẩm mới được thêm vào",
            },
            {
              key: "priceDrops",
              label: "Giảm giá",
              desc: "Khi sản phẩm yêu thích giảm giá",
            },
            {
              key: "sms",
              label: "Thông báo SMS",
              desc: "Tin nhắn văn bản cập nhật đơn hàng",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between py-2"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {item.label}
                </p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  toggleNotif(item.key as keyof typeof notifications)
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications]
                    ? "bg-[#0052CC]"
                    : "bg-gray-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    notifications[item.key as keyof typeof notifications]
                      ? "translate-x-5.5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => {}}
          className="mt-5 h-10 px-6 bg-[#0052CC] text-white rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#0747A6] transition-colors"
        >
          <Save className="w-4 h-4" /> Lưu cài đặt
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-200 p-6">
        <h2 className="text-base font-semibold text-red-600 mb-1 flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Vùng nguy hiểm
        </h2>
        <p className="text-xs text-gray-500 mb-5">
          Những hành động này không thể hoàn tác
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="h-10 px-5 bg-white border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
            Xóa tài khoản
          </button>
          <button className="h-10 px-5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Xuất dữ liệu của tôi
          </button>
        </div>
      </div>
    </div>
  );
}
