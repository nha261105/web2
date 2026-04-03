import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export interface Rental {
  id: number;
  user_id: number;
  coupon_id: number | null;
  address_id: number;
  code: string;
  start_date: string;
  end_date: string;
  actual_return_date: string | null;
  total_price: number;
  deposit_amount: number;
  status:
    | "PENDING"
    | "APPROVED"
    | "DEPOSITED"
    | "PICKED_UP"
    | "COMPLETED"
    | "CANCELLED";
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface RentalDetail extends Rental {
  items?: Array<{
    id: number;
    product_id: number;
    name?: string;
    product_name?: string;
    product_image?: string;
    quantity: number;
    price_at_rental: number;
  }>;
  address?: {
    id: number;
    street: string;
    ward: string;
    city: string;
    receive_name: string;
    receive_phone: string;
  };
}

interface RentalParams {
  status?: string;
  page?: number;
  per_page?: number;
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getMyRentals(params?: RentalParams) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rentals`, {
      params,
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Lỗi kết nối server",
        }
      );
    }
    return { success: false, message: "Đã xảy ra lỗi không xác định" };
  }
}

export async function cancelMyRental(id: number) {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/rentals/${id}/cancel`, {}, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Lỗi kết nối server",
        }
      );
    }
    return { success: false, message: "Đã xảy ra lỗi không xác định" };
  }
}

export async function getRentalDetail(id: number) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/rentals/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Không thể tải chi tiết đơn hàng",
        }
      );
    }
    return { success: false, message: "Đã xảy ra lỗi không xác định" };
  }
}

export async function rentAgain(rentalId: number) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/rentals/${rentalId}/rent-again`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Không thể tạo đơn thuê lại",
        }
      );
    }
    return { success: false, message: "Đã xảy ra lỗi không xác định" };
  }
}
