"use server";
import prisma from "@/lib/db";

const editUser = async (
  userId: number,
  username: string,
  className: string,
  classGearScore: number,
  secondaryClassName: string | null,
  secondaryClassGearScore: number | null,
  vkName: string,
  joined_at: Date | string
) => {
  const user = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      username,
      class: className,
      class_gear_score: classGearScore,
      secondary_class: secondaryClassName,
      secondary_class_gear_score: secondaryClassGearScore,
      vk_name: vkName,
      joined_at: new Date(joined_at),
    },
  });

  return user;
};
export default editUser;
