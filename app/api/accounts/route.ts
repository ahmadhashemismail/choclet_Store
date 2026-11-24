import {pool} from "@/lib/db"
import {NextResponse} from "next/server"

export async function GETAccounts() {

    try {
        const res = await pool.query(
            "SELECT email FROM accouts ORDER BY id "
        );
        return NextResponse.json(res.rows, { status: 200 });
    } catch (error) {
        console.error('Error fetching accouts:', error);
        return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 });
    }
};