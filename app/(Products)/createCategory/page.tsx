"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { createCategoryAction } from "@/app/actions/createCategoryAction";

export default function CreateCategory() {
  const categoryFormRef = useRef<HTMLFormElement | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null);

  const handleCreateCategory = async (formData: FormData) => {
    setSavingCategory(true);
    setCategoryError(null);
    setCategoryMessage(null);

    try {
      await createCategoryAction(formData);
      categoryFormRef.current?.reset();
      setCategoryMessage("Category created successfully.");
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Failed to create category.",
      );
    } finally {
      setSavingCategory(false);
    }
  };

  return (
    <div className="storefront storefront__manage">
      <header className="storefront__header">
        <Link className="storefront__brand" href="/">
          <span className="storefront__brand-mark">C</span>
          <span>
            <strong>CACAO</strong>
            <small>STORE</small>
          </span>
        </Link>
      </header>

      <section className="storefront__section-heading">
        <span className="storefront__eyebrow">The Chocolate Room</span>
        <h2>Create a category</h2>
        <p>Shape the shelf so every chocolate has a home.</p>
      </section>

      <div className="storefront__forms storefront__forms--category">
        <aside className="create-category__panel" aria-label="Category planning">
          <span className="store-form__number"> THE SHELF</span>
          <div className="create-category__art" aria-hidden="true">
            <div className="chocolate-art chocolate-art--2">
              <span className="chocolate-art__piece chocolate-art__piece--one" />
              <span className="chocolate-art__piece chocolate-art__piece--two" />
              <span className="chocolate-art__piece chocolate-art__piece--three" />
            </div>
          </div>
          <h3>Build a better display</h3>
          <ul className="create-category__list">
            <li>Group collections by mood, flavor, or occasion.</li>
            <li>Keep your storefront easy to browse and easy to update.</li>
            <li>Use broad names like “Signature bars” or “Holiday picks”.</li>
          </ul>
        </aside>

        <form
          className="store-form store-form--category create-category__form"
          action={handleCreateCategory}
          ref={categoryFormRef}
        >
          <span className="store-form__number">CATEGORY DETAILS</span>
          <h3>Name your shelf</h3>
          <p className="store-form__intro">
            Give your chocolates a home. Your new category will be ready to
            choose when you add a product.
          </p>

          <label>
            Category name
            <input
              name="name"
              type="text"
              placeholder="e.g. Dark chocolate"
              required
            />
          </label>

          {categoryError && (
            <p className="store-form__feedback store-form__feedback--error" role="alert">
              {categoryError}
            </p>
          )}
          {categoryMessage && (
            <p className="store-form__feedback" role="status">
              {categoryMessage}
            </p>
          )}

          <button
            type="submit"
            className="store-form__submit"
            disabled={savingCategory}
          >
            {savingCategory ? "Creating category..." : "Create category"}
          </button>
        </form>
      </div>
    </div>
  );
}
