   import type { Product } from "@/lib/types/product";

<<<<<<< HEAD
   export async function GetProduct() {
  
=======
   export async function GetProduct(): Promise<Product[]> {
>>>>>>> 050683fa03811ded6fd28e31516011d64c6a6cba
     const res = await fetch(`/api/product`, {
       method: "GET",
       headers: { "Content-Type": "application/json" },
     });
     const data = await res.json();
     if (!res.ok) throw new Error(data.error);
     return data;
   }

   export async function GetProductById(id: number): Promise<Product> {
     const res = await fetch(`/api/product/${id}`);
     const data = await res.json();
     if (!res.ok) throw new Error(data.error);
     return data;
   }

   export async function GetProductByCategoryId(categoryId: number): Promise<Product[]> {
     const res = await fetch(`/api/product/category/${categoryId}`);
     const data = await res.json();
     if (!res.ok) throw new Error(data.error);
     return data;
   }
