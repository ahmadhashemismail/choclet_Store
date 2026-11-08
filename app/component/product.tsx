"use client";
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/product";
import { GetProduct } from "../fetchers/fetchgetproduct";
import ProductDetails from "./ProductDetails";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DELETE } from "../fetchers/fetchDeleteProduct";
export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const product = await GetProduct();
      setProducts(Array.isArray(product) ? product : []);
    };

    fetchProducts();
  }, []);
  const handleDelete = async (id: number) => {
    try {
      await DELETE(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error("can not deleting product:", error);
    }
  };

  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.id}`}
          style={{ display: "block", cursor: "pointer" }}
        >
          <div>
            <h3>{product.name}</h3>
            <p>${product.price}</p>
            <button
              onClick={(e) => {
                e.preventDefault();
                handleDelete(product.id);
              }}
            >
              Delete
            </button>
            <hr />
          </div>
        </Link>
      ))}
    </div>
  );
}
