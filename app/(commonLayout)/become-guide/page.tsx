"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { DollarSign, Users, Calendar, TrendingUp, CheckCircle2 } from "lucide-react"
import { motion } from "framer-motion"

export default function BecomeGuidePage() {
  return (
    <div className="flex min-h-screen flex-col">

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20 lg:py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">Start Earning Today</Badge>
                <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Share Your City, <span className="text-primary">Earn Money</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-relaxed">
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
                  <Button size="lg" className="h-12 px-8 shadow-lg transition-transform hover:scale-105">
                    Start Your Journey
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 bg-transparent border-primary/20 hover:bg-primary/5">
                  Learn More
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why Become a Guide?</h2>
              <p className="mt-4 text-lg text-muted-foreground">The benefits of sharing your passion</p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: DollarSign,
                  title: "Earn Extra Income",
                  description: "Set your own rates and earn money doing what you love. Top guides earn $500+ per week.",
                },
                {
                  icon: Calendar,
                  title: "Flexible Schedule",
                  description:
                    "Work when you want. Choose your availability and accept bookings that fit your schedule.",
                },
                {
                  icon: Users,
                  title: "Meet New People",
                  description: "Connect with travelers from around the world and share your local culture and stories.",
                },
                {
                  icon: TrendingUp,
                  title: "Grow Your Business",
                  description:
                    "Build your reputation, earn great reviews, and grow a loyal following of return customers.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-2 border-transparent bg-muted/30 transition-all duration-300 hover:border-primary/20 hover:bg-background hover:shadow-lg">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <benefit.icon className="h-7 w-7" />
                      </div>
                      <h3 className="mt-4 font-semibold text-foreground">{benefit.title}</h3>
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
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Getting Started is Easy</h2>
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
                  <Card className="h-full border-2 transition-all hover:border-primary/50 hover:shadow-xl">
                    <CardContent className="p-8">
                      <div className="absolute -top-6 left-8">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground shadow-lg ring-4 ring-background">
                          {step.step}
                        </div>
                      </div>
                      <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <step.icon className="h-8 w-8" />
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
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
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Guide Requirements</h2>
              <p className="mt-4 text-lg text-muted-foreground">What you need to become a LocalGuide</p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
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
                  className="flex items-start gap-3 rounded-lg border border-transparent p-3 transition-colors hover:border-primary/10 hover:bg-primary/5"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">{requirement}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-primary to-primary/80 py-16 lg:py-24 text-primary-foreground">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to Start Your Guiding Journey?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-primary-foreground/90 leading-relaxed">
              Join our community of passionate local guides and start earning money by sharing your city's hidden gems.
            </p>
            <div className="mt-8">
              <Link href="/register">
                <Button size="lg" variant="secondary" className="h-12 px-8 shadow-lg transition-transform hover:scale-105">
                  Create Your Guide Account
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
