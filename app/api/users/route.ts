import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")!;
  const point = request.nextUrl.searchParams.get("point")!;
  let json = await request.json();

  const updated_user = await prisma.user.update({
    where: { id },
    data: {
      point: parseInt(point),
    },
  });

  if (!updated_user) {
    return new NextResponse("No user with ID found", { status: 404 });
  }

  return NextResponse.json(updated_user);
}