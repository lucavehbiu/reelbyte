import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, UserPlus, Loader2, Briefcase, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegister } from '@/hooks/use-auth';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  role: z.enum(['creator', 'client'], {
    required_error: 'Please select an account type',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'creator' | 'client' | null>(null);
  const register = useRegister();

  const {
    register: registerField,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleRoleSelect = (role: 'creator' | 'client') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    register.mutate(registerData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        {/* Glass morphism card */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-center text-white">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-200">
              Join ReelByte and start your journey
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {register.isError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
                >
                  {register.error instanceof Error
                    ? register.error.message
                    : 'Registration failed. Please try again.'}
                </motion.div>
              )}

              {/* Account Type Selection */}
              <div className="space-y-2">
                <Label className="text-white">I am a...</Label>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    onClick={() => handleRoleSelect('creator')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'creator'
                        ? 'bg-purple-600/30 border-purple-400'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Video className="w-8 h-8 mx-auto mb-2 text-white" />
                    <p className="text-white font-semibold">Creator</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Sell video editing services
                    </p>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => handleRoleSelect('client')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'client'
                        ? 'bg-blue-600/30 border-blue-400'
                        : 'bg-white/5 border-white/20 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Briefcase className="w-8 h-8 mx-auto mb-2 text-white" />
                    <p className="text-white font-semibold">Client</p>
                    <p className="text-xs text-gray-300 mt-1">
                      Hire video editors
                    </p>
                  </motion.button>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-300">{errors.role.message}</p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    {...registerField('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-300">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                    {...registerField('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-300">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                  {...registerField('username')}
                />
                {errors.username && (
                  <p className="text-sm text-red-300">{errors.username.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                  {...registerField('email')}
                />
                {errors.email && (
                  <p className="text-sm text-red-300">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-10"
                    {...registerField('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-300">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 pr-10"
                    {...registerField('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-300">{errors.confirmPassword.message}</p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                disabled={register.isPending}
              >
                {register.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-gray-200">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-300 hover:text-blue-200 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
