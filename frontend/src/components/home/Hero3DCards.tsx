import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Instagram, Heart, MessageCircle, Bookmark } from 'lucide-react';

interface Card3D {
  id: number;
  image: string;
  username: string;
  likes: string;
  location: string;
  rotation: number;
  x: number;
  y: number;
  delay: number;
}

const sampleCards: Card3D[] = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=500&fit=crop',
    username: '@sophiefoodie',
    likes: '12.4K',
    location: 'Restaurant De Kas',
    rotation: -12,
    x: -120,
    y: -80,
    delay: 0,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&h=500&fit=crop',
    username: '@larseats',
    likes: '18.2K',
    location: 'Café Loetje',
    rotation: 8,
    x: 50,
    y: 20,
    delay: 0.15,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=500&fit=crop',
    username: '@amsterdamfood',
    likes: '9.8K',
    location: 'Amsterdam Canal',
    rotation: -5,
    x: -30,
    y: 100,
    delay: 0.3,
  },
];

export default function Hero3DCards() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none hidden lg:block">
      <div className="relative w-full h-full flex items-center justify-end pr-12">
        {sampleCards.map((card) => (
          <FloatingCard
            key={card.id}
            card={card}
            mouseX={mousePosition.x}
            mouseY={mousePosition.y}
          />
        ))}
      </div>
    </div>
  );
}

interface FloatingCardProps {
  card: Card3D;
  mouseX: number;
  mouseY: number;
}

function FloatingCard({ card, mouseX, mouseY }: FloatingCardProps) {
  const springConfig = { stiffness: 150, damping: 20 };

  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    rotateX.set(mouseY * 10 + card.rotation);
    rotateY.set(mouseX * 10 + card.rotation);
    x.set(mouseX * 20 + card.x);
    y.set(mouseY * 20 + card.y);
  }, [mouseX, mouseY, card, rotateX, rotateY, x, y]);

  return (
    <motion.div
      className="absolute"
      style={{
        x,
        y,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{
        opacity: 0,
        scale: 0.8,
        x: card.x,
        y: card.y,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        x: card.x,
        y: card.y,
      }}
      transition={{
        delay: card.delay,
        duration: 0.8,
        type: 'spring',
        stiffness: 100,
      }}
    >
      {/* Instagram Card */}
      <motion.div
        className="bg-white rounded-2xl shadow-premium-xl overflow-hidden"
        style={{
          width: '280px',
          transformStyle: 'preserve-3d',
          transform: 'translateZ(50px)',
        }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.2 }
        }}
      >
        {/* Card Header */}
        <div className="p-3 flex items-center gap-2 border-b border-gray-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-brand-copper flex items-center justify-center">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-brand-navy">{card.username}</p>
            <p className="text-xs text-brand-charcoal/60">{card.location}</p>
          </div>
        </div>

        {/* Card Image */}
        <div className="aspect-[4/5] bg-gradient-to-br from-brand-navy/5 to-brand-gold/5 relative overflow-hidden">
          <img
            src={card.image}
            alt={card.location}
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        </div>

        {/* Card Footer */}
        <div className="p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="w-5 h-5 text-red-500 fill-red-500" />
              <MessageCircle className="w-5 h-5 text-brand-navy" />
            </div>
            <Bookmark className="w-5 h-5 text-brand-navy" />
          </div>
          <p className="text-xs font-semibold text-brand-navy">
            {card.likes} likes
          </p>
        </div>

        {/* 3D Depth Effect */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(178, 142, 77, 0.1) 0%, transparent 50%, rgba(26, 47, 75, 0.1) 100%)',
            transform: 'translateZ(10px)',
          }}
        />
      </motion.div>

      {/* Floating Glow */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-br from-brand-gold/20 to-brand-navy/20 rounded-3xl blur-2xl -z-10"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}
