"use client";
import {useEffect, useState} from 'react';
import type {Product} from "@/lib/types/product";
import {GetProduct} from '../fetchers/fetchgetproduct';
import ProductDetails from './getproductbyid';
export default function Product() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const product = await GetProduct();
      setProducts(Array.isArray(product) ? product : []);
    };

    fetchProducts();
  }, []);
const details = (id: number) => {
  return <ProductDetails id={id} />;
}
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
        <div onClick={() =>  details} >
          <li key={product.id}>{product.name}</li>
          <li>${product.price}</li><hr />
          </div>
          
        ))}
      </ul>
      
    </div>
  );
}