import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
}

export default function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 25 particles with random positions and timings
    const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      size: Math.random() * 4 + 2, // Random size (2-6px)
      duration: Math.random() * 10 + 15, // Random duration (15-25s)
      delay: Math.random() * 5, // Random delay (0-5s)
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute bottom-0 rounded-full bg-brand-gold/30 blur-sm"
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `particle-float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
            boxShadow: '0 0 10px rgba(178, 142, 77, 0.5)',
          }}
        />
      ))}
    </div>
  );
}
