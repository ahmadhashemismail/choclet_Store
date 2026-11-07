import {createProductAction} from '@/app/actions/createProductAction';
export default async function CreateProduct() {
return(
<div>
    <form action={createProductAction}>
        <input type="text" name="name" placeholder="Product Name" required />
        <input type="number" name="price" placeholder="Product Price" required />
        <textarea name="description" placeholder="Product Description" required></textarea>
        <button type="submit">Create Product</button>
    </form>
</div>
);
}