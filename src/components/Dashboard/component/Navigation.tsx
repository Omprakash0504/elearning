"use client";
import { userAtom } from "@/atom/atom";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilState } from "recoil";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";

type Props = {
  link: string;
  lebel: string;
  search?: boolean;
  account?: boolean;
};

const Navigation = ({ link, lebel, search = true, account = true }: Props) => {
  const [user, setUser] = useRecoilState(userAtom);
  const [render, setRender] = useState(true);

  // useEffect(() => {
  //   user != undefined && setRender(true);
  // }, [user]);

  // if (user == undefined) return <></>;

  return (
    render && (
      <nav className="left w-full items-center flex px-2 pr-4 py-2 justify-between">
        <Link
          href={link}
          className="navigation flex gap-1 items-center font-medium text-[#706fe7] invisible md:visible"
        >
          <IoIosArrowBack className="text-xl text-[#aaabaf]" />
          {lebel}
        </Link>
        <div className="right flex items-center gap-4">
          {search && <CiSearch className="text-2xl cursor-pointer" />}
          {account && (
            <Popover placement="right">
              <PopoverTrigger>
                <Avatar name={user.name!} className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2">
                  <div className="text-small font-bold">{user.name}</div>
                  <div className="text-tiny">{user.email}</div>
                  <div className="education">{user.education}</div>
                  <div className="tags">{user.tags}</div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </nav>
    )
  );
};

export default Navigation;
