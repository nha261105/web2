import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ReceiptText } from "lucide-react";
import { getMyPenalties, type PenaltyIssue } from "@/services/penaltyService";
import toast from "react-hot-toast";

const ISSUE_LABEL: Record<string, string> = {
  LATE: "Trễ hạn",
  DAMAGED: "Hư hỏng",
  LOST: "Mất mát",
};

const ISSUE_STYLE: Record<string, string> = {
  LATE: "bg-yellow-50 text-yellow-700 border-yellow-200",
  DAMAGED: "bg-orange-50 text-orange-700 border-orange-200",
  LOST: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700 border-gray-200",
  RESOLVED: "bg-green-50 text-green-700 border-green-200",
};

export default function PenaltiesPage() {
  const [items, setItems] = useState<PenaltyIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"" | "PENDING" | "RESOLVED">(
    "",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const result = await getMyPenalties({
          per_page: 100,
          status: statusFilter || undefined,
        });
        if (!cancelled) {
          setItems(result.items);
        }
      } catch (e) {
        if (!cancelled) {
          toast.error(
            e instanceof Error ? e.message : "Không thể tải khoản phạt",
          );
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [statusFilter]);

  const totalFine = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.penalty_fee || 0), 0),
    [items],
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Khoản phạt của tôi
            </h2>
            <p className="text-xs text-gray-500">
              Theo dõi phí trễ hạn, hư hỏng hoặc mất mát
            </p>
          </div>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "" | "PENDING" | "RESOLVED")
            }
            className="h-9 px-3 rounded-lg border border-gray-200 text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">PENDING</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>

        <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
          <p className="text-xs text-blue-700">Tổng tiền phạt</p>
          <p className="text-lg font-bold text-blue-900">
            {formatCurrency(totalFine)}
          </p>
        </div>

        {loading ? (
          <div className="py-10 text-center text-sm text-gray-500">
            Đang tải khoản phạt...
          </div>
        ) : items.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-sm">
            <ReceiptText className="w-10 h-10 mx-auto text-gray-300 mb-2" />
            Không có khoản phạt nào
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-gray-200 p-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {issue.rental?.code ?? `Đơn #${issue.rental_id}`}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                          ISSUE_STYLE[issue.type] ??
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {ISSUE_LABEL[issue.type] ?? issue.type}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${
                          STATUS_STYLE[issue.status] ??
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {issue.status}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {issue.item?.product?.name ?? "Thiết bị"} • SL:{" "}
                      {issue.item?.quantity ?? 1}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {issue.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-500">Tiền phạt</p>
                    <p className="text-base font-bold text-gray-900">
                      {formatCurrency(Number(issue.penalty_fee || 0))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm font-medium text-amber-700 mb-1 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Lưu ý
        </p>
        <p className="text-sm text-gray-600">
          Phí trễ hạn được hệ thống tự động tính theo số ngày trễ. Phí hư
          hỏng/mất mát được admin xác nhận khi complete trả hàng.
        </p>
      </div>
    </div>
  );
}
