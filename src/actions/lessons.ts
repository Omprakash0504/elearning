"use server";

import prisma from "../../prisma/prisma";
import { lessonType } from "@/types/types";
import z, { ZodError } from "zod";

const lessonsSchema = z.object({
  titel: z
    .string()
    .min(3, { message: "Title should atleast 3 character long" }),
  description: z.string(),
  type: z.enum(["VIDEO", "PDF", "QUIZ","SLIDESHOW"]),
  video: z.string(),
  pdf: z.string(),
  quiz: z.any(),
  additional: z.string(),
  sl: z.string(),
});

export const createLessons = async (lesson: lessonType, courseId: string) => {
  try {
    const parsedBody = lessonsSchema.safeParse(lesson);

    if (!parsedBody.success)
      return { success: false, message: parsedBody.error.issues[0].message };

    const courseData = await prisma.lesson.create({
      data: {
        type: lesson.type,
        titel: lesson.titel,
        description: lesson.description,
        courseId,
        additional: lesson.additional,
        pdf: lesson.pdf,
        quiz: lesson.quiz ?? undefined,
        slideshow: lesson.slideshow??undefined,
        video: lesson.video,
        sl: lesson.sl
      },
    });

    return { success: true, data: courseData, message: "Created Successfully" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.message };
    } else {
      console.log(error);
      return { success: false, message: "Internal server error" };
    }
  }
};

export const updateLesson = async (lesson: lessonType, lessonId: string) => {
  try {
    const parsedBody = lessonsSchema.safeParse(lesson);

    if (!parsedBody.success)
      return { success: false, message: parsedBody.error.issues[0].message };

    const lessonData = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        ...lesson,
        quiz: lesson.quiz ?? undefined,
        slideshow: lesson.slideshow ?? undefined
      },
    });

    return { success: true, data: lessonData, message: "Updated Successfully" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.message };
    } else {
      console.log(error);
      return { success: false, message: "Internal server error" };
    }
  }
};

export const deleteLesson = async (lessonId: string) => {
  try {
    const lessonData = await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    return { success: true, data: lessonData, message: "Deleted Successfully" };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal server error" };
  }
};

export const getLessons = async (courseId: string) => {
  try {
    const data = await prisma.lesson.findFirst({
      where: {
        courseId,
      },
    });

    return { success: true, data: data, message: "" };
  } catch (error) {
    return { success: false, data: null, message: "Internal Error" };
  }
};
