import axios from "axios";

export interface DashboardMetrics {
  total_users: number;
  total_products: number;
  total_rentals: number;
  pending_rentals: number;
  total_revenue: number;
  revenue_this_month: number;
  users_this_month: number;
  active_rentals: number;
}

export interface RevenueData {
  month: string;
  amount: number;
}

export interface CategoryRentalData {
  category_name: string;
  rental_count: number;
}

export interface AdminReportsData {
  metrics: DashboardMetrics;
  revenue_trends?: RevenueData[];
  category_rentals?: CategoryRentalData[];
}

export class AdminApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminReports(): Promise<AdminReportsData> {
  try {
    const response = await axios.get("/api/admin/dashboard", {
      headers: getAuthHeader(),
    });

    if (!response.data.success) {
      throw new AdminApiError(
        response.data.message || "Failed to load reports",
      );
    }

    return response.data.data || {};
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to load reports";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError(
      error instanceof Error ? error.message : "Failed to load reports",
    );
  }
}

/**
 * Calculate monthly revenue for the last 6 months
 * (Mock data generator - would be replaced with real API if available)
 */
export function generateRevenueData(totalRevenue: number): RevenueData[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const baseAmount = totalRevenue / 6;

  return months.map((month) => ({
    month,
    amount: Math.round(baseAmount * (0.7 + Math.random() * 0.6)),
  }));
}

/**
 * Calculate category distribution for rentals
 * (Mock data generator - would be replaced with real API if available)
 */
export function generateCategoryData(
  totalRentals: number,
): CategoryRentalData[] {
  const categories = ["Construction", "Garden", "Outdoor", "Camping", "Sports"];
  const baseCount = Math.floor(totalRentals / categories.length);

  return categories.map((category) => ({
    category_name: category,
    rental_count: baseCount + Math.floor(Math.random() * (baseCount * 0.5)),
  }));
}
