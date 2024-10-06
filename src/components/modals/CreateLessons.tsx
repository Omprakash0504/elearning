"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { courseType, lessonType } from "@/types/types";
import z, { ZodError } from "zod";
import { toast } from "react-toastify";
import { createCourse, updateCourse } from "@/actions/course";
import { userAtom } from "@/atom/atom";
import { useRecoilState } from "recoil";
import { createLessons, updateLesson } from "@/actions/lessons";
import { MdEdit } from "react-icons/md";
import { JsonArray } from "@prisma/client/runtime/library";

const lessonsSchema = z.object({
  titel: z
    .string()
    .min(3, { message: "Title should atleast 3 character long" }),
  description: z.string(),
  type: z.enum(["VIDEO", "PDF", "QUIZ","SLIDESHOW"]),
  video: z.string(),
  pdf: z.string(),
  quiz: z.string(),
  slideshow:z.array(z.string()),
  additional: z.string(),
  sl: z.string(),

});

const CreateLessons = ({
  update = false,
  data,
  course,
  setCourse,
}: {
  update?: boolean;
  data?: lessonType;
  course: courseType;
  setCourse: React.Dispatch<React.SetStateAction<courseType | null>>;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [user, setUser] = useRecoilState(userAtom);

  const [lesson, setLesson] = useState<lessonType>(
    !update
      ? {
          sl: "",
          titel: "",
          description: "",
          type: "VIDEO",
          video: "",
          pdf: "",
          quiz: "",
          additional: "",
        }
      : data!
  );

  const change = (
    value: any,
    key:
      | "titel"
      | "description"
      | "video"
      | "pdf"
      | "quiz"
      | "slideshow"
      | "additional"
      | "type"
      | "sl"
  ) => {
    setLesson((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    let parsedData = lessonsSchema.safeParse(lesson);
    if (!parsedData.success) {
      return toast(parsedData.error.errors[0].message, { type: "warning" });
    }
    if (!user.id) return toast("Not Signed In", { type: "error" });
    const res = await createLessons(lesson, course.id!);
    if (!res.success) toast(res.message, { type: "error" });
    else {
      onClose();
      setCourse({ ...course, lessons: [...course.lessons!, res.data!] });
      toast("Created", { type: "success" });
    }
  };

  const handleUpdate = async () => {
    let parsedData = lessonsSchema.safeParse(lesson);
    if (!parsedData.success) {
      return toast(parsedData.error.errors[0].message, { type: "warning" });
    }
    if (!user.id) return toast("Not Signed In", { type: "error" });
    const res = await updateLesson(lesson, lesson.id!);
    if (!res.success) toast(res.message, { type: "error" });
    else {
      onClose();
      setCourse({
        ...course,
        lessons: [
          ...course.lessons!.filter((e) => e.id != res.data!.id),
          res.data as lessonType,
        ],
      });
      toast("Updated", { type: "success" });
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="text-black bg-gray-300">
        {update ? <MdEdit className="text-2xl" /> : "Create Lesson"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} isDismissable={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {update ? "Update Lesson" : "Create Lesson"}
              </ModalHeader>
              <ModalBody>
                <Tabs
                  aria-label="Options"
                  selectedKey={lesson.type}
                  onSelectionChange={(e) => change(e as string, "type")}
                >
                  <Tab key="VIDEO" value="VIDEO" title="Video">
                    <div className="wrapper flex flex-col gap-3">
                      <Input
                        placeholder="Serial"
                        value={lesson.sl}
                        onChange={(e) => change(e.target.value, "sl")}
                      ></Input>
                      <Input
                        placeholder="Name"
                        value={lesson.titel}
                        onChange={(e) => change(e.target.value, "titel")}
                      ></Input>
                      <Textarea
                        placeholder="Description"
                        value={lesson.description}
                        onChange={(e) => change(e.target.value, "description")}
                      ></Textarea>
                      <Input
                        placeholder="Video Link"
                        value={lesson.video!}
                        onChange={(e) => change(e.target.value, "video")}
                      ></Input>
                      <Input
                        placeholder="Additional"
                        value={lesson.additional!}
                        onChange={(e) => change(e.target.value, "additional")}
                      ></Input>
                    </div>
                  </Tab>
                  <Tab key="PDF" value="PDF" title="Pdf">
                    <div className="wrapper flex flex-col gap-3">
                      <Input
                        placeholder="Serial"
                        value={lesson.sl}
                        onChange={(e) => change(e.target.value, "sl")}
                      ></Input>
                      <Input
                        placeholder="Name"
                        value={lesson.titel}
                        onChange={(e) => change(e.target.value, "titel")}
                      ></Input>
                      <Textarea
                        placeholder="Description"
                        value={lesson.description}
                        onChange={(e) => change(e.target.value, "description")}
                      ></Textarea>
                      <Input
                        placeholder="Pdf Link"
                        value={lesson.pdf!}
                        onChange={(e) => change(e.target.value, "pdf")}
                      ></Input>
                      <Input
                        placeholder="Additional"
                        value={lesson.additional!}
                        onChange={(e) => change(e.target.value, "additional")}
                      ></Input>
                    </div>
                  </Tab>
                  <Tab key="QUIZ" value="QUIZ" title="quiz">
                    <div className="wrapper flex flex-col gap-3">
                      <Input
                        placeholder="Serial"
                        value={lesson.sl}
                        onChange={(e) => change(e.target.value, "sl")}
                      ></Input>
                      <Input
                        placeholder="Name"
                        value={lesson.titel}
                        onChange={(e) => change(e.target.value, "titel")}
                      ></Input>
                      <Textarea
                        placeholder="Description"
                        value={lesson.description}
                        onChange={(e) => change(e.target.value, "description")}
                      ></Textarea>
                      <Input
                        placeholder="Quiz Link"
                        value={lesson.quiz! as string}
                        onChange={(e) => change(e.target.value, "quiz")}
                      ></Input>
                      <Input
                        placeholder="Additional"
                        value={lesson.additional!}
                        onChange={(e) => change(e.target.value, "additional")}
                      ></Input>
                    </div>
                  </Tab>
                  <Tab key="SLIDESHOW" value="SLIDESHOW" title="slideshow">
                    <div className="wrapper flex flex-col gap-3">
                      <Input
                        placeholder="Serial"
                        value={lesson.sl}
                        onChange={(e) => change(e.target.value, "sl")}
                      ></Input>
                      <Input
                        placeholder="Name"
                        value={lesson.titel}
                        onChange={(e) => change(e.target.value, "titel")}
                      ></Input>
                      <Textarea
                        placeholder="Description"
                        value={lesson.description}
                        onChange={(e) => change(e.target.value, "description")}
                      ></Textarea>
                      {(lesson.slideshow as JsonArray)?.map((slide, index) => (
                        <Input
                          key={index}
                          placeholder={`Slide ${index + 1} Link`}
                          value={slide as string}
                          onChange={(e) => {
                            const newSlides = [
                              ...(lesson.slideshow as JsonArray)!,
                            ];
                            newSlides[index] = e.target.value;
                            change(newSlides, "slideshow");
                          }}
                        />
                      ))}
                      <Button
                        onPress={() => {
                          const newSlides = lesson.slideshow
                            ? [...(lesson.slideshow as JsonArray), ""]
                            : [""];
                          change(newSlides, "slideshow");
                        }}
                      >
                        Add Slide
                      </Button>
                      <Input
                        placeholder="Additional"
                        value={lesson.additional!}
                        onChange={(e) => change(e.target.value, "additional")}
                      ></Input>
                    </div>
                  </Tab>
                </Tabs>
              </ModalBody>
              <ModalFooter className="">
                <Button color="danger" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={update ? handleUpdate : handleSubmit}
                >
                  {update ? "Update" : "Create"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateLessons;
