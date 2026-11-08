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

    try {
        const base = `SELECT p.*, c.name AS category_name
                      FROM products p
                      LEFT JOIN categories c ON c.id = p.category_id`;
        const res = categoryId === null
            ? await pool.query(`${base} ORDER BY p.id`)
            : await pool.query(`${base} WHERE p.category_id = $1 ORDER BY p.id`, [categoryId]);
        return NextResponse.json(res.rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
};
