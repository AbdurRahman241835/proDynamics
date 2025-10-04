import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const subjects = await prisma.subject.findMany();
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const subject = await prisma.subject.create({ data: { name } });
  return NextResponse.json(subject);
}
