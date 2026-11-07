"use client";
import {useEffect, useState} from 'react';
import type {Product} from "@/lib/types/product";
import {GetProduct} from '../fetchers/fetchgetproduct';

export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const product = await GetProduct();
      setProducts(Array.isArray(product) ? product : []);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
        <div>
          <li key={product.id}>{product.name}</li>
          <li>{product.description}</li>
          <li>${product.price}</li>
          <hr />
          </div>
          
        ))}
      </ul>
      
    </div>
  );
}