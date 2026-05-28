"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  const verificationStarted = useRef(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (verificationStarted.current) return;

      if (!token) {
        setStatus("error");
        return;
      }

      verificationStarted.current = true;

      try {
        const response = await axiosInstance.get(
          `/api/auth/v1/verify-email?token=${token}`,
        );

        if (response.data.code === 200) {
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border bg-card/80 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col items-center px-8 py-10 text-center">

          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="mb-6 rounded-full bg-primary/10 p-5">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Verifying your email
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Please wait while we verify your account.
              </p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="mb-6 rounded-full bg-green-500/10 p-5">
                <CheckCircle2 className="h-14 w-14 text-green-500" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Email verified
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Your email has been successfully verified.
                You can now continue using all features
                of Skolarly.
              </p>

              <Link href="/login" className="mt-8 w-full">
                <Button className="h-11 w-full rounded-xl text-sm font-medium">
                  Continue to Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          )}

          {/* Error */}
          {status === "error" && (
            <>
              <div className="mb-6 rounded-full bg-red-500/10 p-5">
                <XCircle className="h-14 w-14 text-red-500" />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Verification failed
              </h1>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                This verification link is invalid or has
                already expired. Please request a new
                verification email and try again.
              </p>

              <div className="mt-8 flex w-full flex-col gap-3">
                <Button
                  variant="outline"
                  className="h-11 rounded-xl"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

                <Link href="/login" className="w-full">
                  <Button
                    variant="ghost"
                    className="h-11 w-full rounded-xl"
                  >
                    Back to Login
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}