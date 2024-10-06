"use client";

import { getSomeCourse } from "@/actions/course";
import Course from "@/components/Dashboard/component/Course";
import Navigation from "@/components/Dashboard/component/Navigation";
import { courseType } from "@/types/types";
import { Input } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";

const Page = () => {
  const [courses, setCourses] = useState<courseType[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      let data = await getSomeCourse(search);
      if (!data.success) return toast("Some Error Happened", { type: "error" });
      setCourses(data.data ?? []);
    };

    let timeoutId = setTimeout(() => {
      getCourses();
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search]);

  return (
    <section className="w-full h-full p-2 flex flex-col gap-3 items-center">
      <Navigation lebel="Go To Navigation" link="/dashboard" search={false} />
      <div className="scroll w-full h-full overflow-y-scroll flex flex-col items-center gap-6">
        <div className="heading text-[clamp(40px,6vw,120px)] font-semibold text-black/30">
          Our Courses
        </div>
        <Input
          type="search"
          placeholder="Search Anything"
          labelPlacement="outside"
          startContent={
            <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="w-[clamp(150px,700px,90vw)]"
        />
        <div className="courses-container flex flex-wrap gap-6 md:gap-16 w-[clamp(150px,1000px,90vw)] justify-evenly  p-3">
          {courses
            .filter((e) => e.lessons?.length! > 0)
            .map((e, i) => {
              return <Course key={i} data={e} />;
            })}
        </div>
      </div>
    </section>
  );
};

export default Page;
