"use client";

import Lesson from "@/components/Dashboard/component/Lesson";
import Navigation from "@/components/Dashboard/component/Navigation";
import { Button, CircularProgress, Divider } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation as NavigationModule } from "swiper/modules";
import Player from "react-player";
import { useRecoilState } from "recoil";
import { userAtom } from "@/atom/atom";
import { courseType, enrollments, lessonType } from "@/types/types";
import { getCourse, progressMarkr } from "@/actions/course";
import { useSession } from "next-auth/react";
import CreateLessons from "@/components/modals/CreateLessons";
import CreateCourse from "@/components/modals/CreateCourse";
import DeleteCourse from "@/components/modals/DeleteCourse";
import DeleteLesson from "@/components/modals/DeleteLesson";
import { FaDownload } from "react-icons/fa6";
import { toast } from "react-toastify";

const Page = ({ params }: { params: { courseId: string } }) => {
  const session = useSession();
  const [user, setUser] = useRecoilState(userAtom);
  const [course, setCourse] = useState<courseType | null>(null);
  const [playingLesson, setPlayingLesson] = useState<lessonType | null>();
  const [enrollment, setEnrollment] = useState<enrollments | null>(null);

  useEffect(() => {
    const asyncFunc = async () => {
      let data = await getCourse(params.courseId, user.id!);
      setCourse(data.data);
      setPlayingLesson(data.data?.lessons[0]);
      setEnrollment(data.data?.enrollments[0]!);
    };
    asyncFunc();
  }, [params,user.id]);

  const handleComplete = async (lesson: lessonType) => {
    const res = await progressMarkr(
      course?.id!,
      lesson.sl,
      user.id!,
      enrollment!
    );
    if (!res.success) return toast("Some Error Happened", { type: "error" });
    toast("Marked as Complete");
    setEnrollment({
      ...enrollment!,
      progressMark: enrollment?.progressMark + "," + lesson.sl,
      progress: enrollment?.progress! + 1,
    });
  };

  if (session.status == "loading") return;
  <div className="w-full h-full flex items-center justify-center font-bold text-4xl">
    Loading
  </div>;

  return user.role == "USER" ? (
    <section className="w-full h-screen overflow-hidden bg-white flex flex-col pl-4">
      <Navigation lebel="Back" link="/dashboard" />
      <div className="heading font-bold text-xl md:text-2xl pl-3 pb-3">
        {course?.name}
      </div>
      <div className="flex overflow-y-scroll flex-1 gap-3 justify-center">
        <div className="course-container flex-1 items-center flex flex-col w-[200px] gap-3 pb-4">
          <div className="player w-[90%] flex-1 bg-black/5 rounded-xl relative overflow-hidden max-h-[210px] sm:max-h-max flex items-center justify-center flex-col gap-4">
            {playingLesson?.type == "VIDEO" && (
              <Player
                width={"100%"}
                height={"100%"}
                controls
                url={playingLesson.video!}
                playing={false}
              />
            )}
            {playingLesson?.type == "PDF" && (
              <>
                <span className="text-5xl font-semibold text-black/40">
                  PDF
                </span>
                <a href={playingLesson.pdf ?? ""} target="_blank" download={""}>
                  <Button
                    endContent={
                      <>
                        <FaDownload className="text-2xl" />
                      </>
                    }
                  >
                    Download
                  </Button>
                </a>
              </>
            )}
            {playingLesson?.type == "QUIZ" && (
              <>
                <span className="text-5xl font-semibold text-black/40">
                  QUIZ
                </span>
                <a href={(playingLesson.quiz as string) ?? ""} target="_blank">
                  <Button
                    endContent={
                      <>
                        <FaDownload className="text-2xl" />
                      </>
                    }
                  >
                    Open
                  </Button>
                </a>
              </>
            )}
            {!enrollment?.progressMark!
              .split(",")
              .includes(playingLesson?.sl!) && (
              <div className="markasread absolute bottom-2 right-2 z-[1000]">
                <Button
                  color="primary"
                  onClick={(e) => handleComplete(playingLesson!)}
                >
                  Complete
                </Button>
              </div>
            )}
          </div>
          <div className="text-lg font-semibold">Lessons</div>
          <Swiper
            modules={[NavigationModule]}
            centeredSlides
            // loop
            autoplay
            className="w-full select-none mask-class"
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 25,
              },
              550: {
                slidesPerView: 2,
                spaceBetween: 50,
              },
              900: {
                slidesPerView: 2,
                spaceBetween: 70,
              },
              1100: {
                slidesPerView: 3,
                spaceBetween: 100,
              },
              1400: {
                slidesPerView: 4,
                spaceBetween: 100,
              },
            }}
          >
            {course?.lessons &&
              course?.lessons
                .sort((a, b) => Number(a.sl) - Number(b.sl))
                ?.map((e, i) => {
                  return (
                    <SwiperSlide
                      key={i}
                      onClick={(k) => {
                        setPlayingLesson(e);
                      }}
                    >
                      <Lesson data={e} />
                    </SwiperSlide>
                  );
                })}
          </Swiper>
        </div>
        <Divider orientation="vertical" className="lg:flex hidden" />
        <div className="right lg:flex flex-col w-[clamp(100px,300px,90vw)] flex-shrink-0 hidden text-base md:text-lg gap-3">
          <div className="item flex gap-2 font-medium items-center">
            <CircularProgress
              size="md"
              value={enrollment?.progress!}
              color="success"
              showValueLabel={true}
              maxValue={course?.lessons?.length}
            />
            Lessons Left - {enrollment?.progress!} of {course?.lessons?.length}
          </div>
          <span className="text-sm">
            Complete the lessons here total lessons are{" "}
            {course?.lessons?.length} and you have completed{" "}
            {enrollment?.progress} of them.
          </span>
          <br />
          {playingLesson?.additional && (
            <div className="heading font-medium">Additional Information</div>
          )}
          <span className="text-sm">{playingLesson?.additional}</span>
        </div>
      </div>
    </section>
  ) : (
    <section className="w-full h-screen overflow-hidden bg-white flex flex-col pl-4 items-center">
      <Navigation lebel="Back" link="/dashboard" />
      <div className="heading w-full font-bold text-xl md:text-2xl pl-3 pb-3 flex items-center justify-between pr-4 flex-wrap gap-3">
        {course?.name}
        <div className="buttons flex gap-2">
          {course && <CreateLessons course={course!} setCourse={setCourse} />}
          {course && <CreateCourse update data={course!} />}
          {course && <DeleteCourse data={course!} />}
        </div>
      </div>
      <div className="lessons flex flex-col gap-4 items-center w-[90%] md:w-[70%] mt-6 flex-1 overflow-y-scroll">
        {course?.lessons
          ?.sort((a, b) => Number(a.sl) - Number(b.sl))
          .map((e, i) => {
            return (
              <div
                key={i}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-black/5 duration-300 hover:bg-black/10"
              >
                {e.type == "VIDEO" && (
                  <div className="video aspect-video h-[clamp(50px,100px,10vh)] rounded-md overflow-hidden">
                    <Player
                      width={"100%"}
                      height={"100%"}
                      controls
                      url={e.video!}
                      playing={false}
                    />
                  </div>
                )}
                {e.type == "PDF" && (
                  <div className="video aspect-video h-[clamp(50px,100px,10vh)] rounded-md overflow-hidden bg-black/20 font-black text-3xl tracking-widest text-black/70 flex items-center justify-center">
                    PDF
                  </div>
                )}
                {e.type == "QUIZ" && (
                  <div className="video aspect-video h-[clamp(50px,100px,10vh)] rounded-md overflow-hidden bg-black/20 font-black text-3xl tracking-widest text-black/70 flex items-center justify-center">
                    QUIZ
                  </div>
                )}
                {e.type == "SLIDESHOW" && (
                  <div className="video aspect-video h-[clamp(50px,100px,10vh)] rounded-md overflow-hidden bg-black/20 font-black text-xl tracking-widest text-black/70 flex items-center justify-center">
                    SLIDES
                  </div>
                )}
                <div className="details flex flex-col w-[clamp(50px,400px,50vw)]">
                  <div className="title font-semibold text-lg line-clamp-1 overflow-hidden text-ellipsis">
                    {e.titel}
                  </div>
                  <div className="desc line-clamp-2 text-xs overflow-hidden text-ellipsis">
                    {e.description}
                  </div>
                </div>
                <div className="flex-1"></div>
                <div className="flex flex-col gap-2">
                  <CreateLessons
                    course={course}
                    setCourse={setCourse}
                    update
                    data={e}
                  />
                  <DeleteLesson
                    data={e}
                    course={course}
                    setCourse={setCourse}
                  />
                </div>
              </div>
            );
          })}
        {course?.lessons?.length == 0 && (
          <div className="flex flex-col gap-3 items-center justify-center w-full h-full">
            No Data Found
            {course && <CreateLessons course={course!} setCourse={setCourse} />}
          </div>
        )}
      </div>
    </section>
  );
};

export default Page;
