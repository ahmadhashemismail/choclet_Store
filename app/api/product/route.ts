import {pool} from "@/lib/db"
import {NextResponse} from "next/server"


export async function GET(req: Request) {
    const categoryParam = new URL(req.url).searchParams.get("category_id");

    let categoryId: number | null = null;
    if (categoryParam !== null) {
        categoryId = Number(categoryParam);
        if (!Number.isInteger(categoryId) || categoryId <= 0) {
            return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
        }
    }
}
export async function GET() {

    try {
        const res = await pool.query('SELECT * FROM products');
        return NextResponse.json(res.rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
};
}