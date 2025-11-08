import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForgotPassword } from '@/hooks/use-auth';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
    });
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
        className="w-full max-w-md relative z-10"
      >
        {/* Glass morphism card */}
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-2xl">
          {!isSuccess ? (
            <>
              <CardHeader className="space-y-1">
                <CardTitle className="text-3xl font-bold text-center text-white">
                  Forgot Password?
                </CardTitle>
                <CardDescription className="text-center text-gray-200">
                  Enter your email and we'll send you a reset link
                </CardDescription>
              </CardHeader>

              <form onSubmit={handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  {forgotPassword.isError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-md bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
                    >
                      {forgotPassword.error instanceof Error
                        ? forgotPassword.error.message
                        : 'Failed to send reset email. Please try again.'}
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-300">{errors.email.message}</p>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                    disabled={forgotPassword.isPending}
                  >
                    {forgotPassword.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Reset Link
                      </>
                    )}
                  </Button>

                  <Link
                    to="/login"
                    className="flex items-center justify-center text-sm text-blue-300 hover:text-blue-200 transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </CardFooter>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <CardHeader className="space-y-1">
                <div className="flex justify-center mb-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  >
                    <CheckCircle className="w-16 h-16 text-green-400" />
                  </motion.div>
                </div>
                <CardTitle className="text-3xl font-bold text-center text-white">
                  Check Your Email
                </CardTitle>
                <CardDescription className="text-center text-gray-200">
                  We've sent a password reset link to your email address
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-md bg-blue-500/20 border border-blue-500/50 text-blue-200 text-sm">
                  <p className="text-center">
                    If you don't see the email, check your spam folder or try again.
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Link to="/login" className="w-full">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </CardFooter>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
