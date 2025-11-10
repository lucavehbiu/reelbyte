import { motion } from 'framer-motion';
import { Instagram, Heart, TrendingUp } from 'lucide-react';

export default function MobileHeroCard() {
  return (
    <motion.div
      className="lg:hidden w-full max-w-sm mx-auto mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      {/* Instagram-style Card */}
      <div className="relative bg-white rounded-2xl shadow-premium-xl overflow-hidden">
        {/* Gradient Background Image */}
        <div className="h-48 bg-gradient-to-br from-brand-gold/20 via-brand-navy/10 to-brand-copper/20 relative overflow-hidden">
          {/* Animated Gradient Overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-brand-gold/30 to-brand-navy/30"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Food/Restaurant Icon Pattern */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Instagram className="w-20 h-20 text-brand-gold/30" />
          </div>

          {/* Floating Hearts Animation */}
          <motion.div
            className="absolute bottom-4 left-4"
            animate={{
              y: [-5, -15, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className="w-6 h-6 text-red-400 fill-red-400" />
          </motion.div>

          <motion.div
            className="absolute top-6 right-6"
            animate={{
              y: [-3, -10, -3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <TrendingUp className="w-6 h-6 text-brand-gold" />
          </motion.div>
        </div>

        {/* Card Content */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-brand-copper flex items-center justify-center">
              <Instagram className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-brand-navy text-sm">@reelbyte_amsterdam</p>
              <p className="text-xs text-brand-charcoal/60">Amsterdam, Netherlands</p>
            </div>
          </div>

          <p className="text-sm text-brand-charcoal/80 mb-4">
            ✨ Connecting influencers with Amsterdam's finest restaurants. Join the movement!
          </p>

          <div className="flex items-center justify-between text-xs text-brand-charcoal/60">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span className="font-semibold">2.4K</span>
            </div>
            <span>500+ Influencers • 150+ Restaurants</span>
          </div>
        </div>

        {/* Shimmer Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
        />
      </div>
    </motion.div>
  );
}
