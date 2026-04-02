import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, LayoutGrid, List, Search } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { ProductsCard } from "./ProductContext/ProductCard";
import type { Product } from "./data";
import { getCategories, getProducts } from "@/services/catalogService";
import { addToCart } from "@/services/cartService";

const PAGE_SIZE_OPTIONS = [6, 12, 18];
const PRICE_RANGES = [
  { key: "under-500", label: "Dưới 500.000đ/ngày", min: 0, max: 500000 },
  {
    key: "500-1000",
    label: "500.000đ - 1.000.000đ/ngày",
    min: 500000,
    max: 1000000,
  },
  {
    key: "1000-2000",
    label: "1.000.000đ - 2.000.000đ/ngày",
    min: 1000000,
    max: 2000000,
  },
  { key: "over-2000", label: "Trên 2.000.000đ/ngày", min: 2000000 },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevant");
  const [pageSize, setPageSize] = useState(6);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function loadData() {
      try {
        const [categoryItems, productItems] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);

        setCategories(
          categoryItems.map((item) => ({ id: item.id, name: item.name })),
        );
        setAllProducts(productItems);
      } finally {
        setIsLoading(false);
      }
    }

    void loadData();
  }, []);

  const availableBrands = useMemo(
    () =>
      Array.from(new Set(allProducts.map((product) => product.brand))).sort(),
    [allProducts],
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return allProducts.filter((product) => {
      const byCategory = selectedCategoryId
        ? categories.find((item) => item.name === product.category)?.id ===
          selectedCategoryId
        : true;

      const bySearch = keyword
        ? [product.title, product.brand, product.category, product.description]
            .join(" ")
            .toLowerCase()
            .includes(keyword)
        : true;

      const byPrice =
        selectedPriceRanges.length === 0
          ? true
          : selectedPriceRanges.some((rangeKey) => {
              const range = PRICE_RANGES.find((item) => item.key === rangeKey);
              if (!range) return false;
              const min = range.min ?? Number.MIN_SAFE_INTEGER;
              const max = range.max ?? Number.MAX_SAFE_INTEGER;
              return product.price >= min && product.price <= max;
            });

      const byBrand =
        selectedBrands.length === 0
          ? true
          : selectedBrands.includes(product.brand);

      return byCategory && bySearch && byPrice && byBrand;
    });
  }, [
    allProducts,
    categories,
    search,
    selectedBrands,
    selectedCategoryId,
    selectedPriceRanges,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "name-asc")
      list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [filteredProducts, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize));

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedProducts.slice(start, start + pageSize);
  }, [page, pageSize, sortedProducts]);

  useEffect(() => {
    setPage(1);
  }, [
    pageSize,
    search,
    selectedBrands,
    selectedCategoryId,
    selectedPriceRanges,
    sortBy,
  ]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => {
    const q = search.trim();
    const current = searchParams.get("search") ?? "";
    if (q === current) return;

    const next = new URLSearchParams(searchParams);
    if (q) next.set("search", q);
    else next.delete("search");
    setSearchParams(next, { replace: true });
  }, [search, searchParams, setSearchParams]);

  const togglePriceRange = (key: string) => {
    setSelectedPriceRanges((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    );
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((item) => item !== brand)
        : [...prev, brand],
    );
  };

  const clearFilters = () => {
    setSelectedCategoryId(null);
    setSelectedPriceRanges([]);
    setSelectedBrands([]);
    setSearch("");
    setSortBy("relevant");
  };

  const handleAddToCart = async (product: Product) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }

    const response = await addToCart({
      product_id: Number(product.id),
      quantity: 1,
      rental_days: 1,
    });

    if (response.success) toast.success("Đã thêm sản phẩm vào giỏ hàng");
    else toast.error(response.message || "Thêm vào giỏ hàng thất bại");
  };

  const startItem =
    filteredProducts.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, filteredProducts.length);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Quay lại trang chủ
        </Link>
      </div>

      <div className="mb-8 rounded-3xl bg-gradient-to-r from-slate-50 to-sky-50 p-6 ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Tất cả sản phẩm
        </h1>
        <p className="mt-2 text-slate-600">
          Không gian lọc rõ ràng để bạn tìm nhanh thiết bị phù hợp.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[30%_70%]">
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Bộ lọc</h2>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Đặt lại
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-800">
                Tìm theo tên
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Nhập tên, hãng, danh mục"
                  className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">
                Danh mục
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategoryId(null)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedCategoryId === null
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700"
                  }`}
                >
                  Tất cả
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategoryId(category.id)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      selectedCategoryId === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">
                Lọc theo giá
              </p>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <label
                    key={range.key}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPriceRanges.includes(range.key)}
                      onChange={() => togglePriceRange(range.key)}
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">
                Thương hiệu
              </p>
              <div className="max-h-40 space-y-2 overflow-auto pr-1">
                {availableBrands.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-2 text-sm text-slate-700"
                  >
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                    />
                    {brand}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <p className="text-sm text-slate-600">
              {isLoading
                ? "Đang tải dữ liệu sản phẩm..."
                : `Hiển thị ${startItem}-${endItem} trên tổng ${filteredProducts.length} sản phẩm`}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700"
              >
                <option value="relevant">Liên quan</option>
                <option value="price-asc">Giá thấp đến cao</option>
                <option value="price-desc">Giá cao đến thấp</option>
                <option value="name-asc">Tên A-Z</option>
              </select>

              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-700"
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size} / trang
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 rounded-xl border border-slate-200 p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-md p-2 ${
                    viewMode === "grid"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`rounded-md p-2 ${
                    viewMode === "list"
                      ? "bg-slate-900 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                : "grid grid-cols-1 gap-4"
            }
          >
            {!isLoading && pagedProducts.length === 0 && (
              <p className="col-span-full rounded-2xl bg-slate-50 p-8 text-center text-slate-600 ring-1 ring-slate-200">
                Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.
              </p>
            )}

            {pagedProducts.map((product) => (
              <ProductsCard
                key={product.id}
                product={product}
                variants={viewMode === "grid" ? "default" : "list"}
                onAddToCart={() => void handleAddToCart(product)}
              />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="h-10 rounded-xl"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Trước
            </Button>

            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === page;

              if (
                pageNumber !== 1 &&
                pageNumber !== totalPages &&
                Math.abs(pageNumber - page) > 1
              ) {
                return null;
              }

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="h-10 rounded-xl"
            >
              Sau <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
