"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DELETE } from "@/app/fetchers/fetchDeleteProduct";
import { GetCategory } from "@/app/fetchers/fetchgetcategory";
import { GetProduct } from "@/app/fetchers/fetchgetproduct";
import type { Category } from "@/lib/types/category";
import type { Product } from "@/lib/types/product";

type AdminView = "products" | "categories";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [view, setView] = useState<AdminView>("products");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadAdminData() {
      try {
        const [productList, categoryList] = await Promise.all([
          GetProduct(),
          GetCategory(),
        ]);
        if (!cancelled) {
          setProducts(productList);
          setCategories(categoryList);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load store data.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadAdminData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === null ||
        product.category_id === selectedCategory;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (categories.find((category) => category.id === product.category_id)
          ?.name ?? "")
          .toLowerCase()
          .includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [categories, products, search, selectedCategory]);

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return;

    try {
      await DELETE(product.id);
      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
      setError(null);
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete product.",
      );
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-page__top">
        <Link className="admin-page__brand" href="/">
          CACAO <span>STORE ADMIN</span>
        </Link>
        <nav className="admin-page__tabs" aria-label="Admin sections">
          <button
            className={view === "products" ? "is-active" : ""}
            onClick={() => setView("products")}
            type="button"
          >
            All products
          </button>
          <button
            className={view === "categories" ? "is-active" : ""}
            onClick={() => {
              setView("categories");
              setSelectedCategory(null);
            }}
            type="button"
          >
            Categories
          </button>
        </nav>
      </header>

      <div className="admin-page__layout">
        <aside className="admin-page__sidebar">
          <div className="admin-page__sidebar-heading">
            <h2>Categories</h2>
            <Link href="/createCategory">Create new</Link>
          </div>
          <button
            className={`admin-page__category${selectedCategory === null ? " is-active" : ""}`}
            onClick={() => {
              setSelectedCategory(null);
              setView("products");
            }}
            type="button"
          >
            <span>All products</span>
            <span>{products.length}</span>
          </button>
          {categories.map((category) => (
            <button
              className={`admin-page__category${selectedCategory === category.id ? " is-active" : ""}`}
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setView("products");
              }}
              type="button"
            >
              <span>{category.name}</span>
              <span>
                {
                  products.filter(
                    (product) => product.category_id === category.id,
                  ).length
                }
              </span>
            </button>
          ))}
        </aside>

        <section className="admin-page__content">
          <div className="admin-page__toolbar">
            <h1>{view === "products" ? "Products" : "Categories"}</h1>
            <div className="admin-page__actions">
              <input
                aria-label={`Search ${view}`}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={view === "products" ? "Search products" : "Search categories"}
                type="search"
                value={search}
              />
              <Link className="admin-page__add-button" href="/createProduct">
                Add product
              </Link>
            </div>
          </div>

          {error && (
            <p className="admin-page__message admin-page__message--error" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <p className="admin-page__message">Loading store data...</p>
          ) : view === "products" ? (
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Category</th>
                    <th scope="col">Price</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <div className="admin-page__product">
                          {product.image_url ? (
                            <Image
                              alt=""
                              className="admin-page__thumbnail"
                              height={40}
                              src={product.image_url}
                              unoptimized
                              width={40}
                            />
                          ) : (
                            <span
                              aria-hidden="true"
                              className="admin-page__thumbnail admin-page__thumbnail--empty"
                            >
                              {product.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                      <td>
                        {categories.find(
                          (category) => category.id === product.category_id,
                        )?.name ?? "Uncategorized"}
                      </td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td>
                        <div className="admin-page__row-actions">
                          <Link href={`/${product.id}/updateProduct`}>Edit</Link>
                          <button
                            onClick={() => void handleDelete(product)}
                            type="button"
                          >
                            Delete
                          </button>
                           <Link href={`/${product.id}`}>Discover</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td className="admin-page__empty" colSpan={4}>
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="admin-page__table-wrap">
              <table className="admin-page__table">
                <thead>
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Products</th>
                  </tr>
                </thead>
                <tbody>
                  {categories
                    .filter((category) =>
                      category.name.toLowerCase().includes(search.trim().toLowerCase()),
                    )
                    .map((category) => (
                      <tr key={category.id}>
                        <td>{category.name}</td>
                        <td>
                          {
                            products.filter(
                              (product) => product.category_id === category.id,
                            ).length
                          }
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
