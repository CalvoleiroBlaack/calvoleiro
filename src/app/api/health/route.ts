import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const result = await db.execute(sql`
      select
        current_database(),
        current_user;
    `);

    return Response.json({
      ok: true,
      result,
      databaseUrlExists: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL?.length,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 40),
    });
  } catch (e) {
    return Response.json(
      {
        ok: false,
        message: e instanceof Error ? e.message : String(e),
        name: e instanceof Error ? e.name : null,
        stack: e instanceof Error ? e.stack : null,
      },
      { status: 500 }
    );
  }
}
