import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Instagram, TrendingUp, Award, MapPin, Users, Star } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { badge, fadeInUp, staggerContainer, staggerFast, scaleIn, slideInLeft, slideInRight, buttonHover, cardHover } from '@/lib/animations';
import ParticleBackground from '@/components/home/ParticleBackground';
import CountUp from '@/components/home/CountUp';
import Testimonials from '@/components/home/Testimonials';
import PlatformPreview from '@/components/home/PlatformPreview';
import FAQ from '@/components/home/FAQ';

export default function Home() {
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

  return (
    <div className="bg-brand-cream">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-navy opacity-5"></div>
        <ParticleBackground />
        <div className="container mx-auto px-6 py-32 md:py-48 lg:py-56 relative">
          <motion.div
            className="max-w-5xl mx-auto text-center space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-gold/10 rounded-full border border-brand-gold/20 mb-4"
              variants={badge}
            >
              <MapPin className="w-4 h-4 text-brand-gold" />
              <span className="text-sm font-accent text-brand-navy tracking-wide">Amsterdam's Premier Platform</span>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold tracking-[-0.02em] text-brand-navy leading-[1.1]"
              style={{textShadow: '0 2px 20px rgba(26, 47, 75, 0.15)'}}
              variants={fadeInUp}
            >
              Where Influencers Meet
              <span className="block text-gradient-gold mt-2 sm:mt-3">
                Amsterdam's Finest
              </span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-brand-charcoal/80 max-w-3xl mx-auto leading-[1.75] px-4 sm:px-0"
              variants={fadeInUp}
            >
              Connect authentic Instagram influencers with the city's most exceptional restaurants.
              Create compelling content that drives real engagement.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-6 w-full sm:w-auto px-4 sm:px-0"
              variants={fadeInUp}
            >
              <Link to="/browse" className="w-full sm:w-auto">
                <motion.div variants={buttonHover} whileHover="hover" whileTap="tap" className="w-full">
                  <Button size="lg" className="btn-primary w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg">
                    <Instagram className="w-5 h-5 mr-2" />
                    Find Restaurants
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register" className="w-full sm:w-auto">
                <motion.div variants={buttonHover} whileHover="hover" whileTap="tap" className="w-full">
                  <Button size="lg" className="btn-gold w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    List Your Restaurant
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-brand-charcoal/70"
              variants={fadeInUp}
            >
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 sm:py-20 md:py-28 bg-white border-y border-brand-navy/10">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerFast}
          >
            <motion.div
              className="card-premium p-8 sm:p-10 md:p-12 text-center"
              variants={scaleIn}
              initial="rest"
              whileHover="hover"
              custom={cardHover}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-navy/10 rounded-full mb-4">
                <Instagram className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="text-4xl font-display font-bold text-brand-navy mb-2">
                <CountUp end={500} suffix="+" duration={2.5} />
              </h3>
              <p className="text-brand-charcoal/70 font-accent">Active Influencers</p>
              <p className="text-sm text-brand-charcoal/50 mt-2">Verified Instagram creators</p>
            </motion.div>

            <motion.div
              className="card-gold-accent p-8 sm:p-10 md:p-12 text-center"
              variants={scaleIn}
              initial="rest"
              whileHover="hover"
              custom={cardHover}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-gold/10 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="text-4xl font-display font-bold text-brand-navy mb-2">
                <CountUp end={150} suffix="+" duration={2.5} />
              </h3>
              <p className="text-brand-charcoal/70 font-accent">Partner Restaurants</p>
              <p className="text-sm text-brand-charcoal/50 mt-2">Amsterdam's finest dining</p>
            </motion.div>

            <motion.div
              className="card-premium p-8 sm:p-10 md:p-12 text-center"
              variants={scaleIn}
              initial="rest"
              whileHover="hover"
              custom={cardHover}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-navy/10 rounded-full mb-4">
                <Award className="w-8 h-8 text-brand-navy" />
              </div>
              <h3 className="text-4xl font-display font-bold text-brand-navy mb-2">
                <CountUp end={2} suffix="M+" duration={2.5} />
              </h3>
              <p className="text-brand-charcoal/70 font-accent">Total Reach</p>
              <p className="text-sm text-brand-charcoal/50 mt-2">Combined followers</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Platform Preview Section */}
      <PlatformPreview />

      {/* How It Works Section */}
      <section ref={howItWorksRef} className="py-20 sm:py-24 md:py-28 lg:py-36">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-navy mb-3 sm:mb-4 tracking-[-0.01em] leading-[1.2] px-4 sm:px-0">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Simple, transparent, and effective collaboration
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <motion.div
              className="relative"
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              variants={slideInLeft}
            >
              <div className="card-premium p-8 sm:p-10 md:p-12 h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-navy rounded-lg mb-6 text-white font-display font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-brand-navy mb-3 sm:mb-4">
                  Browse & Connect
                </h3>
                <p className="text-base sm:text-base text-brand-charcoal/70 leading-relaxed">
                  Restaurants post collaboration opportunities. Influencers discover authentic dining experiences that match their brand.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-brand-gold text-4xl">
                →
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              variants={scaleIn}
              transition={{ delay: 0.2 }}
            >
              <div className="card-premium p-8 sm:p-10 md:p-12 h-full">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-gold rounded-lg mb-6 text-white font-display font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-brand-navy mb-3 sm:mb-4">
                  Create Content
                </h3>
                <p className="text-base sm:text-base text-brand-charcoal/70 leading-relaxed">
                  Enjoy the experience and create genuine, engaging content. Share stunning Instagram Reels and posts with your audience.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-brand-gold text-4xl">
                →
              </div>
            </motion.div>

            <motion.div
              className="card-premium p-8 sm:p-10 md:p-12 h-full"
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              variants={slideInRight}
              transition={{ delay: 0.4 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-navy rounded-lg mb-6 text-white font-display font-bold text-xl">
                3
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-brand-navy mb-3 sm:mb-4">
                Get Rewarded
              </h3>
              <p className="text-base sm:text-base text-brand-charcoal/70 leading-relaxed">
                Receive compensation and build lasting partnerships with Amsterdam's culinary scene. Track your success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 sm:py-24 md:py-28 lg:py-40 gradient-navy">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center text-white space-y-6 sm:space-y-8"
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-[-0.01em] leading-[1.2] px-4 sm:px-0"
              variants={fadeInUp}
            >
              Ready to Amplify Your Reach?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
              variants={fadeInUp}
            >
              Join Amsterdam's most sophisticated influencer-restaurant platform today.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-4 w-full sm:w-auto px-4 sm:px-0"
              variants={fadeInUp}
            >
              <Link to="/register?type=influencer" className="w-full sm:w-auto">
                <motion.div variants={buttonHover} whileHover="hover" whileTap="tap" className="w-full">
                  <Button size="lg" className="btn-gold w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg">
                    Join as Influencer
                  </Button>
                </motion.div>
              </Link>
              <Link to="/register?type=restaurant" className="w-full sm:w-auto">
                <motion.div variants={buttonHover} whileHover="hover" whileTap="tap" className="w-full">
                  <Button
                    size="lg"
                    className="bg-white text-brand-navy hover:bg-brand-cream w-full sm:w-auto px-8 sm:px-12 py-6 sm:py-7 text-base sm:text-lg font-semibold"
                  >
                    Join as Restaurant
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
