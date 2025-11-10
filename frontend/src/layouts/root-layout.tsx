import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-cream overflow-x-hidden">
      <header className="glass-premium border-b border-brand-navy/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 hover-lift flex-shrink-0">
              <img
                src="/logo.png"
                alt="ReelByte"
                className="h-16 w-16 sm:h-20 sm:w-20 transition-transform hover:scale-105"
              />
              <span className="text-xl sm:text-2xl font-display font-bold text-brand-navy hidden xs:block">
                ReelByte
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              <Link to="/browse" className="text-brand-charcoal hover:text-brand-navy transition-colors font-medium">
                Browse Opportunities
              </Link>
              <Link to="/restaurants" className="text-brand-charcoal hover:text-brand-navy transition-colors font-medium">
                For Restaurants
              </Link>
              <Link to="/how-it-works" className="text-brand-charcoal hover:text-brand-navy transition-colors font-medium">
                How It Works
              </Link>
            </nav>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link to="/login">
                <Button variant="outline" size="sm" className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-xs sm:text-sm px-3 sm:px-4">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="btn-gold shadow-gold-glow text-xs sm:text-sm px-3 sm:px-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-brand-navy text-white mt-auto">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/logo.png" alt="ReelByte" className="h-10 w-10 brightness-0 invert" />
                <span className="text-xl font-display font-bold">ReelByte</span>
              </div>
              <p className="text-brand-cream/80 text-sm">
                Amsterdam's premier platform connecting influencers with the city's finest restaurants.
              </p>
            </div>

            <div>
              <h3 className="font-accent font-semibold mb-4">For Influencers</h3>
              <ul className="space-y-2 text-sm text-brand-cream/80">
                <li><Link to="/browse" className="hover:text-brand-gold transition-colors">Find Restaurants</Link></li>
                <li><Link to="/how-it-works" className="hover:text-brand-gold transition-colors">How It Works</Link></li>
                <li><Link to="/pricing" className="hover:text-brand-gold transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-accent font-semibold mb-4">For Restaurants</h3>
              <ul className="space-y-2 text-sm text-brand-cream/80">
                <li><Link to="/post-opportunity" className="hover:text-brand-gold transition-colors">Post Opportunity</Link></li>
                <li><Link to="/success-stories" className="hover:text-brand-gold transition-colors">Success Stories</Link></li>
                <li><Link to="/resources" className="hover:text-brand-gold transition-colors">Resources</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-accent font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-brand-cream/80">
                <li><Link to="/about" className="hover:text-brand-gold transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-brand-gold transition-colors">Contact</Link></li>
                <li><Link to="/terms" className="hover:text-brand-gold transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-brand-gold transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-brand-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-brand-cream/60">
              &copy; {new Date().getFullYear()} ReelByte. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-brand-cream/60">
              <span>Made with care in Amsterdam</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
