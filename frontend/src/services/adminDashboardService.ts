import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

export class AdminDashboardApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AdminDashboardApiError";
    this.status = status;
  }
}

export type DashboardCards = {
  total_revenue: number;
  total_orders: number;
  active_products: number;
  new_users: number;
};

export type RevenueOverviewItem = {
  month: string;
  revenue: number;
  orders: number;
};

export type RentalByCategoryItem = {
  category: string;
  rentals: number;
  revenue: number;
};

export type RecentOrderItem = {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: string;
  date: string | null;
};

export type DashboardPayload = {
  cards: DashboardCards;
  revenue_overview: RevenueOverviewItem[];
  rental_by_category: RentalByCategoryItem[];
  recent_orders: RecentOrderItem[];
};

type DashboardApiResponse = {
  success: boolean;
  message: string;
  data?: {
    dashboard?: DashboardPayload;
  };
};

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAdminDashboard(): Promise<DashboardPayload> {
  try {
    const response = await axios.get<DashboardApiResponse>(
      `${API_BASE_URL}${API_ENDPOINTS.adminDashboard}`,
      {
        headers: getAuthHeader(),
      },
    );

    const dashboard = response.data.data?.dashboard;
    if (!dashboard) {
      throw new AdminDashboardApiError("Dashboard payload is missing");
    }

    return dashboard;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to load dashboard";

      throw new AdminDashboardApiError(message, status);
    }

    throw new AdminDashboardApiError("Failed to load dashboard");
  }
}
