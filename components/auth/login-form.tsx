"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { loginUser } from "@/services/auth/loginUser"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import InputFieldError from "@/components/shared/InputFieldError"
import { motion } from "framer-motion"

interface LoginFormProps {
  redirect?: string | null
}

export default function LoginForm({ redirect }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginUser, null)

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card className="border-slate-200 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
          >
            <MapPin className="h-7 w-7 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back</CardTitle>
          <CardDescription className="text-base">Sign in to your account to continue your journey</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-4">
            {redirect && <input type="hidden" name="redirect" value={redirect} />}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                className="h-11 bg-muted/30 focus:bg-background"
              />
              <InputFieldError field="email" state={state} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="h-11 bg-muted/30 focus:bg-background"
              />
              <InputFieldError field="password" state={state} />
            </div>

            <Button type="submit" className="w-full h-11 text-base shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" size="lg" disabled={isPending}>
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

