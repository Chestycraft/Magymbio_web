"use client";
import { useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import UserTracker from "../user/user-Tracker";
import { supabase } from "../../supabase-client";

//this component finds a user from the database through username and displays a tracker
//this needs the UserTracker component inorder to work

export default function AdminTracker() {
  //usestates
  const [Details, setDetails] = useState({});
  const [Username, setUsername] = useState("");

  //submit userquerry
  const handleSubmit = async (e) => {
    e.preventDefault(); //avoid reloading the page
    setDetails
    //if submitted without name
    if (!Username.trim()) {
      alert("Please enter a username");
      setDetails(false)
      return;
    }
    //fetch the member
    const {data, error} = await supabase
    .from("subscriptions")
    .select("*")
    .eq("nickname",Username)
    .maybeSingle()
    //if theres error
    if (error){
      console.log("error: ",error)
      setDetails(false)
    }else{
      //if theres no error
      setDetails(data)
    }
  }

  //showed HTML
  return (
    <div className="flex flex-col items-center justify-center gap-6 m-[10px]">
      <form className="Tracker" onSubmit={handleSubmit}>
        <fieldset className="p-4 border rounded">
          <legend className="text-white">ADMIN</legend>
          <label htmlFor="username">Username</label>
          <br />
          <input
            type="text"
            placeholder="type-in username"
            name="username"
            autoComplete="off"
            id="username"
            value={Username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            className="mt-2 px-2 py-1 border rounded"
          />
          <button
            type="submit"
            className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
          >
            Check
          </button>
        </fieldset>
      </form>
      {Details && (
        <UserTracker details={Details}/>
      )}
    </div>
  );
}
