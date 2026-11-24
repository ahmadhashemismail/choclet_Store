"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { GetCategory } from "@/app/fetchers/category/fetchgetcategory";
import type { Product } from "@/lib/types/product";
import type { Category } from "@/lib/types/category";
import { getProduct } from "../../fetchers/product/fetchgetproduct";
import { AddProductToCart } from "@/app/fetchers/cart/fetchGetFromCard";
import ProductGridSkeleton from "@/app/(component)/ProductGridSkeleton/page";
import CreateCategory from "@/app/(Products)/createCategory/page";
import Header from "@/app/(component)/Header/page";
import AddToCartloading from "@/app/(component)/loading/addTocardloading/page";
import Mainpageloading from "@/app/(component)/loading/loadingMainpage/page";
import FavoriteButton from "@/app/(component)/favoriteIcon/page";
import { useAuth } from "@clerk/nextjs";
import { addFavoriteProduct } from "@/app/fetchers/favorite/fetchFavoriteProduct";
import { useRouter } from "next/navigation";
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

export default function Product() {
  const { isLoaded, isSignedIn } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [favoriteProductIds, setFavoriteProductIds] = useState<Set<number>>(
    new Set(),
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null);
  const [productMessage, setProductMessage] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [addingProductId, setAddingProductId] = useState<number | null>(null);
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const [carouselTurn, setCarouselTurn] = useState(0);
  const productFormRef = useRef<HTMLFormElement>(null);
  const categoryFormRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  async function loadCategories() {
    try {
      const result = await GetCategory();
      setCategories(Array.isArray(result) ? result : []);
      setCategoryError(null);
    } catch (loadError) {
      setCategoryError(
        loadError instanceof Error
          ? loadError.message
          : "Failed to load categories.",
      );
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const result = await getProduct();
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

  async function handleAddToCart(product: Product) {
    setAddingProductId(product.id);
    setError(null);
    try {
      await AddProductToCart(product.id);
      setAddedProductId(product.id);
    } catch (addError) {
      setError(
        addError instanceof Error
          ? addError.message
          : "Failed to add product to cart.",
      );
    } finally {
      setAddingProductId(null);
    }
  }
  async function handleAddToFavorite(product: Product) {
    try {
      await addFavoriteProduct(product.id);
    } catch (error) {
      setError(
        "can't add this product to favorite please try again or contact support",
      );
      console.log("falied to add to favorite page");
    }
  }

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
  const carouselItems =
    groups.length === 0
      ? []
      : Array.from({ length: Math.max(groups.length, 8) }, (_, index) => ({
          group: groups[index % groups.length],
          index,
        }));
  const carouselStep = 360 / Math.max(carouselItems.length, 1);

  return (
    <main className="storefront" id="top">
      {loading ? (
        <div className="storefront__experience-message">
          <Mainpageloading />
        </div>
      ) : (
        <>
          <Header />
          <section className="storefront__experience" id="favorites">
            <div className="storefront__experience-heading">
              <p>Small batch · Thoughtfully made</p>
              <h1>Find your favorite.</h1>
            </div>
            {carouselItems.length === 0 ? (
              <p className="storefront__experience-message">
                Our chocolate collection is coming soon.
              </p>
            ) : (
              <div
                className="storefront__carousel"
                role="region"
                aria-label="Chocolate category carousel"
              >
                <div className="storefront__carousel-glow" aria-hidden="true" />
                <div
                  className="storefront__carousel-ring"
                  style={{
                    transform: `translate(-50%, -50%) rotateY(${carouselTurn}deg)`,
                  }}
                >
                  <div className="storefront__carousel-track" role="list">
                    {carouselItems.map(({ group, index }) => {
                      const featuredProduct = group.items[0];
                      const angle = (360 * index) / carouselItems.length;

                      return (
                        <div
                          className="storefront__carousel-item"
                          style={{
                            transform: `rotateY(${angle}deg) translateZ(var(--carousel-radius))`,
                          }}
                          key={`${group.key}-${index}`}
                          role={index < groups.length ? "listitem" : undefined}
                          aria-hidden={
                            index >= groups.length ? true : undefined
                          }
                        >
                          <a
                            className={`storefront__carousel-cart storefront__carousel-cart--${index % 4}`}
                            href={`#category-${group.key}`}
                            aria-label={`${group.name}, ${group.items.length} chocolates`}
                            tabIndex={index < groups.length ? undefined : -1}
                          >
                            <span className="storefront__carousel-face storefront__carousel-face--front">
                              <span className="storefront__carousel-image">
                                {featuredProduct?.image_url ? (
                                  <Image
                                    src={featuredProduct.image_url}
                                    alt=""
                                    width={300}
                                    height={240}
                                    unoptimized
                                  />
                                ) : (
                                  <ChocolateArt variant={index} />
                                )}
                              </span>
                              <span className="storefront__carousel-meta">
                                <span className="storefront__carousel-name">
                                  {group.name}
                                </span>
                                <span className="storefront__carousel-count">
                                  {group.items.length}{" "}
                                  {group.items.length === 1
                                    ? "chocolate"
                                    : "chocolates"}
                                </span>
                              </span>
                            </span>
                            <span
                              className="storefront__carousel-face storefront__carousel-face--back"
                              aria-hidden="true"
                            >
                              <span className="storefront__carousel-back-label">
                                CACAO COLLECTION
                              </span>
                              <span className="storefront__carousel-back-name">
                                {group.name}
                              </span>
                              <ChocolateArt variant={index} />
                            </span>
                          </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <button
                  className="storefront__carousel-control storefront__carousel-control--previous"
                  type="button"
                  aria-label="Show previous chocolate category"
                  onClick={() => setCarouselTurn((turn) => turn - carouselStep)}
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  className="storefront__carousel-control storefront__carousel-control--next"
                  type="button"
                  aria-label="Show next chocolate category"
                  onClick={() => setCarouselTurn((turn) => turn + carouselStep)}
                >
                  <span aria-hidden="true">›</span>
                </button>
                <a className="storefront__experience-cta" href="#shop">
                  Explore the collection <span aria-hidden="true">↓</span>
                </a>
              </div>
            )}
          </section>
        </>
      )}
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
              <section
                className="storefront__product-group"
                id={`category-${group.key}`}
                key={group.key}
              >
                <h3 className="storefront__group-title">{group.name}</h3>
                <div className="storefront__products">
                  {group.items.map((product, index) => (
                    <article className="product-cart" key={product.id}>
                        <span
              className="favorite-product__remove"
              onClick={() =>
                !isSignedIn
                  ? router.replace("/auth")
                  : handleAddToFavorite(product)
              }
            >
              <FavoriteButton />
            </span>
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
                            height={112}
                            unoptimized
                          />
                        ) : (
                          <ChocolateArt variant={index} />
                        )}
                      </Link>

                        <Link
                          className="product-cart__name"
                          href={`/${product.id}`}
                        >
                          {product.name}
                        </Link>
                        <p className="product-cart__category">
                          {categories.find(
                            (category) => category.id === product.category_id,
                          )?.name || "Handcrafted chocolate"}
                        </p>
                        <div className="product-cart__purchase">
                          <p className="product-cart__price">
                            ${Number(product.price).toFixed(2)}
                          </p>
                          <div className="product-cart__purchase">
                            <button
                              className="product-cart__cart-button"
                              type="button"
                              disabled={addingProductId === product.id}
                              aria-label={
                                addedProductId === product.id
                                  ? `${product.name} added to cart`
                                  : `Add ${product.name} to cart`
                              }
                              title={
                                addedProductId === product.id
                                  ? "Added to cart"
                                  : "Add to cart"
                              }
                              onClick={() => void handleAddToCart(product)}
                            >
                              <span aria-hidden="true">
                                {addingProductId === product.id ? (
                                  <AddToCartloading />
                                )  : (
                                  "🛒"
                                )}
                              </span>
                            </button>
                           
                          
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
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
