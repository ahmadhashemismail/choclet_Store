import { createCategoryAction } from "@/app/actions/createCategoryAction";

export default async function CreateCategory() {
  return (
    <div>
      <form action={createCategoryAction}>
        <input type="text" name="name" placeholder="Category Name" required />
        <textarea name="description" placeholder="Category Description" required></textarea>
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
}
