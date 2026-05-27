"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowLeft, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { studyNavItems, getPageMeta } from "@/lib/study-nav";
import ProtectedRoute from "@/components/ProtectedRoute";


export default function SkolarlyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pageMeta = getPageMeta(pathname);
  const isChat = pathname === "/skolarly/tutor";

  return (
    <div className="min-h-screen bg-muted/30">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-70 flex-col border-r border-sidebar-border bg-sidebar shadow-xl shadow-black/5 transition-transform duration-200 ease-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-4">
          <Link href="/" className="flex min-w-0 flex-1 items-center gap-2.5">
            <Image
              src="/images/skolarly-logo.png"
              alt="Skolarly"
              width={36}
              height={36}
              className="size-9 shrink-0 object-contain"
            />
            <span className="truncate text-lg font-bold text-primary">
              Skolarly
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 text-sidebar-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="size-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <ArrowLeft className="size-4 shrink-0" />
            Back to home
          </Link>

          <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Study tools
          </p>

          {studyNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/skolarly" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
                )}
              >
                {isActive && (
                  <span className="absolute top-1/2 left-0 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                )}
                <item.icon
                  className={cn(
                    "size-5 shrink-0 transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/skolarly/tutor"
            onClick={() => setSidebarOpen(false)}
            className="block rounded-xl bg-linear-to-br from-primary/15 via-primary/5 to-secondary/10 p-4 ring-1 ring-primary/15 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="size-4 text-primary" />
              Need help studying?
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Ask the AI tutor anything
            </p>
          </Link>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col lg:pl-70">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-3 border-b border-border/80 bg-background/90 px-4 backdrop-blur-md sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>

          <div className="min-w-0 flex-1 lg:ml-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {pageMeta.title}
            </p>
            <p className="hidden truncate text-xs text-muted-foreground sm:block">
              {pageMeta.description}
            </p>
          </div>

          <Link href="/skolarly/tutor" className="hidden sm:block">
            <Button size="sm" variant="outline" className="gap-1.5">
              <Sparkles className="size-3.5" />
              Ask tutor
            </Button>
          </Link>
        </header>

        <main
          className={cn(
            "flex flex-1 flex-col",
            isChat ? "min-h-0 overflow-hidden" : "",
          )}
        >
          <ProtectedRoute>{children}</ProtectedRoute>
        </main>
      </div>
    </div>
  );
}
