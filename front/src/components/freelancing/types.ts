import { z } from "zod";

export interface UserData {
  name: string;
  jobTitle: string;
  description: string;
  skills: string[];
}

export const userDataSchema = z.object({
  name: z.string().describe("Name of the freelancer"),
  jobTitle: z.string().describe("Job title of the freelancer"),
  description: z.string().describe("Description of the freelancer"),
  skills: z.array(z.string()).describe("Skills of the freelancer"),
});
