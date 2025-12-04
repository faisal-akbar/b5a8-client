"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { MapPin, User, Compass } from "lucide-react"
import { useState, useActionState, useEffect } from "react"
import { registerUser } from "@/services/auth/registerUser"
import { sendOTP } from "@/services/otp/otp.service"
import { toast } from "sonner"
import InputFieldError from "@/components/shared/InputFieldError"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function RegisterForm() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<"tourist" | "guide">("tourist")
  const [state, formAction, isPending] = useActionState(registerUser, null)
  const [isSendingOTP, setIsSendingOTP] = useState(false)

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message)
    }

    // If registration successful, send OTP
    if (state && state.success && state.data) {
      const sendOTPToUser = async () => {
        setIsSendingOTP(true)
        try {
          const result = await sendOTP({
            email: state.data.email,
            name: state.data.name,
          })

          if (result.success) {
            toast.success("Registration successful! Please verify your email.")
            // Redirect to OTP verification page
            router.push(`/verify-otp?email=${encodeURIComponent(state.data.email)}&name=${encodeURIComponent(state.data.name)}`)
          } else {
            toast.error(result.message || "Failed to send verification code")
          }
        } catch (error) {
          toast.error("Failed to send verification code. Please try again.")
        } finally {
          setIsSendingOTP(false)
        }
      }

      sendOTPToUser()
    }
  }, [state, router])

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
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10"
          >
            <MapPin className="h-7 w-7 text-primary" />
          </motion.div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create Your Account</CardTitle>
          <CardDescription className="text-base">Join LocalGuide and start your adventure</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">I want to</Label>
              <RadioGroup
                value={userRole}
                onValueChange={(value) => setUserRole(value as "tourist" | "guide")}
                className="grid grid-cols-2 gap-4"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <RadioGroupItem value="tourist" id="tourist" className="peer sr-only" />
                  <Label
                    htmlFor="tourist"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-sm"
                  >
                    <User className="mb-3 h-8 w-8 text-primary" />
                    <span className="font-semibold text-lg">Explore as Tourist</span>
                    <span className="mt-1 text-center text-xs text-muted-foreground">Book tours and experiences</span>
                  </Label>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <RadioGroupItem value="guide" id="guide" className="peer sr-only" />
                  <Label
                    htmlFor="guide"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-6 transition-all hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:shadow-sm"
                  >
                    <Compass className="mb-3 h-8 w-8 text-primary" />
                    <span className="font-semibold text-lg">Become a Guide</span>
                    <span className="mt-1 text-center text-xs text-muted-foreground">Share your city & earn</span>
                  </Label>
                </motion.div>
              </RadioGroup>
              <input type="hidden" name="role" value={userRole} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                className="h-11 bg-muted/30 focus:bg-background"
              />
              <InputFieldError field="name" state={state} />
            </div>

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                required
                className="h-11 bg-muted/30 focus:bg-background"
              />
              <p className="text-xs text-muted-foreground">Must be at least 8 characters with uppercase, number, and special character</p>
              <InputFieldError field="password" state={state} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                required
                className="h-11 bg-muted/30 focus:bg-background"
              />
              <InputFieldError field="confirmPassword" state={state} />
            </div>

            {userRole === "guide" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <Label htmlFor="dailyRate">Daily Rate (USD)</Label>
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  placeholder="e.g., 100"
                  required
                  min="1"
                  className="h-11 bg-muted/30 focus:bg-background"
                />
                <p className="text-xs text-muted-foreground">How much you charge per day</p>
                <InputFieldError field="dailyRate" state={state} />
              </motion.div>
            )}



            <Button type="submit" className="w-full h-11 text-base shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" size="lg" disabled={isPending || isSendingOTP}>
              {isSendingOTP ? "Sending verification code..." : isPending ? "Creating Account..." : "Create Account"}
            </Button>
          </form>




          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline hover:text-primary/80 transition-colors">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

