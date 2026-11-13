"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image"
import { GetCategory } from "@/app/fetchers/fetchgetcategory";
import type { Product } from "@/lib/types/product";
import type { Category } from "@/lib/types/category";
import { GetProduct } from "../../fetchers/fetchgetproduct";
import { DELETE } from "../../fetchers/fetchDeleteProduct";
import CreateProduct from "@/app/(Products)/createProduct/page";
import ProductGridSkeleton from "@/app/(component)/ProductGridSkeleton/page";
import CreateCategory from "@/app/(Products)/createCategory/page";
import Header from "@/app/(component)/Header/page"
type ProductGroup = {
  key: string;
  name?: string;
  items: Product[];
};

function ChocolateArt({ variant = 0 }: { variant?: number }) {
  return (
    <span
      className={`chocolate-art chocolate-art--${variant % 4}`}
      aria-hidden="true"
    >
      <span className="chocolate-art__piece chocolate-art__piece--one" />
      <span className="chocolate-art__piece chocolate-art__piece--two" />
      <span className="chocolate-art__piece chocolate-art__piece--three" />
    </span>
  );
}

<ProductGridSkeleton />;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null);
  const [productMessage, setProductMessage] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const productFormRef = useRef<HTMLFormElement>(null);
  const categoryFormRef = useRef<HTMLFormElement>(null);

  async function loadCategories(): Promise<boolean> {
    try {
      const result = await GetCategory();
      setCategories(Array.isArray(result) ? result : []);
      setCategoryError(null);
      return true;
    } catch (loadError) {
      setCategoryError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load categories.",
      );
      return false;
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const result = await GetProduct();
        if (!cancelled) setProducts(Array.isArray(result) ? result : []);
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load products.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchProducts();
    GetCategory()
      .then((result) => {
        if (!cancelled) setCategories(Array.isArray(result) ? result : []);
      })
      .catch((loadError: unknown) => {
        if (!cancelled) {
          setCategoryError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load categories.",
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await DELETE(id);
      setProducts((current) => current.filter((product) => product.id !== id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Failed to delete product.",
      );
    }
  };

  const groups = products.reduce<ProductGroup[]>((result, product) => {
    const categoryId = product.category_id;
    const category = categories.find((item) => item.id === categoryId);
    const key = categoryId == null ? "uncategorized" : String(categoryId);
    const name =
      category?.name ?? (categoryId == null ? "House Favorites" : "Chocolate");
    let group = result.find((item) => item.key === key);

    if (!group) {
      group = { key, name, items: [] };
      result.push(group);
    }

    group.items.push(product);
    return result;
  }, []);

  return (
    <main className="storefront" id="top">
    <Header/>

      <section className="storefront__hero">
        <p className="storefront__eyebrow">Small batch · Thoughtfully made</p>
        <h1>
          A little more
          <br />
          love in every bite.
        </h1>
        <p className="storefront__intro">
          Organic, fair-trade chocolate crafted slowly and shared generously.
        </p>
        <a className="storefront__button storefront__button--dark" href="#shop">
          Discover our chocolate
        </a>
        <div className="storefront__hero-art">
          <ChocolateArt variant={0} />
        </div>
      </section>

      <section className="storefront__favorites" id="favorites">
        <div className="storefront__section-heading">
          <span className="storefront__eyebrow">A few things we love</span>
          <h2>Our best products</h2>
        </div>
        {loading ? (
          <p className="storefront__message">Finding something delicious...</p>
        ) : groups.length === 0 ? (
          <p className="storefront__message">
            Our chocolate collection is coming soon.
          </p>
        ) : (
          <div className="storefront__favorites-grid">
            {groups.slice(0, 4).map((group, index) => (
              <a
                className={`favorite-card favorite-card--${index % 4}`}
                href="#shop"
                key={group.key}
              >
                <span className="favorite-card__name">{group.name}</span>
                <span className="favorite-card__subtitle">{group.name}</span>
                <ChocolateArt variant={index} />
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="storefront__shop" id="shop">
        <div className="storefront__section-heading storefront__section-heading--light">
          <span className="storefront__eyebrow">Made for sharing (or not)</span>
          <h2>Our online store</h2>
        </div>

        {error && (
          <p className="storefront__error" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <ProductGridSkeleton />
        ) : products.length === 0 ? (
          <p className="storefront__message storefront__message--light">
            No chocolates to show just yet.
          </p>
        ) : (
          <div className="storefront__groups">
            {groups.map((group) => (
              <section className="storefront__product-group" key={group.key}>
                <h3 className="storefront__group-title">{group.name}</h3>
                <div className="storefront__products">
                  {group.items.map((product, index) => (
                    <article className="product-card" key={product.id}>
                      <Link
                        className="product-card__image"
                        href={`/${product.id}`}
                        aria-label={`View ${product.name}`}
                      >
                        {product.image_url ? (
                          <Image
                            className="product-card__photo"
                            src={product.image_url}
                            alt={product.name}
                            width={300}
                            height={112}
                            unoptimized
                          />
                        ) : (
                          <ChocolateArt variant={index} />
                        )}
                      </Link>
                      <div className="product-card__details">
                        <Link
                          className="product-card__name"
                          href={`/${product.id}`}
                        >
                          {product.name}
                        </Link>
                        <p className="product-card__category">
                          {categories.find(
                            (category) => category.id === product.category_id,
                          )?.name || "Handcrafted chocolate"}
                        </p>
                        <p className="product-card__price">
                          ${Number(product.price).toFixed(2)}
                        </p>
                       
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
      <section className="storefront__manage" id="add-to-store">
        <div className="storefront__section-heading">
          <span className="storefront__eyebrow">A little more cacao</span>
          <h2>Grow your collection</h2>
          <p>Bring a new chocolate or category to the counter.</p>
        </div>
        <div className="storefront__forms"></div>
      </section>

      <footer className="storefront__footer">
        <span className="storefront__brand-mark" aria-hidden="true">
          ✳
        </span>
        <p>Made with care, wrapped in chocolate.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
