"use client";
import { useEffect, useState } from "react";
import { GetProductById } from "../fetchers/fetchgetproduct";
import type { Product } from "../../lib/types/product";


export default function ProductDetails() {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
const id =Product.id;
  useEffect(() => {
    GetProductById(id)
      .then(setProduct)
      .catch((e: Error) => setError(e.message));
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

   return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}
