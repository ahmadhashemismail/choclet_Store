import { Category } from "./category";
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category_id: number | null;
  Category?: Category | null;
  image_url : string | null;
  quantity:number;
}
