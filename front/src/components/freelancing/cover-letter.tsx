// "use client";

// import { useState } from "react";
// import { UserData } from "./types";
// import { Label } from "../ui/label";
// import { Textarea } from "../ui/textarea";
// import { Button } from "../ui/button";
// import { useActions, useUIState } from "ai/rsc";

// export function CoverLetter({ coverLetter }: { coverLetter: string }) {
//   const [jobDescription, setJobDescription] = useState("");
//   const { submitUserMessage } = useActions();
//   const [_, setMessages] = useUIState();

//   return (
//     <div className="grid w-full gap-1.5">
//       <h1 className="text-lg">
//         Insert the job description to start generating the cover letter
//       </h1>
//       <Label htmlFor="message">Job description</Label>
//       <Textarea
//         placeholder="Type the job description here."
//         id="message"
//         onChange={(e) => {
//           setJobDescription(e.target.value);
//         }}
//       />
//       <Button
//         onClick={async () => {
//           const response = await submitUserMessage(
//             `Important! Do not call any tool this is just a simple text prompt.
// Generate a cover letter using this template: ${template}.
// With my freelance profile information:
// -Name: ${userData.name}
// -Job title: ${userData.jobTitle}
// -Description: ${userData.description}
// -Skills: ${userData.skills.join(", ")}
// Also use the job description to improve it: ${jobDescription}.
// Note: Fill the square brackets using the freelancer information and the job description as context, leave the ones that you don't have enough information.`
//           );

//           setMessages((currentMessages: any[]) => [
//             ...currentMessages,
//             response,
//           ]);
//         }}
//       >
//         Generate cover letter
//       </Button>
//     </div>
//   );
// }
