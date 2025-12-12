"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from "@/services/auth/loginUser";
import { loginValidationZodSchema } from "@/zod/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

interface LoginFormProps {
  redirect?: string | null;
}

type LoginFormData = z.infer<typeof loginValidationZodSchema>;

export default function LoginForm({ redirect }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginValidationZodSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (redirect) {
      formData.append("redirect", redirect);
    }
    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl backdrop-blur-sm">
        {/* Decorative gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <CardHeader className="relative space-y-1 text-center pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/20"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-primary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50" />
            <MapPin className="relative h-8 w-8 text-primary" />
          </motion.div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Sign in to your account to continue your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="name@example.com"
                  className="h-12 border-2 border-border/50 bg-background pl-11 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-medium">Password</Label>
                {/* <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link> */}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="h-12 border-2 border-border/50 bg-background pl-11 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="group relative w-full h-12 text-base font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              size="lg"
              disabled={isPending}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-md bg-primary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-75" />
              <span className="relative flex items-center justify-center gap-2">
                {isPending ? "Signing in..." : (
                  <>
                    Sign In
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </form>          

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary underline-offset-4 transition-all duration-300 hover:underline hover:text-primary/80"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
