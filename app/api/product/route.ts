import {pool} from "@/lib/db"
import {NextResponse} from "next/server"

export async function GET() {
    try {
        const res = await pool.query('SELECT * FROM products');
        return NextResponse.json(res.rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
};
