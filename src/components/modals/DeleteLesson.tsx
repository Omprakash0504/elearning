"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { courseType, lessonType } from "@/types/types";
import { deleteLesson } from "@/actions/lessons";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

const DeleteLesson = ({
  data,
  course,
  setCourse,
}: {
  data?: lessonType;
  course: courseType;
  setCourse: React.Dispatch<React.SetStateAction<courseType | null>>;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleDelete = async (id: string) => {
    const res = await deleteLesson(id);
    if (!res.success) toast(res.message, { type: "error" });
    else {
      setCourse({
        ...(course as courseType),
        lessons: course!.lessons?.filter((e) => e.id != res.data!.id),
      });
      toast("Deleted", { type: "success" });
    }
  };

  return (
    <>
      <Button onPress={onOpen} color="danger" variant="ghost">
        <MdDelete className="text-2xl" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Lesson
              </ModalHeader>
              <ModalBody>Are You Sure To Delete The Lesson ?</ModalBody>
              <ModalFooter className="">
                <Button color="danger" onPress={(e) => deleteLesson(data?.id!)}>
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteLesson;
