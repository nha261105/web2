import { useEffect, useState } from "react";
import { Loader2, ShoppingCart, Tag } from "lucide-react";
import toast from "react-hot-toast";
import { getCombos, type Combo } from "@/services/comboService";
import { addToCart, rentNow, type AddToCartPayload } from "@/services/cartService";
import { useNavigate } from "react-router-dom";

export default function CombosPage() {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await getCombos();
      if (res.success && res.data) {
        setCombos(res.data.items || res.data);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  const handleAddToCart = async (comboId: number, e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
      navigate("/signin");
      return;
    }

    setAddingToCart(comboId);
    const payload: AddToCartPayload = {
      combo_id: comboId,
      quantity: 1,
      rental_days: 1,
    };
    
    const res = await addToCart(payload);
    setAddingToCart(null);
    if (res.success) {
      toast.success("Đã thêm combo vào giỏ hàng");
    } else {
      toast.error(res.message || "Lỗi khi thêm vào giỏ hàng");
    }
  };

  const handleRentNow = async (comboId: number, e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để đặt thuê");
      navigate("/signin");
      return;
    }

    setAddingToCart(comboId);
    const payload: AddToCartPayload = {
      combo_id: comboId,
      quantity: 1,
      rental_days: 1,
    };
    
    const res = await rentNow(payload);
    setAddingToCart(null);
    if (res.success) {
      navigate("/checkout");
    } else {
      toast.error(res.message || "Lỗi khi đặt thuê");
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 w-full min-h-[50vh] flex flex-col items-center justify-center p-8 bg-gray-50/50">
        <Loader2 className="w-10 h-10 animate-spin text-[#0052CC]" />
        <p className="mt-4 text-gray-500 font-medium">Đang tải danh sách combo...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-gray-50">
      {/* Intro Banner */}
      <div className="bg-[#171E2C] text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <Tag className="w-12 h-12 text-[#0052CC] mx-auto mb-2" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Gói Combo Thuê</h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Tiết kiệm hơn, tiện ích hơn với các gói combo thiết bị được chúng tôi kết hợp sẵn. Hoàn hảo cho các dự án quay chụp chuyên nghiệp.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {combos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Chưa có combo nào</h3>
            <p className="text-gray-500">Hiện tại hệ thống chưa có combo thiết bị nào để cho thuê.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {combos.map((combo) => (
              <div key={combo.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col group">
                {/* Header card */}
                <div className="relative p-8 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-100 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">{combo.name}</h3>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-bold opacity-90 rounded-full relative z-10">
                    {Number(combo.daily_price).toLocaleString("vi-VN")}₫ <span className="text-xs font-medium ml-1 opacity-80">/ ngày</span>
                  </div>
                </div>

                {/* Body card */}
                <div className="p-6 flex-1 flex flex-col">
                  {combo.description && (
                    <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                      {combo.description}
                    </p>
                  )}

                  <div className="space-y-3 mb-8 flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thành phần combo</p>
                    <ul className="space-y-2">
                      {combo.combo_details?.map((detail: any) => (
                        <li key={detail.id} className="flex items-start gap-3 w-full">
                          <span className="w-6 h-6 flex-shrink-0 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center text-xs font-bold mt-0.5">
                            {detail.quantity}
                          </span>
                          <span className="text-sm text-gray-700 font-medium">
                            {detail.product ? detail.product.name : `Thiết bị #${detail.product_id}`}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-gray-100">
                    <button
                      onClick={(e) => handleAddToCart(combo.id, e)}
                      disabled={addingToCart === combo.id}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition disabled:opacity-50"
                    >
                      {addingToCart === combo.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                      Thêm
                    </button>
                    <button
                      onClick={(e) => handleRentNow(combo.id, e)}
                      disabled={addingToCart === combo.id}
                      className="flex items-center justify-center py-3 px-4 rounded-xl font-semibold bg-[#0052CC] text-white hover:bg-blue-700 transition shadow-md shadow-blue-500/20 active:translate-y-px disabled:opacity-50"
                    >
                      Thuê ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
