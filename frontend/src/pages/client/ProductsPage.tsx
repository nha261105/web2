import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsCard } from "./ProductContext/ProductCard";
import type { Product } from "./data";
import { getCategories, getProducts } from "@/services/catalogService";

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

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

      return byCategory && bySearch;
    });
  }, [allProducts, categories, search, selectedCategoryId]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );

  const pagedProducts = useMemo(() => {
    const start = (page - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filteredProducts, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategoryId, search]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Tất cả sản phẩm
          </h1>
          <p className="mt-2 text-slate-600">
            Tìm kiếm và lọc nhanh thiết bị phù hợp với nhu cầu của bạn.
          </p>
        </div>

        <div className="relative w-full sm:w-90">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm theo tên, thương hiệu, danh mục..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategoryId(null)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            selectedCategoryId === null
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 hover:bg-slate-200/80 hover:text-blue-700 hover:ring-slate-300/80"
          }`}
        >
          Tất cả
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setSelectedCategoryId(category.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              selectedCategoryId === category.id
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                : "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80 hover:bg-slate-200/80 hover:text-blue-700 hover:ring-slate-300/80"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="mb-5 text-sm text-slate-600">
        {isLoading
          ? "Đang tải dữ liệu sản phẩm..."
          : `Hiển thị ${pagedProducts.length} / ${filteredProducts.length} sản phẩm`}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {!isLoading && pagedProducts.length === 0 && (
          <p className="col-span-full rounded-xl bg-slate-50/90 p-6 text-center text-slate-600 shadow-sm ring-1 ring-slate-200/60">
            Không tìm thấy sản phẩm phù hợp.
          </p>
        )}

        {pagedProducts.map((product) => (
          <ProductsCard key={product.id} product={product} variants="default" />
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
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
              className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "bg-slate-50 text-slate-700 ring-1 ring-slate-200/85 hover:bg-slate-100 hover:text-blue-700"
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
    </section>
  );
}
