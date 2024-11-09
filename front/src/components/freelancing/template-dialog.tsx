import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Markdown from "react-markdown";
import { Button } from "../ui/button";

export function TemplateDialog({
  title,
  template,
}: {
  title: string;
  template: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Show</Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto h-[500px] w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Markdown className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          {template}
        </Markdown>
      </DialogContent>
    </Dialog>
  );
}
