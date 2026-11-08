import { createCategoryAction } from "@/app/actions/createCategoryAction";

export default async function CreateCategory() {
  return (
    <div>
      <form action={createCategoryAction}>
        <input type="text" name="type" placeholder="Category Type" required />
        <input type="text" name="name" placeholder="Category Name" required />
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
}
