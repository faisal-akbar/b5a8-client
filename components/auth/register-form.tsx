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
import { Compass, MapPin, User } from "lucide-react";
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
      <Card className="border-slate-200 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
          >
            <MapPin className="h-7 w-7 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-base">
            Join LocalGuide and start your adventure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-sm"
                  >
                    <User className="mb-3 h-8 w-8 text-primary" />
                    <span className="font-semibold text-lg">
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
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-sm"
                  >
                    <Compass className="mb-3 h-8 w-8 text-primary" />
                    <span className="font-semibold text-lg">
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
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                className="h-11 bg-muted/30 focus:bg-background"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="name@example.com"
                className="h-11 bg-muted/30 focus:bg-background"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="h-11 bg-muted/30 focus:bg-background"
                {...register("password")}
              />
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
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                className="h-11 bg-muted/30 focus:bg-background"
                {...register("confirmPassword")}
              />
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
                <Label htmlFor="dailyRate">Daily Rate (USD)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  placeholder="e.g., 100"
                  className="h-11 bg-muted/30 focus:bg-background"
                  {...register("dailyRate", { valueAsNumber: true })}
                />
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
              className="w-full h-11 text-base shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              size="lg"
              disabled={isPending}
            >
              {isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
