import { motion } from 'framer-motion';
import { Instagram, Star, CheckCircle } from 'lucide-react';
import { fadeInUp, staggerContainer, scaleIn } from '@/lib/animations';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  instagram: string;
  followers: string;
  avatar: string;
  quote: string;
  rating: number;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sophie van der Berg',
    role: 'Food & Lifestyle Influencer',
    instagram: '@sophiefoodie',
    followers: '127K',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    quote: 'ReelByte connects me with Amsterdam\'s most authentic dining experiences. The restaurants are hand-picked, and the collaboration process is seamless. I\'ve built lasting partnerships here.',
    rating: 5,
    verified: true,
  },
  {
    id: 2,
    name: 'Restaurant De Kas',
    role: 'Fine Dining Restaurant',
    instagram: '@restaurantdekas',
    followers: '89K',
    avatar: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=400&fit=crop',
    quote: 'The quality of influencers on ReelByte is unmatched. Every collaboration drives genuine engagement and brings the right clientele to our establishment. The ROI speaks for itself.',
    rating: 5,
    verified: true,
  },
  {
    id: 3,
    name: 'Lars Jansen',
    role: 'Travel & Culinary Creator',
    instagram: '@larseats',
    followers: '243K',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    quote: 'As a creator, I appreciate the transparency and professionalism. ReelByte vets both sides carefully, ensuring authentic partnerships that resonate with my audience.',
    rating: 5,
    verified: true,
  },
  {
    id: 4,
    name: 'Café Loetje',
    role: 'Modern Dutch Cuisine',
    instagram: '@cafeloetje',
    followers: '52K',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop',
    quote: 'ReelByte helped us reach a younger, Instagram-savvy audience we couldn\'t access through traditional marketing. The platform is intuitive and the results are measurable.',
    rating: 5,
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 sm:py-24 md:py-28 lg:py-36 bg-brand-cream">
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
            Trusted by Amsterdam's Best
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            variants={fadeInUp}
          >
            Hear from influencers and restaurants who've transformed their reach through ReelByte
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="card-premium p-6 sm:p-8 md:p-10 hover-lift"
              variants={scaleIn}
            >
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-brand-gold/20"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-display font-bold text-brand-navy">
                      {testimonial.name}
                    </h3>
                    {testimonial.verified && (
                      <CheckCircle className="w-5 h-5 text-brand-gold fill-brand-gold" />
                    )}
                  </div>
                  <p className="text-sm text-brand-charcoal/60 font-accent mb-1">
                    {testimonial.role}
                  </p>
                  <div className="flex items-center gap-3 text-sm">
                    <a
                      href={`https://instagram.com/${testimonial.instagram.substring(1)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-brand-navy hover:text-brand-gold transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>{testimonial.instagram}</span>
                    </a>
                    <span className="text-brand-charcoal/40">•</span>
                    <span className="text-brand-charcoal/60">{testimonial.followers}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-brand-gold fill-brand-gold" />
                ))}
              </div>

              <blockquote className="text-brand-charcoal/80 leading-relaxed italic">
                "{testimonial.quote}"
              </blockquote>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={fadeInUp}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-brand-gold/20 shadow-sm">
            <Star className="w-5 h-5 text-brand-gold fill-brand-gold" />
            <span className="font-accent font-semibold text-brand-navy">4.9/5</span>
            <span className="text-brand-charcoal/60">from 200+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
