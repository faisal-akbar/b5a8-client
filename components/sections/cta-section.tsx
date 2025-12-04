import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export function CtaSection() {
    return (
        <section className="py-16 lg:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 shadow-2xl">
                    <CardContent className="p-12 text-center relative overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                                Share Your City, Earn Money
                            </h2>
                            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/90 leading-relaxed">
                                Join thousands of local guides earning income by sharing their passion and knowledge. Turn your
                                expertise into a thriving business.
                            </p>
                            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                                <Link href="/become-guide">
                                    <Button size="lg" variant="secondary" className="h-12 px-8 shadow-lg transition-transform hover:scale-105">
                                        Become a Guide
                                        <CheckCircle2 className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/guide-info">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="h-12 border-primary-foreground/20 bg-transparent px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground backdrop-blur-sm"
                                    >
                                        Learn More
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
