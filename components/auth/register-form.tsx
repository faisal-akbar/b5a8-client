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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { registerUser } from "@/services/auth/registerUser";
import { registerValidationZodSchema } from "@/zod/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ArrowRight, Compass, DollarSign, Lock, Mail, MapPin, User } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

type RegisterFormData = z.infer<typeof registerValidationZodSchema>;

export default function RegisterForm() {
  const [userRole, setUserRole] = useState<"TOURIST" | "GUIDE">("TOURIST");
  const [state, formAction, isPending] = useActionState(registerUser, null);
  const [, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerValidationZodSchema),
    defaultValues: {
      role: "TOURIST",
    },
  });

  const watchRole = watch("role");

  const onSubmit = (data: RegisterFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("role", data.role);

    if (data.role === "GUIDE" && data.dailyRate) {
      formData.append("dailyRate", data.dailyRate.toString());
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }

    // If registration successful, show success message
    // The registerUser service will handle login and redirect automatically
    if (state && state.success) {
      toast.success("Registration successful! Logging you in...");
    }
  }, [state]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
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
            Create Your Account
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground">
            Join LocalGuide and start your adventure
          </CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">I want to</Label>
              <RadioGroup
                value={watchRole}
                onValueChange={(value) => {
                  setValue("role", value as "TOURIST" | "GUIDE");
                  setUserRole(value as "TOURIST" | "GUIDE");
                }}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RadioGroupItem
                    value="TOURIST"
                    id="tourist"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="tourist"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-primary/10 peer-data-[state=checked]:to-primary/5 peer-data-[state=checked]:shadow-xl peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary/20"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 blur-lg transition-opacity duration-300 peer-data-[state=checked]:opacity-50" />
                      <User className="relative mb-3 h-10 w-10 text-primary" />
                    </div>
                    <span className="font-bold text-lg">
                      Explore as Tourist
                    </span>
                    <span className="mt-1 text-center text-xs text-muted-foreground">
                      Book tours and experiences
                    </span>
                  </Label>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RadioGroupItem
                    value="GUIDE"
                    id="guide"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="guide"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-gradient-to-br peer-data-[state=checked]:from-primary/10 peer-data-[state=checked]:to-primary/5 peer-data-[state=checked]:shadow-xl peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary/20"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 blur-lg transition-opacity duration-300 peer-data-[state=checked]:opacity-50" />
                      <Compass className="relative mb-3 h-10 w-10 text-primary" />
                    </div>
                    <span className="font-bold text-lg">
                      Become a Guide
                    </span>
                    <span className="mt-1 text-center text-xs text-muted-foreground">
                      Share your city & earn
                    </span>
                  </Label>
                </motion.div>
              </RadioGroup>
              {errors.role && (
                <p className="text-sm text-destructive">
                  {errors.role.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-12 border-2 border-border/50 bg-background pl-11 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("name")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

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
              <Label htmlFor="password" className="font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  className="h-12 border-2 border-border/50 bg-background pl-11 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("password")}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, number, and
                special character
              </p>
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  className="h-12 border-2 border-border/50 bg-background pl-11 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  {...register("confirmPassword")}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {watchRole === "GUIDE" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="dailyRate" className="font-medium">Daily Rate (USD)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="dailyRate"
                    type="number"
                    placeholder="e.g., 100"
                    className="h-12 border-2 border-border/50 bg-background pl-11 transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                    {...register("dailyRate", { valueAsNumber: true })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  How much you charge per day
                </p>
                {errors.dailyRate && (
                  <p className="text-sm text-destructive">
                    {errors.dailyRate.message}
                  </p>
                )}
              </motion.div>
            )}

            <Button
              type="submit"
              className="group relative w-full h-12 text-base font-semibold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5"
              size="lg"
              disabled={isPending}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-md bg-primary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-75" />
              <span className="relative flex items-center justify-center gap-2">
                {isPending ? "Creating Account..." : (
                  <>
                    Create Account
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-primary underline-offset-4 transition-all duration-300 hover:underline hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
