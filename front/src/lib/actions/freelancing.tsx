// @ts-nocheck

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import "server-only";

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  createStreamableValue,
} from "ai/rsc";

import {
  BotCard,
  BotMessage,
  SpinnerMessage,
} from "@/components/commons/message";

import { nanoid, sleep } from "@/lib/utils";
import { CheckIcon, SpinnerIcon } from "@/components/ui/icons";
import { format } from "date-fns";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { ListTemplates } from "@/components/freelancing/list-templates";
import { userMetadata } from "@/data";
import { UserDataForm } from "@/components/freelancing/user-data-form";
import { userDataSchema } from "@/components/freelancing/types";
import { JobDescription } from "@/components/freelancing/cover-letter";
import { getAnswer } from "./commons";

const systemInstructions = `You are a friendly assistant that helps freelancers with cover letters for applying to jobs in upwork and other related platforms.
        You will use the users information and job descriptions generating the cover letter`;

async function submitUserMessage(content: string) {
  "use server";

  const aiState = getMutableAIState();

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: "user",
        content: `${aiState.get().interactions.join("\n\n")}\n\n${content}`,
      },
    ],
  });

  const history = aiState.get().messages.map((message) => ({
    role: message.role,
    content: message.content,
  }));
  // console.log(history);

  const textStream = createStreamableValue("");
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  (async () => {
    try {
      const result = await streamText({
        model: openai("gpt-3.5-turbo"),
        temperature: 0,
        tools: {
          requestTemplates: {
            description: "Request cover letter templates.",
            parameters: z.object({}),
          },
          updateUserData: {
            description: "Request the form to update the user data.",
            parameters: z.object({}),
          },
        },
        system: systemInstructions,
        messages: [...history],
        onFinish: ({ usage }) => {
          const { promptTokens, completionTokens, totalTokens } = usage;
          // your own logic, e.g. for saving the chat history or recording usage
          console.log("Prompt tokens:", promptTokens);
          console.log("Completion tokens:", completionTokens);
          console.log("Total tokens:", totalTokens);
        },
      });

      let textContent = "";
      spinnerStream.done(null);

      for await (const delta of result.fullStream) {
        const { type } = delta;

        if (type === "text-delta") {
          const { textDelta } = delta;

          textContent += textDelta;
          messageStream.update(<BotMessage content={textContent} />);

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: "assistant",
                content: textContent,
              },
            ],
          });
        } else if (type === "tool-call") {
          const { toolName, args } = delta;

          if (toolName === "requestTemplates") {
            uiStream.update(
              <BotCard>
                <ListTemplates />
              </BotCard>
            );

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "assistant",
                  content: `Here's a list of cover letter templates, choose one.`,
                  display: {
                    name: "requestTemplates",
                    props: {},
                  },
                },
              ],
            });
          }
          if (toolName === "updateUserData") {
            uiStream.update(
              <BotCard>
                <p className="text-center font-medium">
                  Here is the form to update your profile
                </p>
                <UserDataForm fromChat={true} />
              </BotCard>
            );

            aiState.done({
              ...aiState.get(),
              interactions: [],
              messages: [
                ...aiState.get().messages,
                {
                  id: nanoid(),
                  role: "assistant",
                  content: `Here's the form to update the user data.`,
                  display: {
                    name: "requestTemplates",
                    props: {},
                  },
                },
              ],
            });
          }
        }
      }

      uiStream.done();
      textStream.done();
      messageStream.done();
    } catch (e) {
      console.error(e);

      const error = new Error(
        "The AI got rate limited, please try again later."
      );
      uiStream.error(error);
      textStream.error(error);
      messageStream.error(error);
      aiState.done();
    }
  })();

  return {
    id: nanoid(),
    role: "assistant",
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value,
  };
}

export type Message = {
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  id?: string;
  name?: string;
  display?: {
    name: string;
    props: Record<string, any>;
  };
};

export type AIState = {
  chatId: string;
  interactions?: string[];
  messages: Message[];
};

export type UIState = {
  id: string;
  role: "user" | "assistant";
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), interactions: [], messages: [] },
});
