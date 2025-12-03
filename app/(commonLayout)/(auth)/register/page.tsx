"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { MapPin, User, Compass } from "lucide-react"
import { useState, useActionState, useEffect } from "react"
import { registerUser } from "@/services/auth/registerUser"
import { toast } from "sonner"
import InputFieldError from "@/components/shared/InputFieldError"

export default function RegisterPage() {
  const [userRole, setUserRole] = useState<"tourist" | "guide">("tourist")
  const [state, formAction, isPending] = useActionState(registerUser, null)

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message)
    }
  }, [state])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-1 items-center justify-center bg-muted/30 px-4 py-12">
        <Card className="w-full max-w-2xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription>Join LocalGuide and start your adventure</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-3">
                <Label>I want to</Label>
                <RadioGroup
                  value={userRole}
                  onValueChange={(value) => setUserRole(value as "tourist" | "guide")}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="tourist" id="tourist" className="peer sr-only" />
                    <Label
                      htmlFor="tourist"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <User className="mb-3 h-8 w-8" />
                      <span className="font-semibold">Explore as Tourist</span>
                      <span className="mt-1 text-xs text-muted-foreground">Book tours and experiences</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="guide" id="guide" className="peer sr-only" />
                    <Label
                      htmlFor="guide"
                      className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                    >
                      <Compass className="mb-3 h-8 w-8" />
                      <span className="font-semibold">Become a Guide</span>
                      <span className="mt-1 text-xs text-muted-foreground">Share your city & earn</span>
                    </Label>
                  </div>
                </RadioGroup>
                <input type="hidden" name="role" value={userRole} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" type="text" placeholder="John Doe" required />
                <InputFieldError field="name" state={state} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                <InputFieldError field="email" state={state} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a strong password" required />
                <p className="text-xs text-muted-foreground">Must be at least 8 characters with uppercase, number, and special character</p>
                <InputFieldError field="password" state={state} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter your password" required />
                <InputFieldError field="confirmPassword" state={state} />
              </div>

              {userRole === "guide" && (
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate (USD)</Label>
                  <Input id="dailyRate" name="dailyRate" type="number" placeholder="e.g., 100" required min="1" />
                  <p className="text-xs text-muted-foreground">How much you charge per day</p>
                  <InputFieldError field="dailyRate" state={state} />
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-0.5 rounded border-input" required />
                  <span className="text-muted-foreground">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" type="button">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" type="button">
                <svg className="mr-2 h-4 w-4 fill-foreground" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                GitHub
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
