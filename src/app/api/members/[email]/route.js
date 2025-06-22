import { NextResponse } from "next/server";
import memberservices from "@/app/lib/services/memberservices";

//get a member by email
//<form action="/api/members/byEmail" method="GET">
export async function GET(_,{params}) {
  const { email } = await params;
  const result = await memberservices.getByEmail(email)
  return NextResponse.json(result)
}
//update subscription by email
export async function PUT(req, { params }) {
  const { email } = await params;
  const body = await req.json();
  const updated = await memberservices.update(email,body)
  if (!email) {
  return NextResponse.json({ error: 'Missing email' }, { status: 400 });
}
  return NextResponse.json(updated);
}
//==================================

//delete a member by email
export async function DELETE(_, { params }) {
  const { email } = await params;
  const deleted = await memberservices.delete(email)
  return NextResponse.json(deleted);
}
//==================================
