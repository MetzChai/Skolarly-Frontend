"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { stripMarkdown } from "@/lib/stripMarkdown";

interface Props {
  result: string;
}

export function LessonResult({ result }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(
      stripMarkdown(result),
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-end mb-4">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>

        <ReactMarkdown>
          {result}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}