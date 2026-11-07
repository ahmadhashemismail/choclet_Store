import Product from "@/app/component/product"
import CreateProduct from "@/app/component/craeteproduct"
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Chocolate Store</h1>
      <Product />
      <CreateProduct />
    </div>
  );
}
