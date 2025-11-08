import { motion } from 'framer-motion';
import { Check, Clock, RefreshCw, Zap, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import type { GigPackage } from '@/types';
import { useState } from 'react';

interface PackageSelectorProps {
  packages: GigPackage[];
  onSelectPackage: (packageType: 'basic' | 'standard' | 'premium') => void;
  className?: string;
}

const PACKAGE_CONFIG = {
  basic: {
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/30',
    label: 'Basic',
  },
  standard: {
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/30',
    label: 'Standard',
    popular: true,
  },
  premium: {
    icon: Crown,
    gradient: 'from-amber-500 to-orange-500',
    bgGradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/30',
    label: 'Premium',
  },
};

export function PackageSelector({ packages, onSelectPackage, className }: PackageSelectorProps) {
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleSelectPackage = (packageType: 'basic' | 'standard' | 'premium') => {
    setSelectedPackage(packageType);
    onSelectPackage(packageType);
  };

  return (
    <div className={className}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Package</h2>
        <p className="text-muted-foreground">
          Select the perfect plan for your project needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const config = PACKAGE_CONFIG[pkg.type];
          const Icon = config.icon;
          const isHovered = hoveredPackage === pkg.type;
          const isSelected = selectedPackage === pkg.type;

          return (
            <motion.div
              key={pkg.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: pkg.type === 'basic' ? 0 : pkg.type === 'standard' ? 0.1 : 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
              onHoverStart={() => setHoveredPackage(pkg.type)}
              onHoverEnd={() => setHoveredPackage(null)}
              className="relative"
            >
              <Card
                className={`relative overflow-hidden border-2 transition-all duration-300 ${
                  isSelected
                    ? `${config.borderColor} shadow-2xl`
                    : isHovered
                    ? config.borderColor
                    : 'border-border'
                }`}
              >
                {/* Popular Badge */}
                {config.popular && (
                  <div className="absolute top-0 right-0 left-0 h-8 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}

                <CardHeader className={config.popular ? 'pt-12' : 'pt-6'}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${config.bgGradient} border ${config.borderColor}`}>
                      <Icon className={`h-6 w-6 bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                    </div>
                    <Badge
                      variant="outline"
                      className={`uppercase text-xs font-bold ${config.borderColor}`}
                    >
                      {config.label}
                    </Badge>
                  </div>

                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>

                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-4xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                        {formatCurrency(pkg.price)}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Package Details */}
                  <div className="space-y-3 pb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>{pkg.deliveryTime}</strong> day{pkg.deliveryTime !== 1 ? 's' : ''} delivery
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <RefreshCw className="h-4 w-4 text-muted-foreground" />
                      <span>
                        <strong>{pkg.revisions === -1 ? 'Unlimited' : pkg.revisions}</strong> revision{pkg.revisions !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Features List */}
                  <div className="space-y-2 min-h-[180px]">
                    {pkg.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-start gap-2"
                      >
                        <div className={`mt-0.5 p-1 rounded-full bg-gradient-to-br ${config.bgGradient}`}>
                          <Check className={`h-3 w-3 bg-gradient-to-r ${config.gradient} bg-clip-text`} style={{ color: 'currentColor' }} />
                        </div>
                        <span className="text-sm flex-1">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Select Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="pt-4"
                  >
                    <Button
                      onClick={() => handleSelectPackage(pkg.type)}
                      className={`w-full bg-gradient-to-r ${config.gradient} hover:opacity-90 text-white font-semibold shadow-lg transition-all ${
                        isSelected ? 'ring-2 ring-offset-2 ring-primary' : ''
                      }`}
                      size="lg"
                    >
                      {isSelected ? 'Selected' : 'Select Package'}
                    </Button>
                  </motion.div>
                </CardContent>

                {/* Animated background effect */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.05 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${config.gradient} pointer-events-none`}
                  />
                )}
              </Card>

              {/* Glow effect */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 bg-gradient-to-r ${config.gradient} blur-2xl -z-10 rounded-xl`}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// Compact version for comparison table
export function PackageComparison({ packages }: { packages: GigPackage[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4 font-semibold">Feature</th>
            {packages.map((pkg) => (
              <th key={pkg.type} className="text-center p-4 font-semibold capitalize">
                {pkg.type}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="p-4 text-muted-foreground">Price</td>
            {packages.map((pkg) => (
              <td key={pkg.type} className="text-center p-4 font-bold">
                {formatCurrency(pkg.price)}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 text-muted-foreground">Delivery Time</td>
            {packages.map((pkg) => (
              <td key={pkg.type} className="text-center p-4">
                {pkg.deliveryTime} day{pkg.deliveryTime !== 1 ? 's' : ''}
              </td>
            ))}
          </tr>
          <tr className="border-b">
            <td className="p-4 text-muted-foreground">Revisions</td>
            {packages.map((pkg) => (
              <td key={pkg.type} className="text-center p-4">
                {pkg.revisions === -1 ? 'Unlimited' : pkg.revisions}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
