import Link from "next/link"
import { MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <MapPin className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">LocalGuide</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Connect with local experts and discover authentic travel experiences around the world.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Linkedin className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-tight text-foreground">For Travelers</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/explore" className="text-muted-foreground transition-colors hover:text-foreground">
                  Explore Tours
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-muted-foreground transition-colors hover:text-foreground">
                  Popular Destinations
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="text-muted-foreground transition-colors hover:text-foreground">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-tight text-foreground">For Guides</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/become-guide" className="text-muted-foreground transition-colors hover:text-foreground">
                  Become a Guide
                </Link>
              </li>
              <li>
                <Link href="/guide-resources" className="text-muted-foreground transition-colors hover:text-foreground">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/guide-community" className="text-muted-foreground transition-colors hover:text-foreground">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/guide-faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-semibold tracking-tight text-foreground">Company</h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} LocalGuide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
