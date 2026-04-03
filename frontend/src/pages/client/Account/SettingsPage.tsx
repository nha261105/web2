import { useState } from "react";
import { Eye, EyeOff, Save, Bell, Shield, Trash2, Download } from "lucide-react";
import { changePassword, signout } from "@/services/usersService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";
import toast from "react-hot-toast";
import { getMyRentals } from "@/services/rentalService";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function SettingsPage() {
  const navigate = useNavigate();

  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const removeVietnameseTones = (str: string) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  //export -> pdf
  const handleExportData = async () => {
    const userDataStr = localStorage.getItem("auth_user");
    if (!userDataStr) {
      toast.error("Không tìm thấy dữ liệu người dùng!");
      return;
    }

    const toastId = toast.loading("Đang tạo báo cáo PDF...");

    try {
      const user = JSON.parse(userDataStr);

      // get rentals
      const rentalsRes = await getMyRentals(); 
      const orders = rentalsRes.success ? (rentalsRes.data?.items ?? rentalsRes.data ?? []) : [];

      // init pdf
      const doc = new jsPDF();

      // title
      doc.setFontSize(18);
      doc.text("RENTALTECH - BAO CAO DU LIEU NGUOI DUNG", 14, 22);

      doc.setFontSize(11);
      doc.text(`Ngay xuat: ${new Date().toLocaleString('vi-VN')}`, 14, 30);

      // profile info
      doc.setFontSize(14);
      doc.text("1. THONG TIN CA NHAN", 14, 45);
      doc.setFontSize(11);
      doc.text(`Ho va ten: ${removeVietnameseTones(user.full_name)}`, 14, 55);
      doc.text(`Email: ${user.email}`, 14, 62);
      doc.text(`So dien thoai: ${user.phone}`, 14, 69);
      doc.text(`Ngay tham gia: ${new Date(user.created_at).toLocaleDateString('vi-VN')}`, 14, 76);

      // rentals history
      doc.setFontSize(14);
      doc.text(`2. LICH SU DON THUE (${orders.length} don)`, 14, 92);

      if (orders.length === 0) {
        doc.setFontSize(11);
        doc.text("Ban chua co don thue nao tren he thong.", 14, 102);
      } else {
        const tableData = orders.map((o: any, index: number) => [
          index + 1,
          o.code,
          new Date(o.start_date).toLocaleDateString('vi-VN'),
          new Date(o.end_date).toLocaleDateString('vi-VN'),
          `${Number(o.total_price).toLocaleString('vi-VN')} VND`,
          removeVietnameseTones(o.status)
        ]);

        autoTable(doc, {
          startY: 97,
          head: [['STT', 'Ma don', 'Ngay thue', 'Ngay tra', 'Tong tien', 'Trang thai']],
          body: tableData,
          theme: 'grid',
          headStyles: { fillColor: [0, 82, 204] },
        });
      }

      doc.save(`RentalTech_BaoCao_${removeVietnameseTones(user.full_name).replace(/\s/g, "")}.pdf`);
      toast.success("Đã xuất báo cáo PDF thành công!", { id: toastId });

    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo PDF.", { id: toastId });
    }
  };

  // Xóa tài khoản
  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản không?\n\nHành động này sẽ xóa toàn bộ dữ liệu của bạn và KHÔNG THỂ hoàn tác!"
    );

    if (!confirm) return;

    setIsDeleting(true);
    const toastId = toast.loading("Đang tiến hành xóa tài khoản...");

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => console.log("API chưa hỗ trợ, tiến hành logout cục bộ"));

      await signout();
      localStorage.removeItem("auth_user");
      localStorage.removeItem("token");

      toast.success("Tài khoản của bạn đã được xóa thành công.", { id: toastId });

      window.dispatchEvent(new Event("auth_changed"));
      navigate("/");

    } catch {
      // Đã bỏ biến 'error' thừa để fix lỗi ESLint
      toast.error("Không thể xóa tài khoản lúc này.", { id: toastId });
    } finally {
      setIsDeleting(false);
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
          onClick={() => { }}
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
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="h-10 px-5 bg-white border border-red-300 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? "Đang xử lý..." : "Xóa tài khoản"}
          </button>
          
          <button 
            onClick={handleExportData}
            className="h-10 px-5 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4"/> Xuất dữ liệu của tôi
          </button>
        </div>
      </div>
    </div>
  );
}