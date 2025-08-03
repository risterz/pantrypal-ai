'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, ChefHat, Utensils, Sparkles, Heart, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Text3D, Center } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// 3D Animated Sphere Component
function AnimatedSphere({ position, color, speed = 1 }: { position: [number, number, number], color: string, speed?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed) * 0.2;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.3;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.1;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} position={position} args={[0.5, 32, 32]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

// Floating Food Images Component
function FloatingFoodImages() {
  return (
    <>
      {[
        { src: "/images/food1.png", position: { left: "10%", top: "15%" }, delay: 0 },
        { src: "/images/food2.png", position: { left: "80%", top: "25%" }, delay: 1 },
        { src: "/images/food3.png", position: { left: "15%", top: "70%" }, delay: 2 },
        { src: "/images/food4.png", position: { left: "75%", top: "65%" }, delay: 3 },
        { src: "/images/food5.png", position: { left: "50%", top: "10%" }, delay: 4 },
      ].map((food, index) => (
        <motion.div
          key={index}
          className="absolute w-40 h-40 opacity-50 pointer-events-none"
          style={{
            left: food.position.left,
            top: food.position.top,
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + food.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: food.delay * 0.5,
          }}
        >
          <img
            src={food.src}
            alt={`Food ${index + 1}`}
            className="w-full h-full object-contain filter drop-shadow-lg"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(255, 107, 107, 0.3))'
            }}
          />
        </motion.div>
      ))}
    </>
  );
}

// Simple Background with Gradient
function BackgroundScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-white via-red-50 to-red-100">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  );
}

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    setIsVisible(true);

    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (!agreedToTerms) {
      toast.error('You must agree to the terms and conditions');
      return;
    }
    
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast.error(error.message);
        return;
      }
      
      toast.success('Check your email to confirm your account');
      router.push('/login');
    } catch (error) {
      toast.error('An error occurred during signup');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      if (error) {
        toast.error(error.message);
      }
    } catch (error) {
      toast.error('An error occurred during Google signup');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-red-50 to-red-100 overflow-hidden relative">
      {/* 3D Background */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100" />}>
          <BackgroundScene />
        </Suspense>
      </div>

      {/* Floating Food Images */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <FloatingFoodImages />
      </div>

      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8 z-50 pointer-events-auto"
      >
        <Button
          variant="ghost"
          asChild
          className="text-gray-700 hover:bg-white/30 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 pointer-events-auto"
        >
          <Link href="/" className="pointer-events-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="flex justify-center items-center min-h-screen px-4 py-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md mx-4"
          style={{
            transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`
          }}
        >
          <Card className="backdrop-blur-xl bg-white/80 border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <CardHeader className="space-y-1 text-center pb-2">
                <motion.div
                  className="flex justify-center mb-1"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="p-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] rounded-full">
                    <ChefHat className="h-6 w-6 text-white" />
                  </div>
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-[#FF6B6B] to-[#FF4444] bg-clip-text text-transparent">
                  Create an Account
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Join PantryPal AI to save recipes and get AI-powered enhancements
                </CardDescription>
              </CardHeader>
            </motion.div>
            <CardContent className="space-y-2 p-3">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Button
                  variant="outline"
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full h-9 border-2 hover:border-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all duration-300 transform hover:scale-105"
                >
                  <motion.div
                    animate={{ rotate: isLoading ? 360 : 0 }}
                    transition={{ duration: 1, repeat: isLoading ? Infinity : 0 }}
                  >
                    <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" fill="currentColor" />
                    </svg>
                  </motion.div>
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-4 text-gray-500 font-medium">
                    Or continue with email
                  </span>
                </div>
              </motion.div>
              <form onSubmit={handleEmailSignUp} className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-9 pl-10 border-2 focus:border-[#FF6B6B] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    />
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-9 pl-10 border-2 focus:border-[#FF6B6B] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="h-5 w-5 bg-gradient-to-r from-[#FF6B6B] to-[#FF8A8A] rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-9 pl-10 border-2 focus:border-[#FF6B6B] transition-all duration-300 bg-white/50 backdrop-blur-sm"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <div className="h-5 w-5 bg-gradient-to-r from-[#FF8A8A] to-[#FFA8A8] rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                  className="flex items-center space-x-3 p-2 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200"
                >
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="data-[state=checked]:bg-[#FF6B6B] data-[state=checked]:border-[#FF6B6B]"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-relaxed cursor-pointer"
                  >
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-[#FF6B6B] hover:text-[#FF4444] underline underline-offset-4 transition-colors duration-300"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.6 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-9 bg-gradient-to-r from-[#FF6B6B] to-[#FF4444] hover:from-[#ff5252] hover:to-[#FF2222] text-white font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={isLoading || !agreedToTerms}
                  >
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <motion.span
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Sparkles className="h-5 w-5" />
                          </motion.div>
                          Creating your account...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="submit"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center justify-center"
                        >
                          <Mail className="mr-2 h-5 w-5" />
                          Create Account
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </form>
        </CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <CardFooter className="flex flex-col space-y-2 pt-2 pb-3">
                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-[#FF6B6B] hover:text-[#FF4444] font-semibold underline-offset-4 hover:underline transition-colors duration-300"
                  >
                    Sign in here
                  </Link>
                </div>
              </CardFooter>
            </motion.div>
          </Card>
        </motion.div>
      </div>


    </div>
  );
}