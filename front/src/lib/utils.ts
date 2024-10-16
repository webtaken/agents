import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { OpenAPI } from "@/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function setCredentialsToAPI() {
  const session = await getServerSession(authOptions);
  if (!session) throw Error("set credentials failed");
  // eslint-disable-next-line
  // @ts-ignore
  OpenAPI.TOKEN = session.django_data.access;
  OpenAPI.BASE = process.env.BASE_PATH_API!;
}

export function setBasePathToAPI() {
  OpenAPI.BASE = process.env.BASE_PATH_API!;
}
