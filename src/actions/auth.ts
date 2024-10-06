"use server";

import prisma from "../../prisma/prisma";
import { userType } from "@/types/types";
import { hashSync } from "bcrypt";
import z, { ZodError } from "zod";

const userSchema = z.object({
  name: z.string().min(3, { message: "Name should atleast 3 character long" }),
  email: z.string().email({ message: "Not a valid email" }),
  password: z.string().min(8, { message: "Password is too small" }),
  role: z.enum(["USER", "ADMIN"]),
  education: z.string().optional(),
  tags: z.string(),
});

export const handleSignUp = async (user: userType) => {
  try {
    const parsedBody = userSchema.safeParse(user);

    if (!parsedBody.success)
      return { success: false, message: parsedBody.error.issues[0].message };

    const newUser = await prisma.user.create({
      data: {
        email: user.email!,
        password: hashSync(user.password!, 10),
        name: user.name!,
        role: user.role,
        education: user.education ?? null,
        tags: user.tags,
      },
    });

    return { success: true, data: newUser, message: "Signed In Successfully" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: error.message };
    } else {
      console.log(error);
      return { success: false, message: "Internal server error" };
    }
  }
};

export const handleAccountDelete = async (userId: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await prisma.$transaction([
        prisma.course.deleteMany({ where: { authorId: userId } }),
        prisma.user.delete({ where: { id: userId } }),
      ]);

      if (res) {
        resolve(true);
      } else {
        reject(new Error("Failed to delete user and courses"));
      }
    } catch (error) {
      reject(error);
    }
  });
};
