import { useState } from "react";
import { Camera, Save, User, Loader2 } from "lucide-react";
import {  updateMe } from "@/services/usersService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
}

interface ProfilePageProps {
  user: {
    full_name: string;
    email: string;
    phone: string;
  };
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileForm>({
    name: user.full_name ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
  });

  // ─── Submit cập nhật ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateMe({
      name: form.name,
      phone: form.phone,
    });
    if (res.success) {
      toast.success("Cập nhật thông tin thành công!");
    } else {
      toast.error(res.message || "Cập nhật thất bại");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-3">
      {/* Avatar card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Profile Photo
        </h2>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-gray-400" />
            </div>
            <button
              type="button"
              className="absolute -bottom-2 -right-2 w-7 h-7 bg-[#0052CC] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#0747A6] transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {form.name || "—"}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {form.email || "—"}
            </p>
            <button
              type="button"
              className="h-8 px-4 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              Change Photo
            </button>
          </div>
        </div>
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">
          Personal Information
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Họ và tên"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                readOnly
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-400 cursor-not-allowed outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="0901234567"
                className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="h-10 px-6 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? "Đang lưu..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">
          Account Overview
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Địa chỉ",
              color: "bg-purple-50 text-purple-600",
              tab: "addresses",
            },
            {
              label: "Đơn thuê",
              color: "bg-blue-50 text-[#0052CC]",
              tab: "orders",
            },
            {
              label: "Cài đặt",
              color: "bg-gray-50 text-gray-600",
              tab: "settings",
            },
          ].map((item) => (
            <button
              key={item.tab}
              type="button"
              onClick={() => navigate(`/account?tab=${item.tab}`)}
              className={`rounded-xl p-4 text-left transition-opacity hover:opacity-80 ${item.color.split(" ")[0]}`}
            >
              <p className={`text-sm font-semibold ${item.color.split(" ")[1]}`}>
                {item.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}