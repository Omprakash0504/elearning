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
import { courseType } from "@/types/types";
import { deleteCourse } from "@/actions/course";

const DeleteCourse = ({ data }: { data?: courseType }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <>
      <Button onPress={onOpen}  color="danger" variant="ghost">
        Delete Course
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Course
              </ModalHeader>
              <ModalBody>Are You Sure To Delete The Course ?</ModalBody>
              <ModalFooter className="">
                <Button
                  color="danger"
                  onPress={(e) => deleteCourse(data?.id!)}
                >
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

export default DeleteCourse;
