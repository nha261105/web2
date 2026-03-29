import { useState, useEffect, useCallback } from "react";
import {
  Plus, Pencil, Trash2, Star, Loader2, X, Save, MapPin,
} from "lucide-react";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  type Address,
  type CreateAddressPayload,
} from "@/services/addressService";
import toast from "react-hot-toast";

// ─── Form state ───────────────────────────────────────────────────────────────
interface AddressForm {
  receive_name: string;
  receive_phone: string;
  city: string;
  district: string;
  ward: string;
  street: string;
  note: string;
  is_default: boolean;
}

interface AddressPageProps {
  userId: number;
}

const EMPTY_FORM: AddressForm = {
  receive_name: "",
  receive_phone: "",
  city: "",
  district: "",
  ward: "",
  street: "",
  note: "",
  is_default: false,
};

export default function AddressPage({ userId }: AddressPageProps) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);

  // ─── Load user id + addresses ───────────────────────────────────────────────
  const loadAddresses = useCallback(async (uid: number) => {
    const res = await getAddresses(uid);
    if (res.success) {
      setAddresses(res.data.addresses ?? res.data ?? []);
    } else {
      toast.error("Không thể tải danh sách địa chỉ");
    }
  }, []);

  useEffect(() => {
    async function init() {
      await loadAddresses(userId);
    }
    init();
  }, [userId, loadAddresses]);

  // ─── Open modal ─────────────────────────────────────────────────────────────
  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (addr: Address) => {
    setEditingId(addr.id);
    setForm({
      receive_name: addr.receive_name,
      receive_phone: addr.receive_phone,
      city: addr.city,
      district: addr.district,
      ward: addr.ward,
      street: addr.street,
      note: addr.note ?? "",
      is_default: addr.is_default,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  // ─── Submit form ────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSubmitting(true);

    const payload: CreateAddressPayload = {
      receive_name: form.receive_name,
      receive_phone: form.receive_phone,
      city: form.city,
      district: form.district,
      ward: form.ward,
      street: form.street,
      note: form.note || undefined,
      is_default: form.is_default,
    };

    const res = editingId
      ? await updateAddress(userId, editingId, payload)
      : await createAddress(userId, payload);

    if (res.success) {
      toast.success(editingId ? "Cập nhật địa chỉ thành công" : "Thêm địa chỉ thành công");
      closeModal();
      await loadAddresses(userId);
    } else {
      toast.error(res.message || "Có lỗi xảy ra");
    }
    setSubmitting(false);
  };

  // ─── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!userId) return;
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) return;

    const res = await deleteAddress(userId, id);
    if (res.success) {
      toast.success("Đã xóa địa chỉ");
      await loadAddresses(userId);
    } else {
      toast.error("Xóa địa chỉ thất bại");
    }
  };

  // ─── Set default ────────────────────────────────────────────────────────────
  const handleSetDefault = async (id: number) => {
    if (!userId) return;
    const res = await setDefaultAddress(userId, id);
    if (res.success) {
      toast.success("Đã đặt làm địa chỉ mặc định");
      await loadAddresses(userId);
    } else {
      toast.error("Thao tác thất bại");
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Địa chỉ của tôi
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {addresses.length} địa chỉ đã lưu
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex items-center gap-2 h-9 px-4 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Thêm địa chỉ
          </button>
        </div>

        {/* Empty state */}
        {addresses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3">
            <MapPin className="w-10 h-10 text-gray-300" />
            <p className="text-sm">Bạn chưa có địa chỉ nào</p>
            <button
              type="button"
              onClick={openCreate}
              className="text-sm text-[#0052CC] font-medium hover:underline"
            >
              + Thêm địa chỉ đầu tiên
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`border rounded-xl p-4 transition-colors ${
                  addr.is_default
                    ? "border-[#0052CC] bg-blue-50/40"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-gray-900">
                        {addr.receive_name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {addr.receive_phone}
                      </span>
                      {addr.is_default && (
                        <span className="text-xs px-2 py-0.5 bg-[#0052CC] text-white rounded-full font-medium">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {addr.street}, {addr.ward}, {addr.district}, {addr.city}
                    </p>
                    {addr.note && (
                      <p className="text-xs text-gray-400 mt-1 italic">
                        Ghi chú: {addr.note}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {!addr.is_default && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(addr.id)}
                        title="Đặt làm mặc định"
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 transition-colors"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openEdit(addr)}
                      title="Chỉnh sửa"
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#0052CC] hover:bg-blue-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(addr.id)}
                      title="Xóa"
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Modal thêm/sửa địa chỉ ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                {editingId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tên người nhận */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên người nhận <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.receive_name}
                    onChange={(e) => setForm((p) => ({ ...p, receive_name: e.target.value }))}
                    placeholder="Nguyễn Văn A"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                  />
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.receive_phone}
                    onChange={(e) => setForm((p) => ({ ...p, receive_phone: e.target.value }))}
                    placeholder="0901234567"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                  />
                </div>

                {/* Tỉnh/Thành phố */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tỉnh / Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    placeholder="Hồ Chí Minh"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                  />
                </div>

                {/* Quận/Huyện */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Quận / Huyện <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.district}
                    onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                    placeholder="Quận 1"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                  />
                </div>

                {/* Phường/Xã */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phường / Xã <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.ward}
                    onChange={(e) => setForm((p) => ({ ...p, ward: e.target.value }))}
                    placeholder="Phường Bến Nghé"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                  />
                </div>

                {/* Địa chỉ cụ thể */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Địa chỉ cụ thể <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.street}
                    onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))}
                    placeholder="123 Nguyễn Huệ"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                  />
                </div>

                {/* Ghi chú */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Ghi chú
                  </label>
                  <input
                    type="text"
                    value={form.note}
                    onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
                    placeholder="Giao hàng giờ hành chính..."
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:border-[#0052CC] focus:ring-2 focus:ring-[#0052CC]/20 outline-none"
                  />
                </div>
              </div>

              {/* Đặt làm mặc định */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm((p) => ({ ...p, is_default: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[#0052CC] focus:ring-[#0052CC]"
                />
                <span className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 h-10 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-10 bg-[#0052CC] text-white rounded-xl text-sm font-medium hover:bg-[#0747A6] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {submitting ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm địa chỉ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}