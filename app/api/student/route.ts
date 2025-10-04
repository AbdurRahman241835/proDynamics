import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";


type where = { 
  name?: {
    contains: string  
  },
  remarks?: string
}
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");
  const filter = searchParams.get("filter");
  
  let where: where = {};

  if (search) {
    where  =  {
      name:{
        contains : search,
      },
    }
  }

  if (filter && filter !== "ALL") {
    where.remarks = filter;
  }

  const students = await prisma.student.findMany({
    where,
    include: { subject: true },
    orderBy: { id: "asc" },
  });

  return NextResponse.json(students);
}

export async function POST(req: Request) {
  const { name, subjectId, grade } = await req.json();
  const remarks = grade >= 75 ? "PASS" : "FAIL";

  const student = await prisma.student.create({
    data: { name, subjectId, grade, remarks },
  });

  return NextResponse.json(student);
}

export async function PUT(req: Request) {
  const { id, name, subjectId, grade } = await req.json();
  const remarks = grade >= 75 ? "PASS" : "FAIL";

  const updated = await prisma.student.update({
    where: { id },
    data: { name, subjectId, grade, remarks },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.student.delete({ where: { id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
