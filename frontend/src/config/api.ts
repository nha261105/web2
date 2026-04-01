const rawApiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = {
  signUp: "/api/users",
  signIn: "/api/auth/sign-in",
  signOut: "/api/auth/sign-out",
  me: "/api/auth/me",
  checkToken: "/api/user-tokens/check-token",

  //User
  usersMe: "/api/users/me",
  updateMe: "/api/users/me",
  users: "/api/users",

  //Roles
  roles: "/api/roles",

  // Catalog
  products: "/api/products",
  categories: "/api/categories",
  brands: "/api/brands",
  rentalPolicies: "/api/rental-policies",
  cart: "/api/cart",
  cartRentNow: "/api/cart/rent-now",
  cartItem: (itemId: number) => `/api/cart/items/${itemId}`,
} as const;

export const addressEndpoints = {
  list: (userId: number) => `/api/users/${userId}/addresses`,
  byId: (userId: number, id: number) => `/api/users/${userId}/addresses/${id}`,
};
