/* eslint-disable @next/next/no-img-element */
"use client";

import Signin from "@/components/modals/Signin";
import Signup from "@/components/modals/Signup";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const session = useSession();

  useEffect(() => {
    console.log(session);
    if (session.status == "authenticated") {
      // toast.error("You are already logged in");
      redirect("/dashboard");
    }
  }, [session]);
  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-3">
      <nav className="w-full flex items-center justify-between px-3 md:px-6 py-4">
        <div className="logo font-bold text-2xl">E-Learning</div>
        <div className="buttons flex gap-2 text-white">
          <Signup />
          <Signin />
        </div>
      </nav>
      <div className="landing flex-1 flex flex-col-reverse md:flex-row items-center justify-between gap-28 px-6">
        <div className="flex flex-col gap-10 w-[clamp(300px,650px,90vw)] items-center md:items-start">
          <div className="heading font-bold text-7xl ">
            The E-Learning Platform
          </div>
          <div className="desc text-lg">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
            tempora vel deleniti magni, dicta delectus fuga at voluptatem
            blanditiis consequatur?
          </div>
          <Signup fancy />
        </div>
        <img
          src="/assets/bg.gif"
          alt=""
          className="img w-[clamp(200px,450px,90vw)]"
        ></img>
      </div>
    </main>
  );
}
