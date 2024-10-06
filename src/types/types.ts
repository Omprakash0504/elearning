import { JsonValue } from "@prisma/client/runtime/library";

export type userType = {
  email?: string | null;
  image?: string | null;
  name?: string | null;

  id?: string;

  provider?: boolean;

  password?: string;
  emailVerified?: string;

  education?: string | null;

  tags?: string;

  recentCourseId?: string;

  role?: "USER" | "ADMIN";

  createdCourses?: courseType[];
  enrollments?: enrollments[];
};

export type courseType = {
  id?: string;

  authorId?: string;
  author?: userType;

  name: string;
  description: string;
  price?: string;
  image: string;

  lessons?: lessonType[];
};

export type lessonType = {
  id?: string;
  courseId?: string;

  sl: string;

  titel: string;
  description: string;

  type: "VIDEO" | "PDF" | "QUIZ" | "SLIDESHOW";

  video: string | null;
  pdf: string | null;
  quiz?: JsonValue;
  slideshow?: JsonValue;

  additional?: string | null;

  createdAt?: Date;
  updatedAt?: Date;
};

export type enrollments = {
  // id: string;

  userId: string;
  courseId: string;

  progress: number;
  progressMark: string | null;

  course?: courseType;
};
