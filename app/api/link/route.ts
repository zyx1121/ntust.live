import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return new NextResponse("No user with ID found", { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")!;
  const link = request.nextUrl.searchParams.get("link")!;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  const preLinks = user?.link;
  let newLinks = [...preLinks!, link];

  if (preLinks?.includes(link)) {
    newLinks = preLinks?.filter((item) => item !== link);
  }

  const updated_user = await prisma.user.update({
    where: { id },
    data: {
      link: (link === "" ? [] : newLinks)
    },
  });

  if (!updated_user) {
    return new NextResponse("No user with ID found", { status: 404 });
  }

  return NextResponse.json(updated_user);
}
