import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Instagram, TrendingUp, Award, MapPin, Users, Star, Sparkles, ArrowRight, Heart, Camera, ChefHat } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import CountUp from '@/components/home/CountUp';
import Testimonials from '@/components/home/Testimonials';
import PlatformPreview from '@/components/home/PlatformPreview';
import FAQ from '@/components/home/FAQ';

// Floating Element Component
interface FloatingElementProps {
  className?: string;
  delay?: number;
  children: React.ReactNode;
}

const FloatingElement: React.FC<FloatingElementProps> = ({ className, delay = 0, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.23, 0.86, 0.39, 0.96] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default function Home() {
  const statsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.5 });

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay: i * 0.15, ease: [0.25, 0.4, 0.25, 1] },
    }),
  };

  return (
    <div className="bg-gradient-to-br from-brand-cream via-brand-cream to-brand-beige/30 overflow-x-hidden">
      {/* Hero Section - Revolut Style */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-brand-cream to-brand-copper/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-gold/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-navy/20 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Left side - Content */}
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.15, delayChildren: 0.2 },
                },
              }}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div variants={fadeUpVariants} custom={0}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/10 border border-brand-gold/20 backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-brand-gold" />
                  <span className="text-sm font-medium text-brand-navy tracking-wide">
                    Amsterdam's Premier Platform
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.div variants={fadeUpVariants} custom={1}>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
                  <span className="text-brand-navy">
                    Where Influencers Meet
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-gold via-brand-copper to-brand-gold">
                    Amsterdam's Finest
                  </span>
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={fadeUpVariants}
                custom={2}
                className="text-lg sm:text-xl text-brand-charcoal/80 max-w-xl leading-relaxed"
              >
                Connect authentic Instagram influencers with the city's most exceptional restaurants.
                Create compelling content that drives real engagement.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeUpVariants}
                custom={3}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link to="/browse">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-brand-gold via-brand-copper to-brand-navy text-white hover:shadow-2xl hover:shadow-brand-gold/50 transition-all duration-300 hover:scale-105"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Instagram className="h-5 w-5" />
                      Find Restaurants
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>

                <Link to="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full px-8 py-6 text-lg font-semibold border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white backdrop-blur-sm transition-all duration-300"
                  >
                    <TrendingUp className="h-5 w-5 mr-2" />
                    List Your Restaurant
                  </Button>
                </Link>
              </motion.div>

              {/* Mini Stats */}
              <motion.div
                variants={fadeUpVariants}
                custom={4}
                className="grid grid-cols-3 gap-6 pt-8"
              >
                <div>
                  <div className="text-3xl font-bold text-brand-navy">500+</div>
                  <div className="text-sm text-brand-charcoal/70">Influencers</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-navy">150+</div>
                  <div className="text-sm text-brand-charcoal/70">Restaurants</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-brand-navy">2M+</div>
                  <div className="text-sm text-brand-charcoal/70">Reach</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side - Floating elements */}
            <div className="relative h-[600px] lg:h-[700px]">
              {/* Central glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-brand-gold/30 via-brand-copper/30 to-brand-navy/30 rounded-full blur-3xl" />

              {/* Floating cards */}
              <FloatingElement className="absolute top-[10%] left-[5%] w-64" delay={0.2}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/30 to-brand-copper/30 rounded-3xl blur-xl" />
                  <div className="relative bg-white/90 backdrop-blur-xl border border-brand-navy/10 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-brand-copper" />
                      <div>
                        <div className="font-semibold text-brand-navy">Emma Johnson</div>
                        <div className="text-sm text-brand-charcoal/60">Food Influencer</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-brand-charcoal/70">
                      <Instagram className="h-4 w-4" />
                      <span>125K followers</span>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement className="absolute top-[35%] right-[8%] w-72" delay={0.4}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/30 to-brand-gold/30 rounded-3xl blur-xl" />
                  <div className="relative bg-white/90 backdrop-blur-xl border border-brand-navy/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="aspect-video bg-gradient-to-br from-brand-gold/20 to-brand-copper/20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
                        <Camera className="h-8 w-8 text-brand-navy" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="font-semibold text-brand-navy mb-2">Viral Content</div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-gold" />
                        <span className="text-sm text-brand-charcoal/60">+85% engagement</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement className="absolute bottom-[15%] left-[15%] w-56" delay={0.6}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-brand-copper/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-white/80 backdrop-blur-xl border border-brand-navy/10 rounded-3xl p-6 hover:border-brand-gold/50 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
                        <Star className="h-6 w-6 fill-brand-gold" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-brand-navy">4.9★</div>
                        <div className="text-sm text-brand-charcoal/60">Avg Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FloatingElement>

              <FloatingElement className="absolute bottom-[25%] right-[5%] w-64" delay={0.8}>
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/30 to-brand-gold/30 rounded-3xl blur-xl" />
                  <div className="relative bg-white/90 backdrop-blur-xl border border-brand-navy/10 rounded-3xl p-6 shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium text-brand-charcoal/70">Partnership ROI</span>
                      <TrendingUp className="h-5 w-5 text-brand-gold" />
                    </div>
                    <div className="text-3xl font-bold text-brand-navy mb-2">250%</div>
                    <div className="h-2 bg-brand-cream rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "80%" }}
                        transition={{ duration: 1.5, delay: 1 }}
                        className="h-full bg-gradient-to-r from-brand-gold to-brand-copper"
                      />
                    </div>
                  </div>
                </div>
              </FloatingElement>

              {/* Decorative circles */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[20%] right-[20%] w-32 h-32 rounded-full border-2 border-brand-gold/30"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[30%] left-[25%] w-24 h-24 rounded-full border-2 border-brand-navy/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 sm:py-24 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="border border-brand-navy/10 rounded-3xl bg-white p-8 sm:p-12"
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { icon: Instagram, value: 500, suffix: '+', label: 'Active Influencers', desc: 'Verified Instagram creators' },
                { icon: ChefHat, value: 150, suffix: '+', label: 'Partner Restaurants', desc: "Amsterdam's finest dining" },
                { icon: Award, value: 2, suffix: 'M+', label: 'Total Reach', desc: 'Combined followers' }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-brand-copper/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gradient-to-br from-white to-brand-cream/30 border border-brand-navy/10 rounded-3xl p-8 text-center hover:border-brand-gold/50 transition-all duration-300 shadow-lg">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-gold/10 to-brand-copper/10 rounded-full mb-4">
                      <stat.icon className="w-8 h-8 text-brand-navy" />
                    </div>
                    <h3 className="text-4xl font-bold text-brand-navy mb-2">
                      <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                    </h3>
                    <p className="text-brand-charcoal/70 font-semibold mb-2">{stat.label}</p>
                    <p className="text-sm text-brand-charcoal/50">{stat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Platform Preview Section */}
      <PlatformPreview />

      {/* How It Works Section - Bento Grid Style */}
      <section ref={howItWorksRef} className="py-20 sm:py-24 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="border border-brand-navy/10 rounded-3xl bg-white p-8 sm:p-12">
            <motion.div
              className="text-center mb-12"
              initial="hidden"
              animate={howItWorksInView ? "visible" : "hidden"}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-brand-navy mb-4">
                How It Works
              </h2>
              <p className="text-xl text-brand-charcoal/70 max-w-2xl mx-auto">
                Simple, transparent, and effective collaboration
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  num: 1,
                  title: 'Browse & Connect',
                  desc: 'Restaurants post collaboration opportunities. Influencers discover authentic dining experiences that match their brand.',
                  icon: Users,
                  color: 'from-brand-navy to-brand-navy/80'
                },
                {
                  num: 2,
                  title: 'Create Content',
                  desc: 'Enjoy the experience and create genuine, engaging content. Share stunning Instagram Reels and posts with your audience.',
                  icon: Camera,
                  color: 'from-brand-gold to-brand-copper'
                },
                {
                  num: 3,
                  title: 'Get Rewarded',
                  desc: 'Receive compensation and build lasting partnerships with Amsterdam\'s culinary scene. Track your success.',
                  icon: TrendingUp,
                  color: 'from-brand-copper to-brand-gold'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-brand-navy/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative bg-gradient-to-br from-white to-brand-cream/30 border border-brand-navy/10 rounded-3xl p-8 h-full hover:border-brand-gold/50 transition-all duration-300 shadow-lg">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${step.color} rounded-2xl mb-6 text-white font-bold text-xl shadow-lg`}>
                      {step.num}
                    </div>
                    <div className="mb-4">
                      <step.icon className="h-8 w-8 text-brand-navy opacity-20" />
                    </div>
                    <h3 className="text-2xl font-bold text-brand-navy mb-4">
                      {step.title}
                    </h3>
                    <p className="text-brand-charcoal/70 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 sm:py-24 md:py-28">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            className="border border-brand-gold/20 rounded-3xl bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy/90 p-12 sm:p-16 text-center overflow-hidden relative"
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } }}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-copper/10 rounded-full blur-3xl" />

            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              >
                Ready to Amplify Your Reach?
              </motion.h2>
              <motion.p
                className="text-xl text-white/90 max-w-2xl mx-auto"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              >
                Join Amsterdam's most sophisticated influencer-restaurant platform today.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
              >
                <Link to="/register?type=influencer">
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg font-semibold bg-gradient-to-r from-brand-gold via-brand-copper to-brand-gold text-white hover:shadow-2xl hover:shadow-brand-gold/50 transition-all duration-300 hover:scale-105"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Join as Influencer
                  </Button>
                </Link>
                <Link to="/register?type=restaurant">
                  <Button
                    size="lg"
                    className="rounded-full px-8 py-6 text-lg font-semibold bg-white text-brand-navy hover:bg-brand-cream transition-all duration-300"
                  >
                    <ChefHat className="h-5 w-5 mr-2" />
                    Join as Restaurant
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
