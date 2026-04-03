import axios from "axios";
import { API_BASE_URL } from "@/config/api";

export interface ComboDetail {
  id: number;
  combo_id: number;
  product_id: number;
  quantity: number;
  product?: any; // Avoiding deep client product type dependency if possible
}

export interface Combo {
  id: number;
  name: string;
  description: string;
  daily_price: number;
  combo_details?: ComboDetail[];
  created_at: string;
  updated_at: string;
}

export interface CreateComboPayload {
  name: string;
  description: string;
  daily_price: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

export interface UpdateComboPayload {
  name?: string;
  description?: string;
  daily_price?: number;
  items?: {
    product_id: number;
    quantity: number;
  }[];
}

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getCombos() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/combos`);
    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Lỗi kết nối server" }
    );
  }
}

export async function getComboById(id: number) {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/combos/${id}`);
    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Lỗi kết nối server" }
    );
  }
}

export async function createCombo(data: CreateComboPayload) {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/combos`, data, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Lỗi kết nối server" }
    );
  }
}

export async function updateCombo(id: number, data: UpdateComboPayload) {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/api/combos/${id}`,
      data,
      {
        headers: getAuthHeader(),
      },
    );
    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Lỗi kết nối server" }
    );
  }
}

export async function deleteCombo(id: number) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/api/combos/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    return (
      error.response?.data || { success: false, message: "Lỗi kết nối server" }
    );
  }
}
