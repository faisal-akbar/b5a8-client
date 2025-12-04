"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MapPin, ArrowLeft, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { verifyOTP, sendOTP } from "@/services/otp/otp.service"
import { useRouter, useSearchParams } from "next/navigation"

export default function VerifyOTPPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const name = searchParams.get("name") || "User"

    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isVerifying, setIsVerifying] = useState(false)
    const [isResending, setIsResending] = useState(false)
    const [countdown, setCountdown] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [countdown])

    // Redirect if no email
    useEffect(() => {
        if (!email) {
            toast.error("Email is required for verification")
            router.push("/login")
        }
    }, [email, router])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(0, 1)
        }

        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text").slice(0, 6)
        if (!/^\d+$/.test(pastedData)) return

        const newOtp = [...otp]
        for (let i = 0; i < pastedData.length; i++) {
            newOtp[i] = pastedData[i]
        }
        setOtp(newOtp)

        // Focus last filled input or next empty
        const nextIndex = Math.min(pastedData.length, 5)
        inputRefs.current[nextIndex]?.focus()
    }

    const handleVerify = async () => {
        const otpCode = otp.join("")

        if (otpCode.length !== 6) {
            toast.error("Please enter all 6 digits")
            return
        }

        if (!email) {
            toast.error("Email is required")
            return
        }

        setIsVerifying(true)

        try {
            const result = await verifyOTP({ email, otp: otpCode })

            if (result.success) {
                toast.success("Email verified successfully!")
                // Redirect to login
                setTimeout(() => {
                    router.push("/login?verified=true")
                }, 1000)
            } else {
                toast.error(result.message || "Invalid OTP. Please try again.")
                setOtp(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
            }
        } catch (error) {
            toast.error("Verification failed. Please try again.")
        } finally {
            setIsVerifying(false)
        }
    }

    const handleResend = async () => {
        if (!canResend || !email) return

        setIsResending(true)

        try {
            const result = await sendOTP({ email, name })

            if (result.success) {
                toast.success("OTP sent successfully! Check your email.")
                setCountdown(60)
                setCanResend(false)
                setOtp(["", "", "", "", "", ""])
                inputRefs.current[0]?.focus()
            } else {
                toast.error(result.message || "Failed to resend OTP")
            }
        } catch (error) {
            toast.error("Failed to resend OTP. Please try again.")
        } finally {
            setIsResending(false)
        }
    }

    if (!email) {
        return null
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
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
                            <Mail className="h-7 w-7 text-primary" />
                        </motion.div>
                        <CardTitle className="text-2xl font-bold tracking-tight">Verify Your Email</CardTitle>
                        <CardDescription className="text-base">
                            We've sent a 6-digit code to<br />
                            <span className="font-medium text-foreground">{email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* OTP Input */}
                        <div className="space-y-4">
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => {
                                            inputRefs.current[index] = el
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="h-14 w-14 text-center text-2xl font-bold"
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <Button
                                onClick={handleVerify}
                                className="w-full h-11 text-base shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                                size="lg"
                                disabled={isVerifying || otp.join("").length !== 6}
                            >
                                {isVerifying ? "Verifying..." : "Verify Email"}
                            </Button>
                        </div>

                        {/* Resend OTP */}
                        <div className="text-center space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the code?
                            </p>
                            {canResend ? (
                                <Button
                                    variant="link"
                                    onClick={handleResend}
                                    disabled={isResending}
                                    className="text-primary font-medium"
                                >
                                    {isResending ? "Sending..." : "Resend Code"}
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Resend in <span className="font-medium text-foreground">{countdown}s</span>
                                </p>
                            )}
                        </div>

                        {/* Back to Login */}
                        <div className="pt-4 border-t">
                            <Button 
                                variant="ghost" 
                                className="w-full"
                                onClick={() => router.push("/login")}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Login
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    )
}
