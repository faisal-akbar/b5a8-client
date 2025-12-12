import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, DollarSign, Sparkles, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export function CtaSection() {
    const highlights = [
        { icon: TrendingUp, text: "Flexible Schedule" },
        { icon: Users, text: "Global Reach" },
        { icon: DollarSign, text: "Earn More" },
    ]

    return (
        <section className="relative overflow-hidden py-16 lg:py-24">
            {/* Background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
            
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-primary via-primary to-primary/90 shadow-2xl transition-all duration-500 hover:shadow-primary/25">
                    {/* Animated background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Animated gradient orbs */}
                        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse" />
                        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                        
                        {/* Animated grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
                    </div>

                    <CardContent className="relative p-12 text-center lg:p-16">
                        {/* Floating badge */}
                        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white shadow-lg backdrop-blur-sm ring-1 ring-white/30">
                            <Sparkles className="h-4 w-4" />
                            <span>Start Your Journey</span>
                        </div>
                        
                        <div className="relative z-10">
                            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                                Share Your City,
                                <br />
                                <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                    Earn Money
                                </span>
                            </h2>
                            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-primary-foreground/90 leading-relaxed lg:text-xl">
                                Join thousands of local guides earning income by sharing their passion and knowledge. Turn your
                                expertise into a thriving business.
                            </p>
                            
                            {/* Feature highlights */}
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                                {highlights.map((highlight, index) => (
                                    <div 
                                        key={index}
                                        className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm ring-1 ring-white/20 transition-all duration-300 hover:bg-white/20 hover:scale-105"
                                    >
                                        <highlight.icon className="h-4 w-4" />
                                        <span>{highlight.text}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* CTA Buttons */}
                            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                                <Link href="/become-guide">
                                    <Button 
                                        size="lg" 
                                        variant="secondary" 
                                        className="group/btn relative h-14 px-8 text-base font-semibold shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-white/25"
                                    >
                                        {/* Button glow effect */}
                                        <div className="absolute inset-0 rounded-md bg-white opacity-0 blur-xl transition-opacity duration-300 group-hover/btn:opacity-30" />
                                        
                                        <span className="relative flex items-center gap-2">
                                            Become a Guide
                                            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                                        </span>
                                    </Button>
                                </Link>
                            </div>
                            
                            {/* Trust indicators */}
                            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/80">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                                    <span>Free to join</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                                    <span>No hidden fees</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-300" />
                                    <span>24/7 support</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
