import { useState, useEffect } from "react";
import { Plus, Edit, Trash, Search, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getCombos,
  createCombo,
  updateCombo,
  deleteCombo,
  type Combo,
  type CreateComboPayload,
} from "@/services/comboService";
import { getProducts } from "@/services/catalogService";

export default function AdminCombos() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCombo, setCurrentCombo] = useState<Combo | null>(null);

  const [formData, setFormData] = useState<CreateComboPayload>({
    name: "",
    description: "",
    daily_price: 0,
    items: [],
  });
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [combosRes, productsRes] = await Promise.all([
      getCombos(),
      getProducts(),
    ]);
    if (combosRes.success && combosRes.data) {
      setCombos(combosRes.data.items || combosRes.data);
    }
    // Set products to array inside promise
    setProducts(productsRes || []);
    setIsLoading(false);
  };

  const handleOpenModal = (combo?: Combo) => {
    if (combo) {
      setCurrentCombo(combo);
      setFormData({
        name: combo.name,
        description: combo.description || "",
        daily_price: combo.daily_price,
        items:
          combo.combo_details?.map((d: any) => ({
            product_id: d.product_id,
            quantity: d.quantity,
          })) || [],
      });
    } else {
      setCurrentCombo(null);
      setFormData({
        name: "",
        description: "",
        daily_price: 0,
        items: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.daily_price || formData.items.length === 0) {
      toast.error("Vui lòng điền đủ thông tin và chọn ít nhất 1 sản phẩm");
      return;
    }

    setIsSubmitting(true);
    let res;
    if (currentCombo) {
      res = await updateCombo(currentCombo.id, formData);
    } else {
      res = await createCombo(formData);
    }

    setIsSubmitting(false);
    if (res.success) {
      toast.success(
        currentCombo ? "Cập nhật combo thành công" : "Tạo combo thành công"
      );
      setIsModalOpen(false);
      fetchData();
    } else {
      toast.error(res.message || "Lỗi khi lưu combo");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa combo này?")) {
      const res = await deleteCombo(id);
      if (res.success) {
        toast.success("Xóa combo thành công");
        fetchData();
      } else {
        toast.error(res.message || "Không thể xóa combo");
      }
    }
  };

  const addProductToCombo = () => {
    if (!selectedProduct || selectedQuantity < 1) return;
    const pid = Number(selectedProduct);
    const exist = formData.items.find((i) => i.product_id === pid);
    if (exist) {
      setFormData({
        ...formData,
        items: formData.items.map((i) =>
          i.product_id === pid
            ? { ...i, quantity: i.quantity + selectedQuantity }
            : i
        ),
      });
    } else {
      setFormData({
        ...formData,
        items: [...formData.items, { product_id: pid, quantity: selectedQuantity }],
      });
    }
  };

  const removeProductFromCombo = (pid: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((i) => i.product_id !== pid),
    });
  };

  const filteredCombos = combos.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 border-b border-[#0052cc] inline-block pb-1">
            Quản Lý Combo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập các góI combo để cho thuê
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#0052CC] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" /> Thêm Combo Mới
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm combo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] transition"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#0052cc]" />
            <span className="text-sm">Đang tải dữ liệu...</span>
          </div>
        ) : filteredCombos.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            Không tìm thấy combo nào.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Combo</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Giá (Ngày)</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase">Thành phần</th>
                  <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCombos.map((combo) => (
                  <tr key={combo.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{combo.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{combo.description}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      {Number(combo.daily_price).toLocaleString("vi-VN")}₫
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <ul className="list-disc list-inside">
                        {combo.combo_details?.map((d: any) => (
                          <li key={d.id} className="text-xs">
                            {d.quantity}x {d.product?.name || `Product #${d.product_id}`}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(combo)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(combo.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5 border-b pb-3">
                {currentCombo ? "Cập nhật Combo" : "Thêm Combo Trống"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Tên Combo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0052cc] focus:border-[#0052cc] sm:text-sm"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Giá Thuê (VNĐ/Ngày)</label>
                  <input
                    type="number"
                    value={formData.daily_price}
                    onChange={(e) => setFormData({ ...formData, daily_price: Number(e.target.value) })}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0052cc] focus:border-[#0052cc] sm:text-sm"
                    required
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Mô tả</label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-[#0052cc] focus:border-[#0052cc] sm:text-sm"
                    rows={3}
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <label className="text-sm font-semibold text-gray-900">Sản phẩm trong Combo</label>
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      className="flex-1 border-gray-300 rounded-lg text-sm"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      className="w-20 border-gray-300 rounded-lg text-sm"
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                    />
                    <button
                      type="button"
                      onClick={addProductToCombo}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
                    >
                      Thêm
                    </button>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    {formData.items.map((item, idx) => {
                      const prod = products.find((p) => p.id == item.product_id);
                      return (
                        <div key={idx} className="flex justify-between items-center text-sm p-2 bg-gray-50 border border-gray-100 rounded-lg">
                          <span>{prod?.title || `ID: ${item.product_id}`}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">x{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => removeProductFromCombo(item.product_id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {formData.items.length === 0 && (
                      <p className="text-xs text-gray-500 italic">Chưa có sản phẩm nào được chọn.</p>
                    )}
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-gray-100 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#0052cc] text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {currentCombo ? "Cập nhật" : "Lưu Combo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
