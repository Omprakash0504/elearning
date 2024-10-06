// mark as client component
"use client";

import { SessionProvider } from "next-auth/react";
import { NextUIProvider } from "@nextui-org/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import React from "react";
import { redirect } from "next/navigation";
import { RecoilRoot } from "recoil";

const SessionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <RecoilRoot>
      <SessionProvider>
        <NextUIProvider>
          {children}
          <ToastContainer />
        </NextUIProvider>
      </SessionProvider>
    </RecoilRoot>
  );
};

export default SessionWrapper;
