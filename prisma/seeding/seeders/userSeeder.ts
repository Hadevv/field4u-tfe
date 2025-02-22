import { Context } from "../types";
import { users } from "./data/users";

export async function seedUsers(ctx: Context) {
  console.log("🌱 Seeding users...");

  const createdUsers = await Promise.all(
    users.map((user) => ctx.prisma.user.create({ data: user })),
  );

  ctx.created.users = createdUsers;
  return createdUsers;
}
