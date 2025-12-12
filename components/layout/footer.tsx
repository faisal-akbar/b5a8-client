import { ArrowRight, Award, Facebook, Heart, Instagram, Linkedin, MapPin, Shield, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-gradient-to-b from-muted/30 via-background to-background">
      {/* Decorative background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/2 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand section - takes 2 columns on large screens */}
          <div className="space-y-6 lg:col-span-2">
            <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-lg bg-primary/40 opacity-0 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-lg">
                  <MapPin className="h-5 w-5 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground">LocalGuide</span>
            </Link>
            
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Connect with local experts and discover authentic travel experiences around the world. Your adventure starts here.
            </p>
            
            {/* Newsletter section */}
            {/* <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Stay Updated</h4>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    type="email" 
                    placeholder="Enter your email"
                    className="h-10 border-border/50 bg-background/50 pl-10 text-sm transition-all duration-300 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
                  />
                </div>
                <Button size="sm" className="h-10 gap-2 shadow-lg transition-all duration-300 hover:scale-105">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div> */}
            
            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { icon: Facebook, gradient: "from-blue-500 to-blue-600" },
                { icon: Twitter, gradient: "from-sky-500 to-blue-500" },
                { icon: Instagram, gradient: "from-pink-500 to-purple-500" },
                { icon: Linkedin, gradient: "from-blue-600 to-blue-700" }
              ].map(({ icon: Icon, gradient }, index) => (
                <a
                  key={index}
                  href="#"
                  className="group/social relative flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg"
                >
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover/social:opacity-100`} />
                  <Icon className="relative h-5 w-5 transition-colors duration-300 group-hover/social:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* For Travelers */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-tight text-foreground">For Travelers</h3>
            <ul className="space-y-3.5 text-sm">
              {[
                { href: "/explore", text: "Explore Tours" },
                { href: "/how-it-works", text: "How It Works" },
                { href: "/destinations", text: "Popular Destinations" },
                { href: "/reviews", text: "Reviews" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-2 text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Guides */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-tight text-foreground">For Guides</h3>
            <ul className="space-y-3.5 text-sm">
              {[
                { href: "/become-guide", text: "Become a Guide" },
                { href: "/guide-resources", text: "Resources" },
                { href: "/guide-community", text: "Community" },
                { href: "/guide-faq", text: "FAQ" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-2 text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-sm font-bold tracking-tight text-foreground">Company</h3>
            <ul className="space-y-3.5 text-sm">
              {[
                { href: "/about", text: "About Us" },
                { href: "/contact", text: "Contact" },
                { href: "/privacy", text: "Privacy Policy" },
                { href: "/terms", text: "Terms of Service" }
              ].map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center gap-2 text-muted-foreground transition-all duration-300 hover:text-primary hover:translate-x-1"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100" />
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust badges section */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-border/50 pt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">Secure Payments</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">Verified Guides</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Heart className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium">24/7 Support</span>
          </div>
        </div>

        {/* Copyright section */}
        <div className="mt-8 border-t border-border/50 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LocalGuide. All rights reserved. Made with{" "}
            <Heart className="inline h-4 w-4 text-red-500" /> for travelers worldwide.
          </p>
        </div>
      </div>
    </footer>
  )
}
