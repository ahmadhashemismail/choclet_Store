"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from"next/image"
import { useParams, useRouter } from "next/navigation";
import { GetCategory } from "@/app/fetchers/fetchgetcategory";
import { GetProductById } from "@/app/fetchers/fetchgetproduct";
import { updateProduct } from "@/app/fetchers/fetchupdateproduct";
import { uploadProductImage } from "@/app/actions/uploadProductImage";
import type { Category } from "@/lib/types/category";
import type { Product } from "@/lib/types/product";
import ProductChocolateArt from "@/app/(component)/ProductChocolateArt/page";

function UpdateProductsContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const productId = Number(id);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!Number.isInteger(productId) || productId <= 0) {
        setError("Invalid product id.");
        setLoading(false);
        return;
      }

      try {
        const [loadedProduct, loadedCategories] = await Promise.all([
          GetProductById(productId),
          GetCategory(),
        ]);
        if (!cancelled) {
          setProduct(loadedProduct);
          setCategories(loadedCategories);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load product.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleUpdateProduct() {
    if (!product) return;

    setSaving(true);
    setError(null);
    try {
      const file = imageInputRef.current?.files?.[0];
      const imageUrl = file
        ? await uploadProductImage(file)
        : product.image_url;

      await updateProduct({ ...product, image_url: imageUrl });
      router.push(`/`);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update product.",
      );
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="product-edit__message">Loading product...</p>;
  }
  if (error && !product) {
    return (
      <main className="storefront product-edit">
        <p className="product-edit__message" role="alert">
          {error}
        </p>
        <Link className="product-detail__back" href="/">
          ← Back to the chocolate shop
        </Link>
      </main>
    );
  }
  if (!product) {
    return (
      <main className="storefront product-edit">
        <p className="product-edit__message">Product not found.</p>
        <Link className="product-detail__back" href="/">
          ← Back to the chocolate shop
        </Link>
      </main>
    );
  }

  return (
    <main className="storefront product-edit">
      <header className="storefront__header">
        <Link className="storefront__brand" href="/">
          <span className="storefront__brand-mark" aria-hidden="true">
            ✳
          </span>
          <span>
            <strong>CACAO</strong>
            <small>CHOCOLATE HOUSE</small>
          </span>
        </Link>
        <Link className="product-detail__back" href="/">
          ← Back to the shop
        </Link>
      </header>
      <section className="product-edit__layout">
        
        <div className="product-detail__visual">
          <span className="product-detail__visual-label">Made with care</span>
          {product.image_url ? (
            <Image
              className="product-detail__image"
              src={product.image_url}
              alt={product.name}
              width={600}
              height={420}
              unoptimized
            />
          ) : (
            <ProductChocolateArt />
          )}
          <span className="product-detail__visual-caption">A little moment of joy</span>
        </div>
        <form
          className="store-form product-edit__form"
          onSubmit={(event) => {
            event.preventDefault();
            void handleUpdateProduct();
          }}
        >
          <span className="store-form__number">THE CHOCOLATE COLLECTION</span>
          <h1>Edit product</h1>
          <p className="product-edit__intro">
            Make a change to this chocolate and keep your collection just right.
          </p>
          <label htmlFor="product-name">
            Product name
            <input
              id="product-name"
              value={product.name}
              required
              onChange={(event) =>
                setProduct({ ...product, name: event.target.value })
              }
            />
          </label>
          <div className="store-form__row">
            <label htmlFor="product-price">
              Price
              <input
                id="product-price"
                type="number"
                min="0"
                step="any"
                value={product.price}
                required
                onChange={(event) =>
                  setProduct({ ...product, price: Number(event.target.value) })
                }
              />
            </label>
            <label htmlFor="product-category">
              Category
              <select
                id="product-category"
                value={product.Category?.id?.toString() ?? ""}
                onChange={(event) =>
                  setProduct({
                    ...product,
                    Category: event.target.value
                      ? (categories.find(
                          (category) =>
                            category.id === Number(event.target.value),
                        ) ?? product.Category)
                      : product.Category,
                  })
                }
              >
                <option value="">No category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label htmlFor="product-description">
            Description
            <textarea
              id="product-description"
              rows={4}
              value={product.description}
              onChange={(event) =>
                setProduct({ ...product, description: event.target.value })
              }
            />
          </label>
          <label>
            Image
            <input
              ref={imageInputRef}
              type="file"
              name="image_url"
              accept="image/jpeg,image/png,image/webp"
            />
          </label>
          {error && (
            <p
              className="store-form__feedback store-form__feedback--error"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="product-edit__actions">
            <button
              type="submit"
              className="store-form__submit"
              disabled={saving}
            >
              {saving ? "Saving changes..." : "Save changes"}
            </button>
            <button
              type="button"
              className="product-edit__cancel"
              disabled={saving}
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
      <footer className="storefront__footer">
        <span className="storefront__brand-mark" aria-hidden="true">
          ✳
        </span>
        <p>Made with care, wrapped in chocolate.</p>
      </footer>
    </main>
  );
}

export default function UpdateProducts() {
  return (
    <Suspense
      fallback={<p className="product-edit__message">Loading product...</p>}
    >
      <UpdateProductsContent />
    </Suspense>
  );
}
