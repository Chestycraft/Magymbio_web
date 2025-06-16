"use client";
import { useEffect, useState } from "react";
import { useSupabaseSession } from "../../lib/supabaseProvider";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase-client";
import UserTracker from "./../../components/user/user-Tracker";


export default function UserDashboard() {
  const { session } = useSupabaseSession();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return; // loading
    if (session === null) {
      router.push("/login");
    }
  }, [session, router]);


  
if (session === undefined) {
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Loading your dashboard...</p>
    </div>
  );
}

if (session === null) {
  return null; // or loader; router.push handles redirection
}
 const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");}
return (
  <>
      <div className="flex items-center justify-center h-screen flex-col">
    <UserTracker />

      <div className="text-center">
        <button onClick={logout} className=" text-black mt-5 bg-white p-3 rounded-lg">
          Log Out
        </button>
      </div>
    </div>
  </>
);
 
}
