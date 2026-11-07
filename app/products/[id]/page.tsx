import { notFound } from "next/navigation";
import ProductDetails from "@/app/component/ProductDetails";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) notFound();

  return <ProductDetails id={productId} />;
}
