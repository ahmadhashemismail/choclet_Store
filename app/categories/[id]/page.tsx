import { notFound } from "next/navigation";
import CategoryDetails from "@/app/component/CategoryDetails";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) notFound();

  return <CategoryDetails key={categoryId} />;
}
