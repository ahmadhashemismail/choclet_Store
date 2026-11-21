"use client";

import { useEffect, useRef, useState } from "react";
import { createProductAction } from "@/app/actions/createProductAction";
import { GetCategory } from "@/app/fetchers/category/fetchgetcategory";
import type { Category } from "@/lib/types/category";

export default function CreateProduct() {
  const productFormRef = useRef<HTMLFormElement | null>(null);
  const categoryFormRef = useRef<HTMLFormElement | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productMessage, setProductMessage] = useState<string | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [categoryMessage, setCategoryMessage] = useState<string | null>(null);
  const [savingCategory, setSavingCategory] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await GetCategory();
        setCategories(Array.isArray(result) ? result : []);
        setCategoryError(null);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategoryError("Could not load categories.");
      }
    };

    void fetchCategories();
  }, []);

  const handleCreateProduct = async (formData: FormData) => {
    setSavingProduct(true);
    setError(null);
    setProductMessage(null);

    try {
      await createProductAction(formData);
      productFormRef.current?.reset();
      setProductMessage("Product added successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create product.",
      );
    } finally {
      setSavingProduct(false);
    }
  };

  return (
    <div>
      <form
        className="store-form"
        action={handleCreateProduct}
        ref={productFormRef}
      >
        <span className="store-form__number">01 / THE COLLECTION</span>
        <h3>Add a chocolate</h3>
        <label>
          Product name
          <input
            name="name"
            type="text"
            placeholder="e.g. Sea Salt Truffle"
            required
          />
        </label>
        <div className="store-form__row">
          <label>
            Price
            <input
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </label>
          <label>
            Category
            <select name="category_id" defaultValue="">
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea
            name="description"
            placeholder="Tell everyone what makes it special..."
            rows={3}
            required
          />
        </label>
        <label>
          Image
          <input type="file" name="image_url" accept="image/*" required />
        </label>
        {error && (
          <p
            className="store-form__feedback store-form__feedback--error"
            role="alert"
          >
            {error}
          </p>
        )}
        {productMessage && (
          <p className="store-form__feedback" role="status">
            {productMessage}
          </p>
        )}
        <button
          type="submit"
          className="store-form__submit"
          disabled={savingProduct}
        >
          {savingProduct ? "Adding chocolate..." : "Add chocolate"}
        </button>
      </form>
    </div>
  );
}
