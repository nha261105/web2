import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";

/**
 * Hàm kiểm tra token lưu trong localStorage có hợp lệ kho
 * @returns json
 */
export async function checkToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token)
      return {
        success: false,
        error: "LocalStorage",
        message: "Token không có trong localStorage",
      };

    const response = await axios.post(
      `${API_BASE_URL}${API_ENDPOINTS.checkToken}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return {
      success: false,
      error: "Exception",
      message: "Lỗi: " + message,
    };
  }
}
