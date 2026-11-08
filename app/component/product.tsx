"use client";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import type { Product } from "@/lib/types/product";
import { GetProduct } from "../fetchers/fetchgetproduct";
import ProductDetails from "./ProductDetails";
import Link from "next/link";
import { useParams } from "next/navigation";
import { DELETE } from "../fetchers/fetchDeleteProduct";
=======
import {useEffect, useState} from 'react';
import type {Product} from "@/lib/types/product";
import type {Category} from "@/lib/types/category";
import {GetProduct} from '../fetchers/fetchgetproduct';
import {GetCategory} from '../fetchers/fetchgetcategory';

>>>>>>> c5430830e70be607ff48dae2a6993faae30a4858
export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [product, category] = await Promise.all([GetProduct(), GetCategory()]);
      setProducts(Array.isArray(product) ? product : []);
      setCategories(Array.isArray(category) ? category : []);
    };

    fetchData();
  }, []);
  const handleDelete = async (id: number) => {
    try {
      await DELETE(id);
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    } catch (error) {
      console.error("can not deleting product:", error);
    }
  };

  // Products divided by their category; anything without one goes last.
  const groups = categories
    .map((category) => ({
      key: category.id,
      title: category.name,
      items: products.filter((p) => p.category_id === category.id),
    }))
    .filter((group) => group.items.length > 0);

  const uncategorized = products.filter(
    (p) => p.category_id === null || !categories.some((c) => c.id === p.category_id)
  );
  if (uncategorized.length > 0) {
    groups.push({ key: 0, title: "Uncategorized", items: uncategorized });
  }

  return (
    <div>
      <h1>Products</h1>
<<<<<<< HEAD
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
=======
      {groups.map((group) => (
        <section key={group.key}>
          <h2>{group.title}</h2>
          <ul>
            {group.items.map((product) => (
              <div key={product.id}>
                <li>{product.name}</li>
                <li>${product.price}</li><hr />
              </div>
            ))}
          </ul>
        </section>
>>>>>>> c5430830e70be607ff48dae2a6993faae30a4858
      ))}
    </div>
  );
}
