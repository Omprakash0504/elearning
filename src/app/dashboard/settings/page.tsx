"use client";

import Navigation from "@/components/Dashboard/component/Navigation";
import { Button } from "@nextui-org/button";
import React, { useState } from "react";
import prisma from "../../../../prisma/prisma";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atom/atom";
import { signOut } from "next-auth/react";
import { handleAccountDelete } from "@/actions/auth";

const Page = () => {
  const [user, setUser] = useRecoilState(userAtom);

  const [loading, setLoading] = useState(false);

  const deleteaccount = async () => {
    setLoading(true);
    if (user.id) await handleAccountDelete(user.id);
    signOut();
    setLoading(false);
  };
  return (
    <section className="w-full flex flex-col gap-6 h-full items-center">
      <Navigation lebel="Back" link="/dashboard" search={false} />
      <div className="wrapper flex w-full h-full items-center flex-col gap-6 justify-center">
        <Button>Edit Your Profile</Button>
        <Button>Forgot Password</Button>
        <Button>Reset Password</Button>
        <Button onClick={deleteaccount}>Delete Account</Button>
        These function are yet to come...
      </div>
    </section>
  );
};

export default Page;
