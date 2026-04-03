import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

export type PenaltyIssue = {
  id: number;
  rental_id: number;
  rental_detail_id: number;
  type: "LATE" | "DAMAGED" | "LOST";
  description: string;
  penalty_fee: number;
  status: "PENDING" | "RESOLVED";
  meta?: {
    late_days?: number | null;
    late_rate_percent?: number | null;
    damage_percent?: number | null;
    base_amount?: number | null;
    force_lost_by_late?: boolean;
  };
  rental?: {
    id: number;
    code: string;
    status: string;
    user?: {
      id: number;
      full_name: string;
      email: string;
    } | null;
  } | null;
  item?: {
    id: number;
    quantity: number;
    product?: {
      id: number;
      name: string;
    } | null;
  } | null;
  transactions?: Array<{
    id: number;
    type: string;
    amount: number;
    payment_method: string;
    status: string;
    created_at: string;
  }>;
};

export type PenaltyListParams = {
  page?: number;
  per_page?: number;
  status?: "PENDING" | "RESOLVED";
  type?: "LATE" | "DAMAGED" | "LOST";
};

type PenaltyApiResponse = {
  success: boolean;
  message: string;
  data?: {
    items?: PenaltyIssue[];
    rental_issue?: PenaltyIssue;
    meta?: {
      total: number;
      current_page: number;
      per_page: number;
      last_page: number;
    };
  };
};

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function parseMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    return data?.message ?? error.message ?? fallback;
  }

  return fallback;
}

export async function getAdminPenalties(params: PenaltyListParams = {}) {
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 20;

  try {
    const response = await axios.get<PenaltyApiResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.rentalIssues}`,
      {
        params: {
          page,
          per_page: perPage,
          status: params.status,
          type: params.type,
        },
        headers: getAuthHeader(),
      },
    );

    const items = response.data.data?.items ?? [];
    const meta = response.data.data?.meta;

    return {
      items,
      total: meta?.total ?? items.length,
      current_page: meta?.current_page ?? page,
      per_page: meta?.per_page ?? perPage,
      last_page: meta?.last_page ?? 1,
    };
  } catch (error) {
    throw new Error(parseMessage(error, "Không thể tải danh sách khoản phạt"));
  }
}

export async function getMyPenalties(params: PenaltyListParams = {}) {
  const page = params.page ?? 1;
  const perPage = params.per_page ?? 20;

  try {
    const response = await axios.get<PenaltyApiResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.myRentalIssues}`,
      {
        params: {
          page,
          per_page: perPage,
          status: params.status,
          type: params.type,
        },
        headers: getAuthHeader(),
      },
    );

    const items = response.data.data?.items ?? [];
    const meta = response.data.data?.meta;

    return {
      items,
      total: meta?.total ?? items.length,
      current_page: meta?.current_page ?? page,
      per_page: meta?.per_page ?? perPage,
      last_page: meta?.last_page ?? 1,
    };
  } catch (error) {
    throw new Error(parseMessage(error, "Không thể tải khoản phạt của bạn"));
  }
}

export async function updatePenaltyIssue(
  issueId: number,
  payload: {
    penalty_fee?: number;
    status?: "PENDING" | "RESOLVED";
    description?: string;
  },
): Promise<PenaltyIssue> {
  try {
    const response = await axios.patch<PenaltyApiResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.rentalIssues}/${issueId}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const issue = response.data.data?.rental_issue;
    if (!issue) {
      throw new Error("Không có dữ liệu khoản phạt trả về");
    }

    return issue;
  } catch (error) {
    throw new Error(parseMessage(error, "Không thể cập nhật khoản phạt"));
  }
}
