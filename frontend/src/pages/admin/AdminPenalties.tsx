import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, PencilLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  getAdminPenalties,
  type PenaltyIssue,
  updatePenaltyIssue,
} from "@/services/penaltyService";

const ISSUE_STYLE: Record<string, string> = {
  LATE: "bg-yellow-50 text-yellow-700",
  DAMAGED: "bg-orange-50 text-orange-700",
  LOST: "bg-red-50 text-red-700",
};

const ISSUE_LABEL: Record<string, string> = {
  LATE: "Trễ hạn",
  DAMAGED: "Hư hỏng",
  LOST: "Mất mát",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  RESOLVED: "bg-green-50 text-green-700",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xử lý",
  RESOLVED: "Đã xử lý",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getPenaltyBreakdown(issue: PenaltyIssue) {
  const meta = issue.meta ?? {};

  if (issue.type === "LATE") {
    return [
      meta.late_days ? `Trễ ${meta.late_days} ngày` : null,
      meta.late_rate_percent !== undefined && meta.late_rate_percent !== null
        ? `Hệ số ${meta.late_rate_percent}%`
        : null,
    ].filter(Boolean) as string[];
  }

  if (issue.type === "DAMAGED") {
    return [
      meta.base_amount !== undefined && meta.base_amount !== null
        ? `Giá trị gốc ${formatCurrency(meta.base_amount)}`
        : null,
      meta.damage_percent !== undefined && meta.damage_percent !== null
        ? `Hư hỏng ${meta.damage_percent}%`
        : null,
    ].filter(Boolean) as string[];
  }

  return meta.force_lost_by_late
    ? ["Tự động chuyển sang mất do trả trễ > 10 ngày"]
    : [];
}

export default function AdminPenalties() {
  const [items, setItems] = useState<PenaltyIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"" | "PENDING" | "RESOLVED">(
    "",
  );
  const [typeFilter, setTypeFilter] = useState<
    "" | "LATE" | "DAMAGED" | "LOST"
  >("");
  const [selected, setSelected] = useState<PenaltyIssue | null>(null);
  const [editStatus, setEditStatus] = useState<"PENDING" | "RESOLVED">(
    "PENDING",
  );
  const [editDescription, setEditDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadPenalties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAdminPenalties({
        per_page: 100,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      });
      setItems(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tải khoản phạt");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    void loadPenalties();
  }, [loadPenalties]);

  const totalFine = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.penalty_fee || 0), 0),
    [items],
  );

  const openEdit = (issue: PenaltyIssue) => {
    setSelected(issue);
    setEditStatus(issue.status);
    setEditDescription(issue.description ?? "");
  };

  const handleSave = async () => {
    if (!selected) return;

    try {
      setIsSaving(true);
      await updatePenaltyIssue(selected.id, {
        status: editStatus,
        description: editDescription,
      });
      setSelected(null);
      await loadPenalties();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Không thể cập nhật khoản phạt",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Quản lý khoản phạt
          </h1>
          <p className="text-sm text-gray-500">Quản lý khoản phạt đơn thuê</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Tổng khoản phạt</p>
          <p className="text-lg font-bold text-gray-900">
            {formatCurrency(totalFine)}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Đang chờ xử lý</p>
          <p className="text-lg font-bold text-yellow-700">
            {items.filter((i) => i.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Đã xử lý</p>
          <p className="text-lg font-bold text-green-700">
            {items.filter((i) => i.status === "RESOLVED").length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as "" | "PENDING" | "RESOLVED")
          }
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chờ xử lý</option>
          <option value="RESOLVED">Đã xử lý</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value as "" | "LATE" | "DAMAGED" | "LOST")
          }
          className="h-9 px-3 rounded-lg border border-gray-200 text-sm"
        >
          <option value="">Tất cả loại vi phạm</option>
          <option value="LATE">Trễ hạn</option>
          <option value="DAMAGED">Hư hỏng</option>
          <option value="LOST">Mất mát</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500">
              Đang tải...
            </div>
          ) : (
            <table className="w-full min-w-245">
              <thead className="bg-gray-50">
                <tr>
                  {[
                    "Mã phạt",
                    "Mã đơn",
                    "Khách hàng",
                    "Sản phẩm",
                    "Loại",
                    "Phí",
                    "Trạng thái",
                    "Thao tác",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      Không có khoản phạt
                    </td>
                  </tr>
                ) : (
                  items.map((issue) => (
                    <tr key={issue.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-[#0052CC]">
                        #{issue.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {issue.rental?.code ?? `#${issue.rental_id}`}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {issue.rental?.user?.full_name ?? "Không rõ"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {issue.item?.product?.name ?? "Không rõ"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${ISSUE_STYLE[issue.type] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {ISSUE_LABEL[issue.type] ?? issue.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        {formatCurrency(Number(issue.penalty_fee || 0))}
                        {getPenaltyBreakdown(issue).length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {getPenaltyBreakdown(issue).map((line) => (
                              <p
                                key={line}
                                className={`text-[11px] ${line.includes("mất") ? "text-red-600" : "text-gray-500"}`}
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLE[issue.status] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {STATUS_LABEL[issue.status] ?? issue.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openEdit(issue)}
                          className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-[#0052CC] hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <PencilLine className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khoản phạt</DialogTitle>
            <DialogDescription>
              Khoản phạt #{selected?.id} -{" "}
              {selected?.rental?.code ?? "Không rõ"}
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Số tiền phạt
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={Math.round(Number(selected.penalty_fee || 0))}
                  readOnly
                  className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  Phí phạt được hệ thống tự tính theo logic trả hàng mới.
                </p>
              </div>

              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 space-y-1">
                <p className="text-xs font-semibold text-gray-600">
                  Diễn giải tính phí
                </p>
                {getPenaltyBreakdown(selected).length > 0 ? (
                  getPenaltyBreakdown(selected).map((line) => (
                    <p key={line} className="text-xs text-gray-700">
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">
                    Chưa có dữ liệu diễn giải.
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <select
                  value={editStatus}
                  onChange={(e) =>
                    setEditStatus(e.target.value as "PENDING" | "RESOLVED")
                  }
                  className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm"
                >
                  <option value="PENDING">Chờ xử lý</option>
                  <option value="RESOLVED">Đã xử lý</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full min-h-20 rounded-lg border border-gray-200 p-3 text-sm"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSelected(null)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#0052CC] hover:bg-[#0747A6]"
            >
              {isSaving ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
