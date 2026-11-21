"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/(component)/Header/page";
import Loading from "@/app/(component)/loading/page";
import { GetCartProduct } from "@/app/fetchers/cart/fetchGetFromCard";
import { getProductById } from "@/app/fetchers/product/fetchgetproduct";
import type { Product } from "@/lib/types/product";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity || 0),
    0,
  );
  const estimatedTax = subtotal * 0.08;
  const orderTotal = subtotal + estimatedTax;

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const rows: { product_id: number; quantity: number }[] =
          await GetCartProduct();
        const products = await Promise.all(
          rows.map(async ({ product_id, quantity }) => ({
            ...(await getProductById(product_id)),
            quantity,
          })),
        );

        if (!cancelled) setCartItems(products);
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load your order summary.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCart();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="storefront cart-page checkout-page">
      <Header />
      <section className="cart-content checkout-content" aria-label="Order summary">
        <div className="cart-main">
          <Link className="cart-line__link" href="/cartPage">
            Back to cart
          </Link>
          <h1>Order summary</h1>

          {loading ? (
            <Loading />
          ) : error ? (
            <p className="cart-message cart-message--error" role="alert">
              {error}
            </p>
          ) : cartItems.length === 0 ? (
            <div className="cart-empty">
              <h3>Your box is still empty</h3>
              <Link className="cart-button" href="/#shop">
                Explore chocolates
              </Link>
            </div>
          ) : (
            <div className="cart-list__items">
              {cartItems.map((item) => (
                <article className="checkout-order-item" key={item.id}>
                  <div>
                    <h2>{item.name}</h2>
                    <p>
                      {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <strong>
                    ${(Number(item.price) * Number(item.quantity)).toFixed(2)}
                  </strong>
                </article>
              ))}
            </div>
          )}
        </div>

        {!loading && !error && cartItems.length > 0 && (
          <aside className="cart-summary cart-summary--open" aria-label="Order totals">
            <h2>Order summary</h2>
            <div className="cart-summary__row">
              <span>Subtotal</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <strong>Free</strong>
            </div>
            <div className="cart-summary__row">
              <span>Estimated tax</span>
              <strong>${estimatedTax.toFixed(2)}</strong>
            </div>
            <div className="cart-summary__rule" />
            <div className="cart-summary__total">
              <span>Total</span>
              <strong>${orderTotal.toFixed(2)}</strong>
            </div>
          </aside>
        )}
      </section>
    </main>
  );
}
