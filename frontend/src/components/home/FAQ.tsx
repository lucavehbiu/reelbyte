import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: 'influencer' | 'restaurant' | 'general';
}

const faqs: FAQItem[] = [
  {
    id: 1,
    question: 'How does ReelByte verify influencers?',
    answer: 'We verify all influencers through Instagram authentication and review engagement rates, content quality, and audience demographics. Only authentic creators with genuine followings are approved to join our platform.',
    category: 'general',
  },
  {
    id: 2,
    question: 'What are the requirements to join as an influencer?',
    answer: 'We look for Instagram creators with at least 10,000 followers, a consistent engagement rate of 3%+, and high-quality content focused on food, lifestyle, or Amsterdam culture. Your profile should demonstrate authentic audience engagement.',
    category: 'influencer',
  },
  {
    id: 3,
    question: 'How much do influencers earn per collaboration?',
    answer: 'Compensation varies based on follower count, engagement rate, and deliverables. Typical collaborations range from €200-€1,500, with premium opportunities for top-tier creators. You can view specific compensation in each gig listing.',
    category: 'influencer',
  },
  {
    id: 4,
    question: 'What types of restaurants join ReelByte?',
    answer: 'We partner exclusively with high-quality establishments in Amsterdam - from Michelin-starred fine dining to authentic local gems. Every restaurant is vetted to ensure they meet our standards for quality, ambiance, and culinary excellence.',
    category: 'restaurant',
  },
  {
    id: 5,
    question: 'What kind of ROI can restaurants expect?',
    answer: 'Our restaurant partners typically see 3-5x ROI through increased reservations, brand awareness, and social media exposure. Average collaborations reach 50,000-500,000 viewers, with high engagement rates from targeted Amsterdam audiences.',
    category: 'restaurant',
  },
  {
    id: 6,
    question: 'How does the payment process work?',
    answer: 'Payments are held in escrow when a collaboration is confirmed. After the influencer delivers the agreed content and it\'s approved by the restaurant, payment is released within 5-7 business days. This protects both parties and ensures quality.',
    category: 'general',
  },
  {
    id: 7,
    question: 'Can I cancel a collaboration after accepting?',
    answer: 'Cancellations are handled case-by-case. We encourage both parties to communicate early if issues arise. Repeated cancellations may affect your platform standing. Our support team is available to mediate any conflicts.',
    category: 'general',
  },
  {
    id: 8,
    question: 'How do I create a successful collaboration?',
    answer: 'Success comes from clear communication, authentic content, and meeting deadlines. Influencers should create genuine, engaging content that resonates with their audience. Restaurants should provide a memorable experience and be flexible with content creation.',
    category: 'general',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 sm:py-24 md:py-28 lg:py-36 bg-white">
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
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-lg sm:text-xl text-brand-charcoal/70 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
            variants={fadeInUp}
          >
            Everything you need to know about ReelByte
          </motion.p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto space-y-3 sm:space-y-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {faqs.map((faq) => (
            <motion.div
              key={faq.id}
              className="card-premium overflow-hidden"
              variants={fadeInUp}
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-5 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-left hover:bg-brand-cream/50 transition-colors"
                aria-expanded={openId === faq.id}
              >
                <span className="text-base sm:text-lg font-display font-semibold text-brand-navy pr-6 sm:pr-8">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openId === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-6 h-6 text-brand-gold" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: 'auto',
                      opacity: 1,
                      transition: {
                        height: {
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1]
                        },
                        opacity: {
                          duration: 0.25,
                          delay: 0.1
                        }
                      }
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                      transition: {
                        height: {
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1]
                        },
                        opacity: {
                          duration: 0.2
                        }
                      }
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="px-5 sm:px-8 pb-5 sm:pb-6 pt-2">
                      <p className="text-sm sm:text-base text-brand-charcoal/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
          <p className="text-brand-charcoal/70 mb-4">
            Still have questions?
          </p>
          <a
            href="mailto:support@reelbyte.com"
            className="inline-block px-8 py-4 bg-brand-navy text-white rounded-lg font-accent font-semibold hover:bg-brand-navy-600 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform duration-300"
          >
            Contact Support
          </a>
        </motion.div>
      </div>
    </section>
  );
}
