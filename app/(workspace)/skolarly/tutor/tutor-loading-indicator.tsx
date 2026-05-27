import { Loader2, Bot } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function TutorLoadingIndicator() {
  return (
    <div className="flex max-w-[75%] gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted ring-1 ring-border">
        <Bot className="size-4 text-muted-foreground" />
      </div>

      <Card className="border-border/80 bg-card">
        <CardContent className="flex items-center gap-2 p-3.5 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin text-primary" />
          Thinking...
        </CardContent>
      </Card>
    </div>
  );
}
