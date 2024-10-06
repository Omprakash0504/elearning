/* eslint-disable @next/next/no-img-element */
import { lessonType } from "@/types/types";
import { JsonArray } from "@prisma/client/runtime/library";
import React from "react";
import Player from "react-player";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

const Lesson = ({ data }: { data: lessonType }) => {
  console.log(data);
  return (

    <div className="w-[clamp(100px,200px,80vw)] flex flex-col gap-4">
      {data.type == "VIDEO" && (
        <div className="video w-full aspect-[1/.5] rounded-md object-cover overflow-hidden pointer-events-none">
          <Player width={"100%"} height={"100%"} controls url={data.video!} />
        </div>
      )}
      {data.type == "PDF" && (
        <div className="video w-full aspect-[1/.5] rounded-md object-cover overflow-hidden bg-black/20 font-black text-3xl tracking-widest text-black/70 flex items-center justify-center">
          PDF
        </div>
      )}
      {data.type == "QUIZ" && (
        <div className="video w-full aspect-[1/.5] rounded-md object-cover overflow-hidden bg-black/20 font-black text-3xl tracking-widest text-black/70 flex items-center justify-center">
          QUIZ
        </div>
      )}
      {data.type == "SLIDESHOW" && (
        <div className="carosuel w-full aspect-[1/.5] rounded-md object-cover overflow-hidden bg-black/20 font-black text-3xl tracking-widest text-black/70 flex items-center justify-center">
          <Carousel>
            {(data.slideshow as JsonArray)?.map((slide, i) => (
              <img
                key={i}
                src={slide as string}
                alt="slide"
                className="w-full h-full object-cover"
              />
            ))}
          </Carousel>
        </div>
      )}

      <div className="title font-semibold tetx-xl">{data.titel}</div>
    </div>
  );
};

export default Lesson;
