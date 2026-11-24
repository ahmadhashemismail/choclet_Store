"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/(component)/Header/page";
import ProductChocolateArt from "@/app/(component)/ProductChocolateArt/page";
import { AddProductToCart } from "@/app/fetchers/cart/fetchGetFromCard";
import {
  getFavoriteProduct,
  removeFavoriteProduct,
} from "@/app/fetchers/favorite/fetchFavoriteProduct";
import { getProductById } from "@/app/fetchers/product/fetchgetproduct";
import type { Product } from "@/lib/types/product";
import ChoclateLoading from "@/app/(component)/loading/choclateLoading/page";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/app/(component)/favoriteIcon/page";
export default function FavoritePage() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [removingProductId, setRemovingProductId] = useState<number | null>(
    null,
  );
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!isLoaded) return;
    if (!isSignedIn) {
      router.replace("/auth");
      return;
    }

    async function loadFavorites() {
      try {
        const favorites: { product_id: number }[] = await getFavoriteProduct();
        const favoriteProducts = await Promise.all(
          favorites.map(({ product_id }) => getProductById(product_id)),
        );
        if (!cancelled) setProducts(favoriteProducts);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load your favorites.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadFavorites();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, router]);

  async function handleRemove(productId: number) {
    setRemovingProductId(productId);
    setActionError(null);
    try {
      await removeFavoriteProduct(productId);
      setProducts((current) =>
        current.filter((product) => product.id !== productId),
      );
    } catch (removeError) {
      setActionError(
        removeError instanceof Error
          ? removeError.message
          : "Failed to remove product from favorites.",
      );
    } finally {
      setRemovingProductId(null);
    }
  }

  async function handleAddToCart(productId: number) {
    setAddingProductId(productId);
    setActionError(null);
    try {
      await AddProductToCart(productId);
      setAddedProductId(productId);
    } catch (addError) {
      setActionError(
        addError instanceof Error
          ? addError.message
          : "Failed to add product to cart.",
      );
    } finally {
      setAddingProductId(null);
    }
  }

  return (
    <main className="storefront favorite-page">
      <Header />
      <section
        className="favorite-page__content"
        aria-labelledby="favorite-title"
      >
        {actionError && (
          <p className="storefront__error" role="alert">
            {actionError}
          </p>
        )}
        {loading ? (
          <div className="favorite-page__message">
            <ChoclateLoading />
          </div>
        ) : error ? (
          <p className="storefront__error" role="alert">
            {error}
          </p>
        ) : products.length === 0 ? (
          <div className="favorite-page__empty">
            <span aria-hidden="true">♡</span>
            <h2>No favorites yet</h2>
            <p>Save the chocolates you love and they’ll be waiting here.</p>
            <Link
              className="storefront__button storefront__button--dark"
              href="/#shop"
            >
              Explore chocolates
            </Link>
          </div>
        ) : (
          <div className="favorite-page__products">
            {products.map((product) => (
              <article
                className="product-cart favorite-product"
                key={product.id}
              >
                <Link
                  className="product-cart__image"
                  href={`/${product.id}`}
                  aria-label={`View ${product.name}`}
                >
                  {product.image_url ? (
                    <Image
                      className="product-cart__photo"
                      src={product.image_url}
                      alt={product.name}
                      width={300}
                      height={180}
                      unoptimized
                    />
                  ) : (
                    <ProductChocolateArt />
                  )}
                </Link>
                <span
                  className="favorite-product__remove"
                  aria-label={`Remove ${product.name} from favorites`}
                  title="Remove from favorites"
                  onClick={() => void handleRemove(product.id)}
                >
                  <FavoriteButton />
                </span>
                <div className="product-cart__details">
                  <Link className="product-cart__name" href={`/${product.id}`}>
                    {product.name}
                  </Link>
                  <p className="product-cart__category">
                    Handcrafted chocolate
                  </p>
                  <div className="favorite-product__actions">
                    <p className="product-cart__price">
                      ${Number(product.price).toFixed(2)}
                    </p>
                    <button
                      className="product-cart__cart-button"
                      type="button"
                      aria-label={`Add ${product.name} to cart`}
                      disabled={addingProductId === product.id}
                      onClick={() => void handleAddToCart(product.id)}
                    >
                      {addedProductId === product.id ? "✓" : "🛒"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
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
