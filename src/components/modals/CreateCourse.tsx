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
} from "@nextui-org/react";
import { courseType } from "@/types/types";
import z, { ZodError } from "zod";
import { toast } from "react-toastify";
import { createCourse, updateCourse } from "@/actions/course";
import { userAtom } from "@/atom/atom";
import { useRecoilState } from "recoil";

const courseSchema = z.object({
  name: z.string().min(3, { message: "Name should atleast 3 character long" }),
  description: z.string(),
  image: z.string(),
  price: z.string(),
});

const CreateCourse = ({
  update = false,
  data,
}: {
  update?: boolean;
  data?: courseType;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [user, setUser] = useRecoilState(userAtom);

  const [course, setCourse] = useState<courseType>(
    !update
      ? {
          name: "",
          description: "",
          image: "",
          price: "",
        }
      : data!
  );

  const change = (
    value: any,
    key: "name" | "description" | "image" | "price"
  ) => {
    setCourse((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    let parsedData = courseSchema.safeParse(course);
    if (!parsedData.success) {
      return toast(parsedData.error.errors[0].message, { type: "warning" });
    }
    if (!user.id) return toast("Not Signed In", { type: "error" });
    const res = await createCourse(course, user.id!);
    if (!res.success) toast(res.message, { type: "error" });
    else {
      onClose();
      setUser({
        ...user,
        createdCourses: [...user.createdCourses!, res.data as courseType],
      });
      toast("Created", { type: "success" });
    }
  };

  const handleUpdate = async () => {
    let parsedData = courseSchema.safeParse(course);
    if (!parsedData.success) {
      return toast(parsedData.error.errors[0].message, { type: "warning" });
    }
    if (!user.id) return toast("Not Signed In", { type: "error" });
    const res = await updateCourse(course, course.id!);
    if (!res.success) toast(res.message, { type: "error" });
    else {
      onClose();
      setUser({
        ...user,
        createdCourses: [
          ...user.createdCourses!.filter((e) => e.id != res.data!.id),
          res.data as courseType,
        ],
      });
      toast("Updated", { type: "success" });
    }
  };

  return (
    <>
      <Button onPress={onOpen} className="text-black bg-gray-300">
        {update ? "Update Course" : "Create Course"}
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {update ? "Update Course" : "Create Course"}
              </ModalHeader>
              <ModalBody>
                <div className="wrapper flex flex-col gap-3">
                  <Input
                    placeholder="Name"
                    value={course.name}
                    onChange={(e) => change(e.target.value, "name")}
                  ></Input>
                  <Textarea
                    placeholder="Description"
                    value={course.description}
                    onChange={(e) => change(e.target.value, "description")}
                  ></Textarea>
                  <Input
                    placeholder="Image Link"
                    value={course.image}
                    onChange={(e) => change(e.target.value, "image")}
                  ></Input>
                  <Input
                    placeholder="Price"
                    value={course.price}
                    onChange={(e) => change(e.target.value, "price")}
                  ></Input>
                </div>
              </ModalBody>
              <ModalFooter className="">
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

export default CreateCourse;
