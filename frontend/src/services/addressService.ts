import axios from "axios";
import { API_BASE_URL, addressEndpoints } from "@/config/api";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Address {
  id: number;
  user_id: number;
  label: string;
  address_line: string;
  city: string;
  district: string;
  ward: string;
  is_default: boolean;
  created_at: string;
}

export interface CreateAddressPayload {
  label: string;
  address_line: string;
  city: string;
  district: string;
  ward: string;
  is_default?: boolean;
}

// Fix lỗi "interface declaring no members" — dùng type thay vì extends empty
export type UpdateAddressPayload = Partial<CreateAddressPayload>;

// ─── Helper lấy token ────────────────────────────────────────────────────────
function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Lấy danh sách địa chỉ ───────────────────────────────────────────────────
export async function getAddresses(userId: number) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}${addressEndpoints.list(userId)}`,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
  }
}

// ─── Thêm địa chỉ mới ────────────────────────────────────────────────────────
export async function createAddress(userId: number, data: CreateAddressPayload) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}${addressEndpoints.list(userId)}`,
      data,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
  }
}

// ─── Sửa địa chỉ ─────────────────────────────────────────────────────────────
export async function updateAddress(
  userId: number,
  id: number,
  data: UpdateAddressPayload,
) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}${addressEndpoints.byId(userId, id)}`,
      data,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
  }
}

// ─── Xoá địa chỉ ─────────────────────────────────────────────────────────────
export async function deleteAddress(userId: number, id: number) {
  try {
    const response = await axios.delete(
      `${API_BASE_URL}${addressEndpoints.byId(userId, id)}`,
      { headers: getAuthHeader() },
    );
    return response.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Exception";
    return { success: false, error: "Exception", message: "Lỗi: " + message };
  }
}

// ─── Set địa chỉ mặc định ────────────────────────────────────────────────────
export async function setDefaultAddress(userId: number, id: number) {
  return updateAddress(userId, id, { is_default: true });
}