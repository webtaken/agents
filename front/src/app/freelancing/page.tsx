"use client";

import type { AI, UIState } from "@/lib/actions/freelancing";
import { nanoid } from "@/lib/utils";
import { useLocalStorage } from "@uidotdev/usehooks";
import { Thread, type AppendMessage } from "@assistant-ui/react";
import {
  useVercelRSCRuntime,
  VercelRSCMessage,
} from "@assistant-ui/react-ai-sdk";
import { useActions, useUIState } from "ai/rsc";
import { useEffect } from "react";
import { toast } from "sonner";
import { UserDataForm } from "@/components/freelancing/user-data-form";
import Feedback from "@/components/freelancing/feedback";

const convertMessage = (message: UIState[number]): VercelRSCMessage => {
  return {
    id: nanoid(),
    role: message.role,
    display: (
      <>
        {message.spinner}
        {message.display}
        {message.attachments}
      </>
    ),
  };
};

export default function Page() {
  const { submitUserMessage } = useActions();
  const [userData, saveUserData] = useLocalStorage(
    "freelancing-user-data",
    null
  );
  const [messages, setMessages] = useUIState<typeof AI>();

  const onNew = async (m: AppendMessage) => {
    if (m.content[0].type !== "text")
      throw new Error("Only text messages are supported");

    const input = m.content[0].text;

    // Optimistically add user message UI
    setMessages((currentConversation: UIState) => [
      ...currentConversation,
      { id: nanoid(), role: "user", display: input },
    ]);

    // Submit and get response message
    const message = await submitUserMessage(input);
    setMessages((currentConversation: UIState) => [
      ...currentConversation,
      message,
    ]);
  };

  useEffect(() => {
    if (!userData) {
      toast.warning("Missing data", {
        description:
          "Please fill in your freelance job experience before using the agent.",
      });
    }
  }, [userData, saveUserData]);

  const runtime = useVercelRSCRuntime({ messages, convertMessage, onNew });

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <UserDataForm />
      </div>
    );
  }

  return (
    <>
      <Thread
        runtime={runtime}
        welcome={{
          suggestions: [
            {
              text: <Feedback />,
              prompt: "",
            },
            {
              text: "Show me some templates",
              prompt: "Please show me the cover letter templates",
            },
            {
              text: "Update my profile",
              prompt: "I want to update my profile",
            },
          ],
        }}
      />
    </>
  );
}
