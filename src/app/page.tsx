"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, Sparkles, Heart, ChefHat, Clock, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [isVisible, setIsVisible] = useState({
    features: false,
    howItWorks: false,
    cta: false
  });

  const featuresRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const supabase = createClient();
    
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
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
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    if (featuresRef.current) observer.observe(featuresRef.current);
    if (howItWorksRef.current) observer.observe(howItWorksRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F7FFF7] to-[#E8F5E8] relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div 
            className="absolute top-20 left-10 w-32 h-32 bg-[#4ECDC4] rounded-full opacity-20 blur-xl"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          <div 
            className="absolute top-40 right-20 w-24 h-24 bg-[#FF6B6B] rounded-full opacity-20 blur-xl"
            style={{ transform: `translateY(${scrollY * -0.2}px)` }}
          />
          <div 
            className="absolute bottom-40 left-1/4 w-40 h-40 bg-[#FFE66D] rounded-full opacity-15 blur-xl"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute bottom-20 right-1/3 w-28 h-28 bg-[#A8E6CF] rounded-full opacity-20 blur-xl"
            style={{ transform: `translateY(${scrollY * -0.15}px)` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="mb-6 animate-fade-in-up">
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-[#4ECDC4] bg-opacity-10 text-[#4ECDC4] font-medium text-sm border border-[#4ECDC4] border-opacity-20">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI-Powered Recipe Enhancement
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in-up animation-delay-200">
                Transform Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#4ECDC4] to-[#FF6B6B]">
                  Cooking Experience
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in-up animation-delay-300 leading-relaxed">
                Discover amazing recipes using ingredients you already have, enhanced with AI-powered suggestions to make them healthier, faster, and more delicious.
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
              <div className="relative">
                <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-500">
                  <Image
                    src="/hero-cooking.jpg"
                    alt="Delicious cooking scene"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    className="rounded-2xl"
                    priority
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg animate-bounce-slow">
                  <div className="flex items-center gap-2">
                    <ChefHat className="h-6 w-6 text-[#4ECDC4]" />
                    <span className="font-semibold text-gray-900">AI Enhanced!</span>
                  </div>
                </div>
              </div>
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
                  <Search className="h-6 w-6 text-[#4ECDC4]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Recipe Discovery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Find perfect recipes using ingredients you already have at home. Our intelligent search helps you make the most of your pantry.
                </p>
              </CardContent>
            </Card>

            <Card className={`border-t-4 border-t-[#FF6B6B] transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image
                  src="/ai-cooking.jpg"
                  alt="AI cooking assistance"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#FF6B6B] bg-opacity-10 p-3 rounded-full w-fit transform transition-transform duration-300 hover:scale-110">
                  <Sparkles className="h-6 w-6 text-[#FF6B6B]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">AI-Powered Enhancements</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized suggestions to make recipes healthier, faster, or more flavorful. Our AI learns your preferences and dietary needs.
                </p>
              </CardContent>
            </Card>

            <Card className={`border-t-4 border-t-[#FFE66D] transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image
                  src="/family-cooking.jpg"
                  alt="Family cooking together"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 hover:scale-110"
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#FFE66D] bg-opacity-10 p-3 rounded-full w-fit transform transition-transform duration-300 hover:scale-110">
                  <Users className="h-6 w-6 text-[#FFE66D]" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">Family-Friendly Options</h3>
                <p className="text-gray-600 leading-relaxed">
                  Discover recipes that work for the whole family. Filter by dietary preferences and get suggestions for kid-friendly modifications.
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
            <div className={`text-center transition-all duration-1000 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
              <div className="mb-6 bg-[#4ECDC4] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto transform transition-transform duration-300 hover:scale-110">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Find a Recipe</h3>
              <p className="text-gray-600 leading-relaxed">
                Search for recipes based on ingredients, cuisine, or dietary preferences.
              </p>
            </div>

            <div className={`text-center transition-all duration-1000 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
              <div className="mb-6 bg-[#FF6B6B] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto transform transition-transform duration-300 hover:scale-110">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">View Recipe Details</h3>
              <p className="text-gray-600 leading-relaxed">
                Check out the full recipe with ingredients, instructions, and cooking time.
              </p>
            </div>

            <div className={`text-center transition-all duration-1000 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
              <div className="mb-6 bg-[#FFE66D] text-gray-900 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto transform transition-transform duration-300 hover:scale-110">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Get AI Enhancements</h3>
              <p className="text-gray-600 leading-relaxed">
                See AI-powered suggestions to make the recipe healthier, faster, or tastier.
              </p>
            </div>
          </div>

          <div className={`mt-12 mb-8 text-center transition-all duration-1000 relative z-20 homepage-explore-button ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '800ms' }}>
            <Button asChild size="lg" className="bg-[#4ECDC4] hover:bg-[#44b8b1] transform hover:scale-105 transition-all duration-300 relative z-20">
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
        className="w-full py-16 mt-8 bg-[#556270] text-white relative z-10 overflow-hidden"
        style={{ transform: `translateY(${scrollY * 0.02}px)` }}
      >
        {/* Parallax background elements */}
        <div
          className="absolute inset-0 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        >
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-xl" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#4ECDC4] rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-[#FF6B6B] rounded-full blur-xl transform -translate-x-1/2 -translate-y-1/2" />
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