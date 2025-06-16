"use client";
import { useEffect, useState } from "react";
import MembershipProgress from "../common/circleprogbar";
import { supabase } from "../../supabase-client";
import { useSupabaseSession } from "../../lib/supabaseProvider";

export default function UserTracker({ details }) {
  const [Details, setDetails] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const { session } = useSupabaseSession();
  /*fetch the details from the database*/
  async function fetchSubscription() {
    //check if theres a user session and an email init
    if (!session?.user?.email) return;
    //do the querry in subscription table and select from all of the row with an email equals to the session email
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("email", session.user.email)
      .maybeSingle(); //maybe because owner mightve removed it
    //if theres error fetching the row
    if (error) {
      console.error("Error fetching profile:", error);
      setDetails(null); // ✅ Clear ghost
      setDaysLeft(null); // ✅ Also reset days left
      setExpiry(null); // ✅ Reset expiry
    } else {
      //if theres no problem
      console.log("Subscription data:", data); // <--- did it return something?
      setDetails(data); //set the details
    }
  }
  useEffect(()=>{
    setDetails(details)
  },[details])
  //fetch session whenever the session changes
  useEffect(() => {
    if (!details) {
      fetchSubscription();
    }
  }, [session]);
  //if the details are fetched if yes handletime
  useEffect(() => {
    if (Details && Object.keys(Details).length > 0) {
      //checks if details contain anything if yes handle the time vars
      handleTime();
    }
  }, [Details]);
  //handles the time details for displaying
  function handleTime() {
    //this is called by a useeffect so its good to check if details exist
    if (!Details || !Details.started) {
      setDaysLeft(null); // <-- ensures UI shows "No Subscription Active"
      return;
    }
    //if its existent
    if (Details.started) {
      setDaysLeft(null); // Reset first
      const totalDays = handleTotalDays(); //this tries to see if monthly(30) or halfmonth(15)
      const start = new Date(Details.started); //gets the started date from the detail and turn it into date
      start.setHours(0, 0, 0, 0); // 👈 normalize start
      const end = new Date(start); //clones the start
      end.setDate(end.getDate() + totalDays - 1); //sets the end date

      const today = new Date(); //today var for the daysleft calculation
      today.setHours(0, 0, 0, 0); // Clear time for accurate comparison
      setExpiry(end); //sets the expiring date
      //if booked
      if (today < start) {
        const daysUntilStart = Math.ceil(
          (start - today) / (1000 * 60 * 60 * 24)
        );
        setDaysLeft(
          `Membership starts in ${daysUntilStart} day${
            daysUntilStart !== 1 ? "s" : ""
          }`
        );
        return;
      }
      //if expired
      if (today > end) {
        const daysPast = Math.ceil((today - end) / (1000 * 60 * 60 * 24));
        setDaysLeft(
          `Membership expired ${daysPast} day${daysPast !== 1 ? "s" : ""}`
        );
        return;
      }
      //daysleft
      let daysleft = Math.floor((end - today) / (1000 * 60 * 60 * 24));
      setDaysLeft(daysleft < 0 ? 0 : daysleft);
    }
  }
  //the function called earlier
  function handleTotalDays() {
    if (!Details) return 0;
    if (Details.membership_type === "monthly") {
      return 30;
    } else {
      //if halfmonth
      return 15;
    }
  }
  //for conditional rendering checks if details is not null cuz if it is it goes to no subs active
  const hasValidSubscription =
    Details !== null && typeof daysLeft === "number" && daysLeft >= 0;

  return (
    //========================================
   <div className="flex flex-col items-center justify-center gap-6 text-white">
  {hasValidSubscription ? (
    <fieldset className="Tracker p-4 border border-gray-600 rounded text-center text-white">
      <legend className="px-2 text-white">MEMBERSHIP DETAILS</legend>
      <b>Type: {Details.membership_type}</b>
      <br />
      <b>Started: {Details.started || "N/A"}</b>
      <br />
      <b>Ending: {new Date(expiry).toDateString()}</b>
      <h2 className="days_left text-2xl mt-2">
        {daysLeft}
        <small> days left</small>
      </h2>
      <MembershipProgress
        daysLeft={daysLeft}
        totalDays={handleTotalDays()}
      />
    </fieldset>
  ) : (
    <fieldset className="Tracker p-4 border border-gray-600 rounded text-center text-white">
      {typeof daysLeft === "string" ? (
        <h2
          className={`text-2xl mx-10 my-20 ${
            daysLeft.startsWith("Membership expired")
              ? "text-red-500"
              : daysLeft.startsWith("Membership starts in")
              ? "text-blue-500"
              : "text-white"
          }`}
        >
          {daysLeft}
        </h2>
      ) : (
        <h1 className="text-3xl mx-10 my-20 text-white">No Subscription Active</h1>
      )}
      <button className="mt-4 px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition">
        Go to Subscribe
      </button>
    </fieldset>
  )}
</div>

    //========================================
  );
}
