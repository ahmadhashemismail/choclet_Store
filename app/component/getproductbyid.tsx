"use client";
import { useEffect, useState } from "react";
import { GetProductById } from "../fetchers/fetchgetproduct";
import type { Product } from "../../lib/types/product";
import { useParams } from "next/navigation";


export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    GetProductById(Number(id))
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
