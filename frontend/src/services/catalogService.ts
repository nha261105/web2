import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/config/api";
import type { Product } from "@/pages/client/data";

type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data?: {
    items?: T[];
  };
};

type ApiOneResponse<T, K extends string> = {
  success: boolean;
  message: string;
  data?: Record<K, T>;
};

type BackendCategory = {
  id: number;
  name: string;
  slug: string;
};

type BackendBrand = {
  id: number;
  name: string;
  logo?: string | null;
};

type BackendProduct = {
  id: number;
  policies_id: number;
  category_id: number;
  brand_id: number;
  name: string;
  slug: string;
  daily_price: string | number;
  deposit_price: string | number;
  description: string;
  status: "ACTIVE" | "INACTIVE";
  images?: string[];
  category?: BackendCategory;
  brand?: BackendBrand;
};

export type ProductQuery = {
  search?: string;
  category_id?: number;
  brand_id?: number;
  status?: "ACTIVE" | "INACTIVE";
};

export type CreateProductPayload = {
  name: string;
  slug: string;
  category_id: number;
  brand_id: number;
  policies_id: number;
  deposit_price: number;
  daily_price: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
  image_source_urls?: string[];
};

export type CategoryOption = {
  id: number;
  name: string;
  slug: string;
};

const formatPriceLabel = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

export function mapBackendProductToUi(product: BackendProduct): Product {
  const dailyPrice = Number(product.daily_price ?? 0);
  const images = product.images ?? [];
  const firstImage =
    images[0] ??
    "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=600";

  return {
    id: String(product.id),
    title: product.name,
    description: product.description || "",
    price: dailyPrice,
    priceLabel: `${formatPriceLabel(dailyPrice)}/ngày`,
    image: firstImage,
    gallery: images.length ? images : [firstImage],
    category: product.category?.name ?? "Unknown",
    brand: product.brand?.name ?? "Unknown",
    rating: 0,
    reviews: 0,
    available: 1,
    specs: {
      Status: product.status,
      Deposit: formatPriceLabel(Number(product.deposit_price ?? 0)),
    },
    tags: [product.slug],
  };
}

export async function getCategories(): Promise<CategoryOption[]> {
  const response = await axios.get<ApiListResponse<BackendCategory>>(
    `${API_BASE_URL}${API_ENDPOINTS.categories}`,
  );

  return (
    response.data.data?.items?.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
    })) ?? []
  );
}

export async function getProducts(
  query: ProductQuery = {},
): Promise<Product[]> {
  const response = await axios.get<ApiListResponse<BackendProduct>>(
    `${API_BASE_URL}${API_ENDPOINTS.products}`,
    { params: query },
  );

  return (response.data.data?.items ?? []).map(mapBackendProductToUi);
}

export async function getProductById(id: string): Promise<Product> {
  const response = await axios.get<ApiOneResponse<BackendProduct, "product">>(
    `${API_BASE_URL}${API_ENDPOINTS.products}/${id}`,
  );

  const product = response.data.data?.product;
  if (!product) {
    throw new Error("Product not found");
  }

  return mapBackendProductToUi(product);
}

export async function createProduct(
  payload: CreateProductPayload,
  token: string,
) {
  return axios.post(`${API_BASE_URL}${API_ENDPOINTS.products}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
