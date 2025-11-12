import { Outlet, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/ui/bottom-nav';
import { useState } from 'react';

export default function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/browse', label: 'Browse Opportunities' },
    { to: '/restaurants', label: 'For Restaurants' },
    { to: '/how-it-works', label: 'How It Works' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-brand-cream overflow-x-hidden">
      <header className="glass-premium border-b border-brand-navy/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 hover-lift flex-shrink-0 group"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="relative h-14 w-14 sm:h-20 sm:w-20 flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="ReelByte"
                  className="absolute inset-0 h-full w-full scale-[1.4] transition-transform group-hover:scale-[1.45]"
                />
              </div>
              <span className="text-xl sm:text-2xl font-display font-bold text-brand-navy hidden xs:block">
                ReelByte
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-brand-charcoal hover:text-brand-navy transition-all duration-200 font-medium relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-gold transition-all duration-200 group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Link to="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-all duration-200 text-xs sm:text-sm px-3 sm:px-4"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="sm"
                  className="btn-gold shadow-gold-glow text-xs sm:text-sm px-3 sm:px-4 hover:scale-105 transition-transform duration-200"
                >
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg hover:bg-brand-navy/10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-navy/20"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`block w-6 h-0.5 bg-brand-navy transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-brand-navy transition-all duration-300 ${
                  mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-brand-navy transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setMobileMenuOpen(false)}
          style={{ top: '90px' }}
        />

        {/* Mobile Menu Drawer */}
        <div
          className={`fixed right-0 top-[90px] bottom-0 w-80 max-w-[85vw] bg-white border-l border-brand-navy/10 shadow-2xl transition-transform duration-300 ease-in-out md:hidden overflow-y-auto ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <nav className="flex flex-col p-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-brand-charcoal hover:text-brand-navy hover:bg-brand-navy/5 transition-all duration-200 font-medium py-3 px-4 rounded-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="p-6 border-t border-brand-navy/10 space-y-3">
            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button
                variant="outline"
                className="w-full border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block">
              <Button className="w-full btn-gold shadow-gold-glow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>

      <BottomNav />

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
