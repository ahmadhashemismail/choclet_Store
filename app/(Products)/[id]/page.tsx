"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getProductById } from "../../fetchers/product/fetchgetproduct";
import type { Product } from "@/lib/types/product";
import ProductChocolateArt from "@/app/(component)/ProductChocolateArt/page";
import ChoclateLoading from"@/app/(component)/loading/choclateLoading/page"
import { AddProductToCart } from "@/app/fetchers/cart/fetchGetFromCard";
import Header from "@/app/(component)/Header/page";


export function ProductDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const productId = Number(id);
  const invalidId = !Number.isInteger(productId) || productId <= 0;

  useEffect(() => {
    if (invalidId) return;

    let cancelled = false;
    getProductById(productId)
      .then((result) => {
        if (!cancelled) setProduct(result);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });

    return () => {
      cancelled = true;
    };
  }, [invalidId, productId]);

  if (invalidId) {
    return (
      <main className="storefront product-detail">
        <p className="product-detail__message" role="alert">Invalid product id .</p>
        <Link className="product-detail__back" href="/">← Back to the chocolate shop</Link>
      </main>
    );
  }
  if (error) {
    return (
      <main className="storefront product-detail">
        <p className="product-detail__message" role="alert">{error}</p>
        <Link className="product-detail__back" href="/">← Back to the chocolate shop</Link>
      </main>
    );
  }
  if (!product) {
    return (
      <main className="storefront product-detail">
        <p className="product-detail__message"><ChoclateLoading/></p>
      </main>
    );
  }

  async function handleAddToCart() {
    if (!product) return;
    setAdding(true);
    setCartError(null);
    setAdded(false);
    try {
      await AddProductToCart(product.id);
      setAdded(true);
    } catch (addError) {
      setCartError(
        addError instanceof Error
          ? addError.message
          : "Failed to add product to cart.",
      );
    } finally {
      setAdding(false);
    }
  }

  return (
    <main className="storefront product-detail">
     <Header/>
      <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Shop</Link>
        {product.Category?.name && (
          <>
            <span>/</span>
            <Link href="/#shop">{product.Category.name}</Link>
          </>
        )}
        <span>/</span>
        <span>{product.name}</span>
      </nav>
      <section className="product-detail__content">
        <div className="product-detail__visual">
          {product.image_url ? (
            <Image
              className="product-detail__image"
              src={product.image_url}
              alt={product.name}
              fill
              sizes="(max-width: 760px) 90vw, 460px"
              unoptimized
            />
          ) : (
            <ProductChocolateArt />
          )}
        </div>
        <div className="product-detail__info">
          {product.Category?.name && (
            <span className="product-detail__category">
              {product.Category.name}
            </span>
          )}
          <h1>{product.name}</h1>
          <p className="product-detail__price">
            ${Number(product.price).toFixed(2)}
          </p>
          <div className="product-detail__purchase">
            <div className="product-detail__quantity" aria-label="Quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                −
              </button>
              <strong>{quantity}</strong>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((current) => current + 1)}
              >
                +
              </button>
            </div>
            <button
              type="button"
              className="product-detail__add-button"
              disabled={adding}
              onClick={() => void handleAddToCart()}
            >
              {adding ? "Adding..." : added ? "Added to cart" : "Add to cart"}
            </button>
          </div>
          {cartError && (
            <p className="product-detail__cart-error" role="alert">
              {cartError}
            </p>
          )}
          <dl className="product-detail__facts">
            {product.description && (
                <dd>{product.description}</dd>
            )}
            {product.Category?.name && (
              <div>
                <dt>Category</dt>
                <p>{product.Category.name}</p>
              </div>
            )}
          </dl>
        </div>
      </section>
    </main>
  );
}
export default function ProductDetails() {
  return (
    <Suspense fallback={<div><ChoclateLoading/></div>}>
      <ProductDetailsContent />
    </Suspense>
  );
}