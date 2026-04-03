import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export class AdminApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export type RentalOrder = {
  id: number;
  rental_id?: number;
  user_id: number;
  user?: { id: number; name?: string; full_name?: string; email: string };
  details?: RentalOrderDetail[];
  products?: Array<{
    id: number;
    title?: string;
    name?: string;
    daily_rate?: number;
  }>;
  start_date: string;
  end_date: string;
  rental_days?: number;
  total_price?: number;
  total_amount?: number;
  status:
    | "PENDING"
    | "APPROVED"
    | "DEPOSITED"
    | "PICKED_UP"
    | "COMPLETED"
    | "CANCELLED";
  payment_status?: "PENDING" | "PAID" | "REFUNDED";
  created_at: string;
  updated_at: string;
};

export type RentalOrderDetail = {
  id: number;
  rental_id?: number;
  product_id?: number | null;
  combo_id?: number | null;
  quantity: number;
  price_at_rental: number;
  product?: {
    id: number;
    name: string;
    deposit_price: number;
  } | null;
  combo?: {
    id: number;
    name: string;
  } | null;
};

export type ReturnInspectionItem = {
  rental_detail_id: number;
  violation_type: "GOOD" | "DAMAGED" | "LOST";
  damage_percent?: number;
  note?: string;
};

export type CompleteReturnResult = {
  return_order: {
    id: number;
    rental_id: number;
    return_date: string;
  };
  summary: {
    late_days: number;
    force_lost_by_late?: boolean;
    late_fee_total: number;
    condition_fee_total: number;
    total_fine: number;
    issue_ids: number[];
  };
};

export type CreateRentalPayload = {
  user_id: number;
  product_ids: number[];
  start_date: string;
  end_date: string;
};

export type UpdateRentalPayload = {
  status?: string;
  payment_status?: string;
};

type RentalsApiResponse = {
  success: boolean;
  message: string;
  data?: {
    items?: RentalOrder[];
    rental?: RentalOrder;
    return_order?: {
      id: number;
      rental_id: number;
      return_date: string;
    };
    summary?: {
      late_days: number;
      force_lost_by_late?: boolean;
      late_fee_total: number;
      condition_fee_total: number;
      total_fine: number;
      issue_ids: number[];
    };
    meta?: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
};

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getAdminOrders(
  page = 1,
  limit = 10,
  status?: string,
): Promise<{
  orders: RentalOrder[];
  total: number;
  page: number;
  lastPage: number;
}> {
  try {
    let url = `${API_BASE_URL}/api/rentals?page=${page}&per_page=${limit}`;
    if (status) url += `&status=${encodeURIComponent(status)}`;

    const response = await axios.get<RentalsApiResponse>(url, {
      headers: getAuthHeader(),
    });

    const rentals = response.data.data?.items ?? [];
    const meta = response.data.data?.meta;

    return {
      orders: rentals,
      total: meta?.total ?? rentals.length,
      page: meta?.current_page ?? page,
      lastPage: meta?.last_page ?? 1,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to load orders";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to load orders");
  }
}

export async function createAdminOrder(
  payload: CreateRentalPayload,
): Promise<RentalOrder> {
  try {
    const response = await axios.post<RentalsApiResponse>(
      `${API_BASE_URL}/api/rentals`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const rental = response.data.data?.rental;
    if (!rental) {
      throw new AdminApiError("Order creation returned no data");
    }

    return rental;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to create order";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to create order");
  }
}

export async function updateAdminOrder(
  rentalId: number,
  payload: UpdateRentalPayload,
): Promise<RentalOrder> {
  try {
    const response = await axios.patch<RentalsApiResponse>(
      `${API_BASE_URL}/api/rentals/${rentalId}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    const rental = response.data.data?.rental;
    if (!rental) {
      throw new AdminApiError("Order update returned no data");
    }

    return rental;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to update order";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to update order");
  }
}

export async function getAdminOrder(rentalId: number): Promise<RentalOrder> {
  try {
    const response = await axios.get<RentalsApiResponse>(
      `${API_BASE_URL}/api/rentals/${rentalId}`,
      {
        headers: getAuthHeader(),
      },
    );

    const rental = response.data.data?.rental;
    if (!rental) {
      throw new AdminApiError("Order not found");
    }

    return rental;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const message =
        (err.response?.data as { message?: string } | undefined)?.message ??
        err.message ??
        "Failed to get order";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to get order");
  }
}

export async function completeReturnOrder(
  rentalId: number,
  items: ReturnInspectionItem[],
  returnDate: string,
): Promise<CompleteReturnResult> {
  try {
    const response = await axios.post<RentalsApiResponse>(
      `${API_BASE_URL}/api/return-orders`,
      {
        rental_id: rentalId,
        return_date: returnDate,
        items,
      },
      {
        headers: getAuthHeader(),
      },
    );

    const returnOrder = response.data.data?.return_order;
    const summary = response.data.data?.summary;
    if (!returnOrder || !summary) {
      throw new AdminApiError("Complete return returned no data");
    }

    return {
      return_order: returnOrder,
      summary,
    };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data as
        | { message?: string; errors?: Record<string, string[] | string> }
        | undefined;
      const validationErrors = data?.errors
        ? Object.values(data.errors)
            .flatMap((entry) => (Array.isArray(entry) ? entry : [entry]))
            .join("; ")
        : "";
      const message =
        validationErrors ||
        data?.message ||
        err.message ||
        "Failed to complete return";
      throw new AdminApiError(message, status);
    }
    throw new AdminApiError("Failed to complete return");
  }
}
