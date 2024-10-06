/* eslint-disable @next/next/no-img-element */
import { userAtom } from "@/atom/atom";
import { courseType } from "@/types/types";
import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Chip,
  Avatar,
} from "@nextui-org/react";
import { enrollCourse } from "@/actions/course";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const Course = ({
  data,
  purchase = false,
}: {
  data: courseType;
  purchase?: boolean;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [user, setUser] = useRecoilState(userAtom);
  const router = useRouter();

  const handleClick = async () => {
    const res = await enrollCourse(data.id!, user.id!);
    if (!res.success) return toast("Some Error Happened", { type: "error" });
    toast("Purchased SuccesFully");
    onClose();
    setUser({...user,enrollments:[...user.enrollments??[],res.data!]})
    router.push("/dashboard/" + data.id!);
  };

  // if (user.enrollments?.find((e) => e.courseId == data.id)) return <></>;

  return user.role == "ADMIN" || purchase ? (
    <Link
      href={"/dashboard/" + data.id}
      className="w-[clamp(100px,250px,90vw)] flex flex-col gap-1 cursor-pointer"
    >
      <div className="img-wrapper w-full aspect-[1/.6] relative group overflow-hidden rounded-lg bg-black">
        <img
          src={data.image}
          alt=""
          className="w-full h-full object-cover rounded-lg bg-black/5 group-hover:scale-110 duration-200 z-0"
        />
        <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-black via-transparent to-black z-[200] text-white hover:opacity-0 duration-200">
          <div className="wrapper w-full h-full relative">
            <div className="authorname absolute top-2 left-2">
              <Chip>{data.price}</Chip>
            </div>
          </div>
        </div>
      </div>
      <div className="title font-semibold text-lg">{data.name}</div>
      <div className="desc text-[#aaabaf] text-sm font-medium line-clamp-3 text-ellipsis overflow-hidden">
        {data.description}
      </div>
    </Link>
  ) : (
    <>
      <div
        className="w-[clamp(100px,250px,90vw)] flex flex-col gap-1 cursor-pointer"
        onClick={onOpen}
      >
        <div className="img-wrapper w-full aspect-[1/.6] relative group overflow-hidden rounded-lg">
          <img
            src={data.image}
            alt=""
            className="w-full h-full object-cover rounded-lg bg-black/5 group-hover:scale-110 duration-200 z-0"
          />
          <div className="absolute w-full h-full top-0 left-0 bg-gradient-to-b from-black via-transparent to-black text-white hover:opacity-70 duration-200">
            <div className="wrapper w-full h-full relative">
              <div className="authorname absolute top-2 left-2">
                <Chip>{data.price}</Chip>
              </div>
              <div className="authorname absolute top-2 right-2">
                <Avatar name={data.author?.name!} size="sm"/>
              </div>
            </div>
          </div>
        </div>
        <div className="title font-semibold text-lg">{data.name}</div>
        <div className="desc text-[#aaabaf] text-sm font-medium line-clamp-3 text-ellipsis overflow-hidden">
          {data.description}
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Purchase Course
              </ModalHeader>
              <ModalBody>Course Price is {data.price}</ModalBody>
              <ModalFooter className="">
                <Button color="primary" onClick={handleClick}>
                  Purchase
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Course;
