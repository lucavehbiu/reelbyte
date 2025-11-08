import { motion } from 'framer-motion';
import { CheckCircle, Shield, Zap, BarChart3, MessageSquare, CreditCard } from 'lucide-react';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';

const features = [
  {
    icon: Shield,
    title: 'Verified Profiles',
    description: 'All users are thoroughly vetted and verified for authenticity',
  },
  {
    icon: Zap,
    title: 'Instant Matching',
    description: 'Smart algorithm connects you with perfect collaboration partners',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance, reach, and ROI in real-time',
  },
  {
    icon: MessageSquare,
    title: 'Direct Messaging',
    description: 'Seamless communication between influencers and restaurants',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Escrow system protects both parties throughout collaboration',
  },
  {
    icon: CheckCircle,
    title: 'Quality Guaranteed',
    description: 'Review system ensures high standards on both sides',
  },
];

export default function PlatformPreview() {
  return (
    <section className="py-20 sm:py-24 md:py-28 lg:py-36 bg-gradient-to-br from-brand-cream via-white to-brand-cream overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brand-navy mb-3 sm:mb-4 tracking-[-0.01em] leading-[1.2] px-4 sm:px-0"
            variants={fadeInUp}
          >
            Built for Success
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            variants={fadeInUp}
          >
            A powerful platform designed for seamless collaboration
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
          {/* Platform Mockup */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInLeft}
          >
            {/* Browser Frame */}
            <div className="relative bg-white rounded-2xl shadow-premium-xl border border-brand-navy/10 overflow-hidden">
              {/* Browser Header */}
              <div className="bg-brand-navy/5 px-4 py-3 flex items-center gap-2 border-b border-brand-navy/10">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4 bg-white rounded-md px-3 py-1.5 text-xs text-brand-charcoal/50 font-mono">
                  reelbyte.com/browse
                </div>
              </div>

              {/* Platform Screenshot/Mockup */}
              <div className="aspect-[4/3] bg-gradient-to-br from-brand-navy/5 to-brand-gold/5 p-8">
                {/* Gig Cards Mockup */}
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="bg-white rounded-lg shadow-lg p-4 hover-lift">
                    <div className="aspect-video bg-gradient-to-br from-brand-navy/10 to-brand-gold/10 rounded-lg mb-3"></div>
                    <div className="h-3 bg-brand-navy/20 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-full mb-1"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-2/3"></div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-4 hover-lift">
                    <div className="aspect-video bg-gradient-to-br from-brand-gold/10 to-brand-navy/10 rounded-lg mb-3"></div>
                    <div className="h-3 bg-brand-navy/20 rounded w-2/3 mb-2"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-full mb-1"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-3/4"></div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-4 hover-lift">
                    <div className="aspect-video bg-gradient-to-br from-brand-navy/10 to-brand-gold/10 rounded-lg mb-3"></div>
                    <div className="h-3 bg-brand-navy/20 rounded w-full mb-2"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-2/3 mb-1"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-full"></div>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg p-4 hover-lift">
                    <div className="aspect-video bg-gradient-to-br from-brand-gold/10 to-brand-navy/10 rounded-lg mb-3"></div>
                    <div className="h-3 bg-brand-navy/20 rounded w-3/4 mb-2"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-full mb-1"></div>
                    <div className="h-2 bg-brand-charcoal/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div
              className="absolute -top-6 -right-6 bg-brand-gold text-white px-6 py-3 rounded-full shadow-gold-glow font-display font-bold text-sm"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -10 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Award-Winning UX
            </motion.div>
          </motion.div>

          {/* Features List */}
          <motion.div
            className="order-1 lg:order-2"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideInRight}
          >
            <div className="space-y-5 sm:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 sm:gap-4"
                  variants={fadeInUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-display font-bold text-brand-navy mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-brand-charcoal/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-8 sm:mt-10"
              variants={fadeInUp}
            >
              <a
                href="/browse"
                className="inline-block w-full sm:w-auto text-center px-8 sm:px-10 py-4 sm:py-5 bg-brand-navy text-white rounded-lg font-accent font-semibold hover:bg-brand-navy-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Explore the Platform
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
