import Product from "@/app/component/product"
import CreateProduct from "@/app/component/craeteproduct"
import ProductDetails from "@/app/component/getproductbyid"
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Chocolate Store</h1>
      <Product />
      <CreateProduct />
      <ProductDetails  />
    </div>
  );
}
