// mark as client component
"use client";

import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atom/atom";
import { useCookies } from "react-cookie";

const AuthChecker = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const [user, setUser] = useRecoilState(userAtom);
  const [cookies, setCookie, removeCookie] = useCookies([
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "next-auth.session-token",
  ]);

  useEffect(() => {
    console.log(session);
    if (session.status == "authenticated" && session.data) {
      setUser(session.data.data);
    }
    if (session.status == "unauthenticated") {
      toast.error("You are not logged in");
      redirect("/");
    }
  }, [session, setUser]);

  // useEffect(() => {
  //   if (session.status == "authenticated" && typeof session.data.data === undefined) {
  //     console.log(typeof session.data.data);
  //     // signOut()
  //     redirect('/')
  //   }
  // }, [session, removeCookie, user]);

  return <>{children}</>;
};

export default AuthChecker;
