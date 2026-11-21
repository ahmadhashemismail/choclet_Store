"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/app/(component)/Header/page";
import { getProductById } from "@/app/fetchers/product/fetchgetproduct";
import { GetCartProduct } from "@/app/fetchers/cart/fetchGetFromCard";
import {updateQuantity} from "@/app/fetchers/cart/fetchUpadatequantity"
import type { Product } from "@/lib/types/product";
import Loading from "@/app/(component)/loading/page"
import { useRef } from "react";
export default function CartItem() {
  const [cartitem, setCartitem] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingProductId, setUpdatingProductId] = useState<number | null>(null);
  const itemCount = cartitem.reduce(
    (count, item) => count + Number(item.quantity || 0),
    0,
  );
  const subtotal = cartitem.reduce(
    (total, item) => total + Number(item.price) * Number(item.quantity || 0),
    0,
  );
  const estimatedTax = subtotal * 0.08;
  const orderTotal = subtotal + estimatedTax;

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const rows: { product_id: number,quantity:number }[] = await GetCartProduct();
        const products = await Promise.all(
        rows.map(async ({ product_id, quantity }) => ({
    ...(await getProductById(product_id)),
    quantity,
  })),);
        
        if (!cancelled) setCartitem(products);
        
      } catch {
        if (!cancelled) {
          setError(
            "faild to get cart items he",
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
  const quantityTimers = useRef(
  new Map<number, ReturnType<typeof setTimeout>>(),
);
async function changeQuantity(item: Product, quantity: number) {
  if (quantity < 1) return;

  // Update the UI immediately
  setCartitem((current) =>
    current.map((product) =>
      product.id === item.id ? { ...product, quantity } : product,
    ),
  );

  // Reset the 3-second timer for this product
  const existingTimer = quantityTimers.current.get(item.id);
  if (existingTimer) clearTimeout(existingTimer);

  const timer = setTimeout(async () => {
    try {
      setError(null);
      await updateQuantity({
        product_id: item.id,
        account_id: 0,
        quantity,
      });
    } catch (quantityError) {
      setError(
        quantityError instanceof Error
          ? quantityError.message
          : "Failed to update quantity.",
      );
    } finally {
      quantityTimers.current.delete(item.id);
    }
  }, 1000);

  quantityTimers.current.set(item.id, timer);
}
  

  return (
    <main className="storefront cart-page">
      <Header />
      <section className="cart-content" aria-label="Shopping cart">
        <div className="cart-main">
          <div className="cart-list__heading">
            <h1>Your cart</h1>
            <span className="cart-list__count">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="cart-shipping">
            <p>You have free shipping</p>
            <div className="cart-shipping__track" aria-hidden="true">
              <span />
            </div>
          </div>

          {loading ? (
            <Loading/>
          ) : error ? (
            <p className="cart-message cart-message--error" role="alert">
              {error}
            </p>
          ) : cartitem.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty__mark" aria-hidden="true">C</span>
              <h3>Your box is still empty</h3>
              <p>Find a favorite in the chocolate collection and it will appear here.</p>
              <Link className="cart-button" href="/#shop">Explore chocolates</Link>
            </div>
          ) : (
            <div className="cart-list__items">
              {cartitem.map((item, index) => (
                <article className="cart-line" key={`${item.id}-${index}`}>
                  <div className="cart-line__image">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        sizes="90px"
                        unoptimized
                      />
                    ) : (
                      <span aria-hidden="true">C</span>
                    )}
                  </div>
                  <div className="cart-line__details">
                    <h3>{item.name}</h3>
                    <p>{item.description || "Handcrafted chocolate selection"}</p>
                    <p>${Number(item.price).toFixed(2)} each</p>
                    <Link className="cart-line__link" href={`/${item.id}`}>
                      View product
                    </Link>
                  </div>
                  <div className="cart-line__actions">
                    <div className="cart-quantity" aria-label={`Quantity ${item.quantity}`}>
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        disabled={updatingProductId === item.id || item.quantity <= 1}
                        onClick={() => void changeQuantity(item, item.quantity - 1)}
                      >
                        −
                      </button>
                      <strong>{item.quantity}</strong>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        disabled={updatingProductId === item.id}
                                                onClick={() => void changeQuantity(item, item.quantity + 1)}

                      >
                        +
                      </button>
                    </div>
                    <strong className="cart-line__price">
                      ${(Number(item.price) * Number(item.quantity || 0)).toFixed(2)}
                    </strong>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>

        <aside
          id="cart-order-summary"
          className="cart-summary"
          aria-label="Cart summary"
        >
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
          <div className="cart-summary__promo">
            <span>Promo code</span>
            <div>
              <input aria-label="Promo code" placeholder="Enter code" />
              <button type="button">Apply</button>
            </div>
          </div>
          <div className="cart-summary__rule" />
          <div className="cart-summary__total">
            <span>Total</span>
            <strong>${orderTotal.toFixed(2)}</strong>
          </div>
          <p className="cart-summary__note">Free returns within 14 days on unopened items.</p>
        </aside>
      </section>

      <footer className="storefront__footer cart-footer">
        {!loading && !error && cartitem.length > 0 && (
          <Link
            className="cart-button cart-mobile-checkout"
            href="/checkout"
          >
            <span>Checkout</span>
            <strong>${orderTotal.toFixed(2)}</strong>
          </Link>
        )}
        <div className="cart-footer__brand">
          <span className="storefront__brand-mark" aria-hidden="true">✳</span>
          <p>Made with care, wrapped in chocolate.</p>
        </div>
      </footer>
    </main>
  );
}