import { AI } from "@/lib/actions/freelancing";
import { nanoid } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import type React from "react";
import { ClientOnly } from "@/components/commons/client-only";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  const id = nanoid();

  return (
    <AI initialAIState={{ chatId: id, interactions: [], messages: [] }}>
      <ClientOnly>
        <div className="overflow-hidden h-screen">{children}</div>
      </ClientOnly>
      <Toaster position="top-right" richColors />
    </AI>
  );
}
