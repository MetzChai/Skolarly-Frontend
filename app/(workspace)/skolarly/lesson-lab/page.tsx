"use client";

import { BookOpen } from "lucide-react";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { PageHeader } from "@/components/layout/page-header";

import { LessonForm } from "@/app/(workspace)/skolarly/lesson-lab/lessons/lesson-form";
import { LessonResult } from "@/app/(workspace)/skolarly/lesson-lab/lessons/lesson-result";

import { useLessonExplainer } from "@/hooks/useLessonExplainer";

export default function LessonsPage() {
  const lesson = useLessonExplainer();

  return (
    <WorkspaceShell size="lg">
      {!lesson.result ? (
        <LessonForm {...lesson} />
      ) : (
        <LessonResult result={lesson.result} />
      )}
    </WorkspaceShell>
  );
}
