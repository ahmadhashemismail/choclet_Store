import Product from "@/app/component/product"
import CreateProduct from "@/app/component/craeteproduct"
import Category from "@/app/component/category"
import CreateCategory from "@/app/component/createcategory"
import ProductDetails from "@/app/component/getproductbyid"
export default function Home() {
  return (
    <div>
      <h1>Welcome to the Chocolate Store</h1>
      <Category />
      <CreateCategory />
      <Product />
      <CreateProduct />
      <ProductDetails  />
    </div>
  );
}
