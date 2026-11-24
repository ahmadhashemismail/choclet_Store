"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  getProductById,
  getProductsByCategory,
} from "../../fetchers/product/fetchgetproduct";
import type { Product } from "@/lib/types/product";
import ProductChocolateArt from "@/app/(component)/ProductChocolateArt/page";
import ChoclateLoading from "@/app/(component)/loading/choclateLoading/page";
import { AddProductToCart } from "@/app/fetchers/cart/fetchGetFromCard";
import Header from "@/app/(component)/Header/page";
import FavoriteButton from "@/app/(component)/favoriteIcon/page";
import { useAuth } from "@clerk/nextjs";
import {
  addFavoriteProduct,
  getFavoriteProduct,
} from "@/app/fetchers/favorite/fetchFavoriteProduct";
import { useRouter } from "next/navigation";

export function ProductDetailsContent() {
  const { isLoaded, isSignedIn } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const productId = Number(id);
  const invalidId = !Number.isInteger(productId) || productId <= 0;
  const router = useRouter();

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

  useEffect(() => {
    if (!product?.category_id) {
      setRelatedProducts([]);
      setRelatedLoading(false);
      setRelatedError(null);
      return;
    }

    let cancelled = false;
    setRelatedLoading(true);
    setRelatedError(null);
    getProductsByCategory(product.category_id, product.id)
      .then((items) => {
        if (!cancelled) setRelatedProducts(items);
      })
      .catch((relatedLoadError: unknown) => {
        if (!cancelled) {
          setRelatedError(
            relatedLoadError instanceof Error
              ? relatedLoadError.message
              : "Failed to load related chocolates.",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setRelatedLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

  useEffect(() => {
    let cancelled = false;
    if (!isLoaded) return;
    if (!isSignedIn || !product) {
      if (!isSignedIn) setIsFavorite(false);
      return;
    }

    getFavoriteProduct()
      .then((favorites: { product_id: number }[]) => {
        if (!cancelled) {
          setIsFavorite(
            favorites.some(({ product_id }) => product_id === product.id),
          );
        }
      })
      .catch(() => {
        if (!cancelled) setIsFavorite(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, product]);

  if (invalidId) {
    return (
      <main className="storefront product-detail">
        <p className="cart" role="alert">
          Invalid product id .
        </p>
        <Link className="product-detail__back" href="/">
          ← Back to the chocolate shop
        </Link>
      </main>
    );
  }
  if (error) {
    return (
      <main className="storefront product-detail">
        <p className="cart" role="alert">
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
      <main className="storefront product-detail">
        <div className="cart">
          <ChoclateLoading />
        </div>
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
  async function handleAddToFavorite(product: Product) {
    try {
      await addFavoriteProduct(product.id);
    } catch (favoriteError) {
      setError(
        "can't add this product to favorite please try again or contact support",
      );
      console.log("falied to add to favorite page", favoriteError);
    }
  }

  return (
    <main className="storefront product-detail">
      <Header />
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
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
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
            </button>{" "}
            <span
              onClick={() =>
                !isSignedIn
                  ? router.replace("/auth")
                  : handleAddToFavorite(product)
              }
            >
              <FavoriteButton
                defaultFavorite={isFavorite}
                onChange={setIsFavorite}
              />
            </span>
          </div>
          {cartError && (
            <p className="product-detail__cart-error" role="alert">
              {cartError}
            </p>
          )}
          <dl className="product-detail__facts">
            {product.description && <dd>{product.description}</dd>}
            {product.Category?.name && (
              <div>
                <dt>Category</dt>
                <p>{product.Category.name}</p>
              </div>
            )}
          </dl>
        </div>
      </section>
      {product.category_id !== null && product.category_id > 0 && (
        <section
          className="related-products"
          aria-labelledby="related-products-title"
        >
          <header className="related-products__heading">
            <span>Explore the collection</span>
            <h2 id="related-products-title">
              More from {product.Category?.name ?? "this category"}
            </h2>
          </header>

          { relatedError ? (
            <p className="related-products__message" role="alert">
              {relatedError}
            </p>
          ) : relatedProducts.length === 0 ? (
            <p className="related-products__message">
              There are no other products in this category yet.
            </p>
          ) : (
            <div className="related-products__grid">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  className="related-product"
                  href={`/${relatedProduct.id}`}
                  key={relatedProduct.id}
                >
                  <span className="related-product__image">
                    {relatedProduct.image_url ? (
                      <Image
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        width={360}
                        height={240}
                        unoptimized
                      />
                    ) : (
                      <ProductChocolateArt />
                    )}
                  </span>
                  <span className="related-product__details">
                    <strong>{relatedProduct.name}</strong>
                    <span>${Number(relatedProduct.price).toFixed(2)}</span>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
export default function ProductDetails() {
  return (
    <Suspense
      fallback={
        <div>
          <ChoclateLoading />
        </div>
      }
    >
      <ProductDetailsContent />
    </Suspense>
  );
}
