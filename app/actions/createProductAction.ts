"use server";
import type { Product } from '@/lib/types/product';
export async function createProductAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = Number(formData.get("price"));
  try {
    const response = await fetch('/api/createProducts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, description, price }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
};