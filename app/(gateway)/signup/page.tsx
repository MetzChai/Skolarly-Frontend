"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  BrainCircuit,
  MessageSquare,
} from "lucide-react";
import axiosInstance from "@/lib/axios";
import { signupSchema, type SignupFormData } from "@/lib/schemas/auth";

export default function SignupPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");
    try {
      await axiosInstance.post("/api/auth/v1/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Signup failed. Please try again.";
      setServerError(errorMessage);
      console.log("[Error]", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-linear-to-br from-primary/8 via-transparent to-secondary/10" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 py-8 sm:px-6">
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/images/skolarly-logo.png"
              alt="Skolarly"
              width={36}
              height={36}
              className="size-9 object-contain"
            />
            <span className="text-lg font-bold text-primary">Skolarly</span>
          </Link>
        </header>

        <main className="flex flex-1 flex-col justify-center py-12">
          {/* CARD */}
          <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xl shadow-primary/5">
            <div className="flex flex-col">
              {/* BRAND HEADER */}
              <div className="relative overflow-hidden bg-linear-to-br from-primary/15 via-primary/5 to-secondary/10 px-6 pt-8 pb-6">
                <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
                <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />

                <div className="relative flex flex-col items-center text-center">
                  <Image
                    src="/images/skolarly-logo.png"
                    alt="Skolarly"
                    width={56}
                    height={56}
                    className="h-14 w-14 object-contain drop-shadow-sm"
                  />

                  <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
                    Join Skolarly
                  </h2>

                  <p className="mt-1.5 max-w-xs text-sm text-muted-foreground">
                    Start learning smarter with AI-powered tools
                  </p>
                </div>
              </div>

              {/* FORM */}
              <div className="px-6 pt-6 pb-4">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* SERVER ERROR */}
                  {serverError && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                      {serverError}
                    </div>
                  )}

                  {/* NAME */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Alex Johnson"
                        className={`pl-9 ${errors.name ? "border-red-500" : ""}`}
                        autoComplete="name"
                        {...register("name")}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@school.edu"
                        className={`pl-9 ${errors.email ? "border-red-500" : ""}`}
                        autoComplete="email"
                        {...register("email")}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* PASSWORD */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="At least 8 characters (uppercase, lowercase, number)"
                        className={`pl-9 pr-10 ${errors.password ? "border-red-500" : ""}`}
                        autoComplete="new-password"
                        {...register("password")}
                      />

                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-500">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        className={`pl-9 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                        autoComplete="new-password"
                        {...register("confirmPassword")}
                      />

                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  {/* SUBMIT */}
                  <Button
                    type="submit"
                    className="w-full gap-2"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner />
                        Creating account…
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* FEATURE LIST */}
                <ul className="mt-5 space-y-2 rounded-lg border border-border/80 bg-muted/40 px-4 py-3">
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BookOpen className="size-3.5 text-primary" />
                    AI lesson explanations
                  </li>
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <BrainCircuit className="size-3.5 text-primary" />
                    Personalized quizzes
                  </li>
                  <li className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MessageSquare className="size-3.5 text-primary" />
                    24/7 AI tutor chat
                  </li>
                </ul>

                {/* SWITCH */}
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER (OUTSIDE CARD — FIXED) */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to use Skolarly for your personal learning.
          </p>
        </main>
      </div>
    </div>
  );
}
