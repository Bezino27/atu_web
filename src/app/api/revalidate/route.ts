import { NextResponse } from "next/server";
import { revalidateFromRequest } from "@/app/lib/revalidate";

export async function POST(request: Request) {
  const response = await revalidateFromRequest(request);

  return NextResponse.json(response.body, { status: response.status });
}
