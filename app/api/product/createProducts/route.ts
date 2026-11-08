"use server"
import {pool} from "@/lib/db"
import {NextResponse} from "next/server"

export async function POST(req: Request) {
    try {
        const {name, price, description} = await req.json();
        const res = await pool.query('insert into products (name, price, description) values ($1, $2, $3) returning *', 
            [name, price, description]
        );
        return NextResponse.json(res.rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }   
};