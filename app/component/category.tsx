"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types/category";
import { GetCategory } from "../fetchers/fetchgetcategory";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const category = await GetCategory();
      setCategories(Array.isArray(category) ? category : []);
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((category) => (
          <div key={category.id}>
            <li>
              <Link href={`/categories/${category.id}`}>{category.name}</Link>
            </li>
            <li>{category.description}</li>
            <hr />
          </div>
        ))}
      </ul>
    </div>
  );
}
