"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, Award, Calendar, CheckCircle2, DollarSign, Sparkles, TrendingUp, Users } from "lucide-react"
import Link from "next/link"

export default function BecomeGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 lg:py-32">
          {/* Animated decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute right-1/4 bottom-1/3 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
          
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 gap-1.5 bg-gradient-to-r from-primary/10 to-primary/5 text-primary hover:from-primary/20 hover:to-primary/10 border-primary/20 shadow-lg">
                  <Sparkles className="h-3.5 w-3.5" />
                  Start Earning Today
                </Badge>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl">
                  Share Your City, <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Earn Money</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed lg:text-xl">
                  Turn your local knowledge into income. Join thousands of guides earning money by showing travelers the
                  authentic side of their city.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
              >
                <Link href="/register">
                  <Button size="lg" className="group h-14 gap-2 px-8 shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    Start Your Journey
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 bg-background/50 border-2 border-primary/20 backdrop-blur-sm transition-all duration-300 hover:bg-primary/5 hover:border-primary/30 hover:scale-105">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <Badge className="mb-4 gap-1.5 bg-primary/10 text-primary">
                <Award className="h-3.5 w-3.5" />
                Benefits
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Why Become a Guide?</h2>
              <p className="mt-4 text-lg text-muted-foreground">The benefits of sharing your passion</p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: DollarSign,
                  title: "Earn Extra Income",
                  description: "Set your own rates and earn money doing what you love. Top guides earn $500+ per week.",
                  gradient: "from-green-500 to-emerald-500"
                },
                {
                  icon: Calendar,
                  title: "Flexible Schedule",
                  description:
                    "Work when you want. Choose your availability and accept bookings that fit your schedule.",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: Users,
                  title: "Meet New People",
                  description: "Connect with travelers from around the world and share your local culture and stories.",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: TrendingUp,
                  title: "Grow Your Business",
                  description:
                    "Build your reputation, earn great reviews, and grow a loyal following of return customers.",
                  gradient: "from-orange-500 to-red-500"
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group h-full border-2 border-transparent bg-muted/30 transition-all duration-300 hover:border-primary/20 hover:bg-background hover:shadow-xl hover:-translate-y-2">
                    <CardContent className="p-6 text-center">
                      <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary transition-all duration-300 group-hover:scale-110">
                        {/* Glow effect */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${benefit.gradient} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50`} />
                        <benefit.icon className="relative h-8 w-8" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-foreground">{benefit.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="bg-muted/30 py-16 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
          <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Getting Started is Easy</h2>
              <p className="mt-4 text-lg text-muted-foreground">From signup to your first tour in 3 simple steps</p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {[
                {
                  step: "01",
                  title: "Create Your Profile",
                  description:
                    "Sign up, verify your identity, and create a compelling profile that showcases your expertise and personality.",
                  icon: Users,
                },
                {
                  step: "02",
                  title: "List Your Tours",
                  description:
                    "Create unique tour experiences, set your pricing, add photos, and describe what makes your tours special.",
                  icon: Calendar,
                },
                {
                  step: "03",
                  title: "Start Guiding",
                  description:
                    "Receive booking requests, accept tours that fit your schedule, and start earning money doing what you love.",
                  icon: CheckCircle2,
                },
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="absolute left-full top-1/2 hidden h-0.5 w-full -translate-y-1/2 lg:block">
                      <div className="h-full w-full bg-gradient-to-r from-primary/30 via-primary/10 to-transparent" />
                    </div>
                  )}
                  
                  <Card className="group h-full border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className="absolute -top-6 left-8">
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-xl font-bold text-primary-foreground shadow-xl ring-4 ring-background">
                          {/* Glow effect */}
                          <div className="absolute inset-0 rounded-full bg-primary opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-75" />
                          <span className="relative">{step.step}</span>
                        </div>
                      </div>
                      <div className="mt-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:ring-primary/20">
                        <step.icon className="h-10 w-10" />
                      </div>
                      <h3 className="mt-6 text-xl font-bold text-foreground">{step.title}</h3>
                      <p className="mt-3 text-muted-foreground leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">Guide Requirements</h2>
              <p className="mt-4 text-lg text-muted-foreground">What you need to become a LocalGuide</p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2">
              {[
                "Be at least 18 years old",
                "Live in the city you want to guide in",
                "Fluent in at least one language",
                "Passionate about your local area",
                "Pass identity verification",
                "Maintain a 4.0+ star rating",
                "Respond to bookings within 24 hours",
                "Provide authentic local experiences",
              ].map((requirement, index) => (
                <motion.div
                  key={requirement}
                  className="group flex items-start gap-3 rounded-xl border-2 border-border/50 bg-background p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">{requirement}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 py-16 lg:py-24 text-primary-foreground">
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          <div className="absolute inset-0">
            <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute left-0 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
          </div>
          
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 relative z-10">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to Start Your Guiding Journey?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/90 leading-relaxed">
              Join our community of passionate local guides and start earning money by sharing your city's hidden gems.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="group h-14 gap-2 px-8 shadow-2xl transition-all duration-300 hover:scale-105">
                  Create Your Guide Account
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
