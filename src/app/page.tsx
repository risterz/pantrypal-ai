'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Utensils, Save, Filter, ArrowRight, Sparkles, Clock, Heart } from "lucide-react";
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/supabase';
import Image from 'next/image';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    features: false,
    howItWorks: false,
    cta: false
  });

  const supabase = createClient();
  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initial user fetch
    async function getUser() {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setIsLoading(false);
    }

    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          if (target === featuresRef.current) {
            setIsVisible(prev => ({ ...prev, features: true }));
          } else if (target === howItWorksRef.current) {
            setIsVisible(prev => ({ ...prev, howItWorks: true }));
          } else if (target === ctaRef.current) {
            setIsVisible(prev => ({ ...prev, cta: true }));
          }
        }
      });
    }, observerOptions);

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden">
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating cooking elements */}
        <div
          className="absolute top-20 left-10 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)` }}
        >
          <Utensils className="h-16 w-16 text-[#4ECDC4]" />
        </div>
        <div
          className="absolute top-40 right-20 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.1}deg)` }}
        >
          <Sparkles className="h-12 w-12 text-[#FF6B6B]" />
        </div>
        <div
          className="absolute top-96 left-1/4 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.25}px) rotate(${scrollY * 0.05}deg)` }}
        >
          <Clock className="h-14 w-14 text-[#556270]" />
        </div>
        <div
          className="absolute bottom-40 right-10 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * -0.15}deg)` }}
        >
          <Heart className="h-18 w-18 text-[#4ECDC4]" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#556270] text-white relative z-10 overflow-hidden">
        {/* Parallax background overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center relative z-10">
          <div
            className="md:w-1/2 mb-8 md:mb-0 md:pr-8 text-center md:text-left transform transition-all duration-1000 ease-out"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight animate-fade-in-up">
              Make Your Recipes Better with AI
            </h1>
            <p className="text-lg sm:text-xl mb-6 leading-relaxed animate-fade-in-up animation-delay-200">
              Enhance your cooking with smart AI suggestions to make your favorite recipes tastier, healthier, and more efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up animation-delay-400">
              <Button asChild size="lg" className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white w-full sm:w-auto transform hover:scale-105 transition-all duration-300">
                <Link href="/recipes/search">
                  Find Recipes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4ECDC4] font-medium transition-all duration-300 w-full sm:w-auto transform hover:scale-105">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <div
            className="md:w-1/2 w-full"
            style={{ transform: `translateY(${scrollY * -0.05}px)` }}
          >
            <div className="relative h-64 sm:h-72 md:h-96 w-full rounded-lg overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-500">
              <Image
                src="/ai-cooking-enhancement.jpg"
                alt="Cooking with PantryPal"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
                className="animate-fade-in"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        className="w-full py-16 bg-white relative z-10"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900">How PantryPal AI Makes Cooking Better</h2>
            <p className="mt-4 text-xl text-gray-600">Our AI assistant enhances your favorite recipes with smart suggestions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className={`border-t-4 border-t-[#4ECDC4] transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image
                  src="/chef-cooking.jpg"
                  alt="Chef cooking food"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#4ECDC4] bg-opacity-10 p-3 rounded-full w-fit transform transition-transform duration-300 hover:scale-110">
                  <Sparkles className="h-6 w-6 text-[#4ECDC4]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Healthier Options</h3>
                <p className="text-gray-600">
                  Get smart suggestions to make recipes healthier while maintaining great taste. Substitute ingredients and try better cooking methods.
                </p>
              </CardContent>
            </Card>

            <Card className={`border-t-4 border-t-[#FF6B6B] transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image
                  src="/cooking-spices.jpg"
                  alt="Cooking spices and ingredients"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#FF6B6B] bg-opacity-10 p-3 rounded-full w-fit transform transition-transform duration-300 hover:scale-110">
                  <Clock className="h-6 w-6 text-[#FF6B6B]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Time-Saving Techniques</h3>
                <p className="text-gray-600">
                  Learn efficient cooking techniques and prep strategies to save time in the kitchen without sacrificing quality.
                </p>
              </CardContent>
            </Card>

            <Card className={`border-t-4 border-t-[#556270] transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image
                  src="/ai-cooking-enhancement.jpg"
                  alt="AI-enhanced cooking"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#556270] bg-opacity-10 p-3 rounded-full w-fit transform transition-transform duration-300 hover:scale-110">
                  <Utensils className="h-6 w-6 text-[#556270]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Flavor Enhancements</h3>
                <p className="text-gray-600">
                  Discover simple tweaks to elevate flavors and transform ordinary recipes into extraordinary meals with professional techniques.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={howItWorksRef}
        className="w-full py-16 bg-gray-50 relative z-10"
        style={{ transform: `translateY(${scrollY * 0.05}px)` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`text-center mb-12 transition-all duration-1000 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Enhancing your recipes is easy with PantryPal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className={`flex flex-col items-center text-center transform transition-all duration-1000 hover:scale-105 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
              <div className="bg-[#4ECDC4] rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mb-4 transform transition-all duration-300 hover:scale-110 hover:shadow-lg">1</div>
              <h3 className="text-xl font-bold mb-2">Find a Recipe</h3>
              <p className="text-gray-600">
                Search for recipes based on ingredients, cuisine, or dietary preferences.
              </p>
            </div>

            <div className={`flex flex-col items-center text-center transform transition-all duration-1000 hover:scale-105 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
              <div className="bg-[#4ECDC4] rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mb-4 transform transition-all duration-300 hover:scale-110 hover:shadow-lg">2</div>
              <h3 className="text-xl font-bold mb-2">View Recipe Details</h3>
              <p className="text-gray-600">
                Check out the full recipe with ingredients, instructions, and cooking time.
              </p>
            </div>

            <div className={`flex flex-col items-center text-center transform transition-all duration-1000 hover:scale-105 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
              <div className="bg-[#4ECDC4] rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mb-4 transform transition-all duration-300 hover:scale-110 hover:shadow-lg">3</div>
              <h3 className="text-xl font-bold mb-2">Get AI Enhancements</h3>
              <p className="text-gray-600">
                See AI-powered suggestions to make the recipe healthier, faster, or tastier.
              </p>
            </div>
          </div>

          <div className={`mt-12 text-center transition-all duration-1000 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
            <Button asChild size="lg" className="bg-[#4ECDC4] hover:bg-[#44b8b1] transform hover:scale-105 transition-all duration-300">
              <Link href="/recipes/search">
                Start Exploring Recipes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaRef}
        className="w-full py-16 bg-[#556270] text-white relative z-10 overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.02}px)` }}
      >
        {/* Parallax background elements */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          <div className="absolute top-10 left-10">
            <Sparkles className="h-20 w-20" />
          </div>
          <div className="absolute bottom-10 right-10">
            <Utensils className="h-16 w-16" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className={`text-3xl font-bold mb-4 transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Ready to Transform Your Cooking?
          </h2>

          {user ? (
            <>
              <p className={`text-xl mb-8 max-w-3xl mx-auto transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
                Continue enhancing your recipes with our AI-powered suggestions.
              </p>
              <div className={`transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
                <Button asChild size="lg" className="bg-white text-[#556270] hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                  <Link href="/recipes/search">
                    Discover New Recipes
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className={`text-xl mb-8 max-w-3xl mx-auto transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
                Join PantryPal today and start enhancing your recipes with our AI-powered suggestions.
              </p>
              <div className={`transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
                <Button asChild size="lg" className="bg-white text-[#556270] hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                  <Link href="/signup">
                    Sign Up for Free
                    <Heart className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
