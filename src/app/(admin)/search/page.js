"use client";
import { useRouter } from "next/navigation";
import { supabase } from "../../supabase-client";
import AdminTracker from './../../components/admin/admin-Tracker';

export default function UserDashboard() {
  const router = useRouter();


  return (
    <>
     <AdminTracker/>
    </>
  );
}
