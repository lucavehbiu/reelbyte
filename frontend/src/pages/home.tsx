import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Instagram, TrendingUp, Award, MapPin, Users, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-brand-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-navy opacity-5"></div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/20 mb-4">
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span className="text-sm font-accent text-brand-navy">Amsterdam's Premier Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight text-brand-navy leading-tight">
              Where Influencers Meet
              <span className="block text-gradient-gold mt-2">
                Amsterdam's Finest
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-brand-charcoal/80 max-w-3xl mx-auto leading-relaxed">
              Connect authentic Instagram influencers with the city's most exceptional restaurants.
              Create compelling content that drives real engagement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Link to="/browse">
                <Button size="lg" className="btn-primary px-10 py-6 text-lg">
                  <Instagram className="w-5 h-5 mr-2" />
                  Find Restaurants
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="btn-gold px-10 py-6 text-lg">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  List Your Restaurant
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-brand-charcoal/70">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
                <span>Verified Influencers</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-gold fill-brand-gold" />
                <span>Premium Restaurants</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-gold fill-brand-gold" />
                <span>Real Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-brand-navy/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="card-premium p-8 text-center hover-lift">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-navy/10 rounded-full mb-4">
                <Instagram className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="text-4xl font-display font-bold text-brand-navy mb-2">500+</h3>
              <p className="text-brand-charcoal/70 font-accent">Active Influencers</p>
              <p className="text-sm text-brand-charcoal/50 mt-2">Verified Instagram creators</p>
            </div>

            <div className="card-gold-accent p-8 text-center hover-lift">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold/10 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="text-4xl font-display font-bold text-brand-navy mb-2">150+</h3>
              <p className="text-brand-charcoal/70 font-accent">Partner Restaurants</p>
              <p className="text-sm text-brand-charcoal/50 mt-2">Amsterdam's finest dining</p>
            </div>

            <div className="card-premium p-8 text-center hover-lift">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-navy/10 rounded-full mb-4">
                <Award className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="text-4xl font-display font-bold text-brand-navy mb-2">2M+</h3>
              <p className="text-brand-charcoal/70 font-accent">Total Reach</p>
              <p className="text-sm text-brand-charcoal/50 mt-2">Combined followers</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-navy mb-4">
              How It Works
            </h2>
            <p className="text-xl text-brand-charcoal/70 max-w-2xl mx-auto">
              Simple, transparent, and effective collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="relative">
              <div className="card-premium p-8 h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-navy rounded-lg mb-6 text-white font-display font-bold text-xl">
                  1
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-navy mb-4">
                  Browse & Connect
                </h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Restaurants post collaboration opportunities. Influencers discover authentic dining experiences that match their brand.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-brand-gold text-4xl">
                →
              </div>
            </div>

            <div className="relative">
              <div className="card-premium p-8 h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-gold rounded-lg mb-6 text-white font-display font-bold text-xl">
                  2
                </div>
                <h3 className="text-2xl font-display font-bold text-brand-navy mb-4">
                  Create Content
                </h3>
                <p className="text-brand-charcoal/70 leading-relaxed">
                  Enjoy the experience and create genuine, engaging content. Share stunning Instagram Reels and posts with your audience.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-brand-gold text-4xl">
                →
              </div>
            </div>

            <div className="card-premium p-8 h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-navy rounded-lg mb-6 text-white font-display font-bold text-xl">
                3
              </div>
              <h3 className="text-2xl font-display font-bold text-brand-navy mb-4">
                Get Rewarded
              </h3>
              <p className="text-brand-charcoal/70 leading-relaxed">
                Receive compensation and build lasting partnerships with Amsterdam's culinary scene. Track your success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-navy">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              Ready to Amplify Your Reach?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join Amsterdam's most sophisticated influencer-restaurant platform today.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/register?type=influencer">
                <Button size="lg" className="btn-gold px-10 py-6 text-lg">
                  Join as Influencer
                </Button>
              </Link>
              <Link to="/register?type=restaurant">
                <Button
                  size="lg"
                  className="bg-white text-brand-navy hover:bg-brand-cream px-10 py-6 text-lg font-semibold"
                >
                  Join as Restaurant
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
