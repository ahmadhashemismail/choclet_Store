"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { GetProductById } from "../../fetchers/fetchgetproduct";
import type { Product } from "@/lib/types/product";
import ProductChocolateArt from "@/app/(component)/ProductChocolateArt/page";



export function ProductDetailsContent() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const productId = Number(id);
  const invalidId = !Number.isInteger(productId) || productId <= 0;

  useEffect(() => {
    if (invalidId) return;

    let cancelled = false;
    GetProductById(productId)
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
        <p className="product-detail__message" role="alert">Invalid product id.</p>
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
        <p className="product-detail__message">Finding your chocolate...</p>
      </main>
    );
  }

  return (
    <main className="storefront product-detail">
      <header className="storefront__header">
        <Link className="storefront__brand" href="/">
          <span className="storefront__brand-mark" aria-hidden="true">✳</span>
          <span>
            <strong>CACAO</strong>
            <small>CHOCOLATE HOUSE</small>
          </span>
        </Link>
        <Link className="product-detail__back" href="/">← Back to the shop</Link>
      </header>
      <section className="product-detail__content">
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
        <div className="product-detail__info">
          <span className="storefront__eyebrow">
            {product.Category?.name || "Handcrafted chocolate"}
          </span>
          <h1>{product.name}</h1>
          <p className="product-detail__price">
            ${Number(product.price).toFixed(2)}
          </p>
          <div className="product-detail__divider" />
          <h2>A treat worth slowing down for</h2>
          <p className="product-detail__description">
            {product.description || "A handcrafted chocolate, made for sharing and savoring."}
          </p>
          <Link className="storefront__button storefront__button--dark" href="/">
            Back to all chocolates
          </Link>
        </div>
      </section>
      <footer className="storefront__footer">
        <span className="storefront__brand-mark" aria-hidden="true">✳</span>
        <p>Made with care, wrapped in chocolate.</p>
      </footer>
    </main>
  );
}
export default function ProductDetails() {
  return (
    <Suspense fallback={<p>Loading product...</p>}>
      <ProductDetailsContent />
    </Suspense>
  );
}