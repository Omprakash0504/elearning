import { userType } from "@/types/types";

import { atom } from "recoil";

export const userAtom = atom<userType>({
  default: {
    email: "",
    image: "",
    name: "",

    id: "",

    provider: false,

    password: "",
    emailVerified: "",

    education: "",

    tags: "",

    recentCourseId: "",

    role: "USER",

    createdCourses: [],
    enrollments: [],
  },
  key: "user"
});
