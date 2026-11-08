import {createProductAction} from '@/app/actions/createProductAction';
import {pool} from '@/lib/db';
import type {Category} from '@/lib/types/category';

export default async function CreateProduct() {
const res = await pool.query('SELECT * FROM categories ORDER BY name');
const categories: Category[] = res.rows;
return(
<div>
    <form action={createProductAction}>
        <input type="text" name="name" placeholder="Product Name" required />
        <input type="number" name="price" placeholder="Product Price" required />
        <textarea name="description" placeholder="Product Description" required></textarea>
        <select name="category_id" defaultValue="">
            <option value="">No category</option>
            {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
            ))}
        </select>
        <button type="submit">Create Product</button>
    </form>
</div>
);
}
