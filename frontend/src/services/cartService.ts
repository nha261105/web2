import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

export type CartProduct = {
  id: number;
  name: string;
  slug: string;
  daily_price: number;
  description: string;
  status?: string;
  brand?: string | null;
  category?: string | null;
  image?: string | null;
};

export type CartCombo = {
  id: number;
  name: string;
  daily_price: number;
  description: string;
};

export type CartItem = {
  id: number;
  type: "product" | "combo";
  quantity: number;
  rental_days: number;
  unit_price: number;
  total_price: number;
  product?: CartProduct | null;
  combo?: CartCombo | null;
};

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export type AddToCartPayload = {
  product_id?: number;
  combo_id?: number;
  quantity?: number;
  rental_days?: number;
};

export async function getMyCart() {
  try {
    const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.cart}`, {
      headers: getAuthHeader(),
    });
    return response.data as {
      success: boolean;
      message: string;
      data?: {
        items?: CartItem[];
      };
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Không thể kết nối đến server",
        }
      );
    }

    return {
      success: false,
      message: "Đã xảy ra lỗi không xác định khi tải giỏ hàng",
    };
  }
}

export async function addToCart(payload: AddToCartPayload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.cart}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    return response.data as {
      success: boolean;
      message: string;
      data?: {
        item?: CartItem;
      };
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Không thể kết nối đến server",
        }
      );
    }

    return {
      success: false,
      message: "Đã xảy ra lỗi không xác định khi thêm vào giỏ hàng",
    };
  }
}

export async function rentNow(payload: AddToCartPayload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.cartRentNow}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    return response.data as {
      success: boolean;
      message: string;
      data?: {
        checkout_url?: string;
        item?: CartItem;
      };
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Không thể kết nối đến server",
        }
      );
    }

    return {
      success: false,
      message: "Đã xảy ra lỗi không xác định khi thuê ngay",
    };
  }
}

export async function updateCartItem(
  itemId: number,
  payload: { quantity?: number; rental_days?: number },
) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}${API_ENDPOINTS.cartItem(itemId)}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    return response.data as {
      success: boolean;
      message: string;
      data?: {
        item?: CartItem;
      };
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Không thể kết nối đến server",
        }
      );
    }

    return {
      success: false,
      message: "Đã xảy ra lỗi không xác định khi cập nhật giỏ hàng",
    };
  }
}

export async function removeCartItem(itemId: number) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${API_ENDPOINTS.cartItem(itemId)}`,
      {
        headers: getAuthHeader(),
      },
    );

    return response.data as {
      success: boolean;
      message: string;
      data?: unknown;
    };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data || {
          success: false,
          message: "Không thể kết nối đến server",
        }
      );
    }

    return {
      success: false,
      message: "Đã xảy ra lỗi không xác định khi xóa item giỏ hàng",
    };
  }
}
