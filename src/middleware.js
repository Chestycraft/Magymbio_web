import { NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

//nextjs autodetects this
export async function middleware(req){
    //for escaping
const res= NextResponse.next();

const supabase= createMiddlewareClient({req, res});

const{data:{user}}= await supabase.auth.getUser();


//see if user exists in the browser
if(!user){ 

console.log('not found the usah')
    return NextResponse.redirect(new URL('/login',req.url));
}

//check the database for role
const {data: roles, error}= await supabase
.from('roles')
.select('role')
.ilike('email',user.email)
.single();

console.log(user.email)
console.log(roles?.role)
if (error) {
  console.error("Supabase role fetch error:", error);
  return NextResponse.redirect(new URL("/", req.url));
}

  // If no role found or user is not an admin, redirect
if (!roles || roles.role !=="admin"){
    return NextResponse.redirect(new URL(('/', req.url)));
}

//if passed then gora
return res;
}

//this is also automatically detected by next
export const config = {
  matcher: ['/admin/:path*'], // match everything just to test
};
