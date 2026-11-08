"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { GetCategoryById } from "../fetchers/fetchgetcategory";
import { GetProductByCategoryId } from "../fetchers/fetchgetproduct";
import type { Category } from "@/lib/types/category";
import type { Product } from "@/lib/types/product";

export default function CategoryDetails() {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([GetCategoryById(Number(id)), GetProductByCategoryId(Number(id))])
      .then(([c, p]) => {
        setCategory(c);
        setProducts(p);
      })
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!category) return <p>Loading...</p>;

  return (
    <div>
      <h2>{category.name}</h2>
      <p>{category.type}</p>
      <ul>
        {products.map((product) => (
          <div key={product.id}>
            <li>{product.name}</li>
            <li>${product.price}</li><hr />
          </div>
        ))}
      </ul>
    </div>
  );
}
