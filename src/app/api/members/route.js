import memberservices from "@/app/lib/services/memberservices";
import { NextResponse } from "next/server";

//get all members with pagination
export async function GET(req) {
  const {searchParams} = new URL(req.url)
  const page = parseInt(searchParams.get('page')||"1")
  const limit = parseInt(searchParams.get('limit')||"10")

  const subscriptions = await memberservices.getAll({page,limit});
  return NextResponse.json(subscriptions);
}

//post a new member
export async function POST(req) {
  const body = await req.json();
  const newSubscription = await memberservices.create(body)
  return NextResponse.json(newSubscription)
}
