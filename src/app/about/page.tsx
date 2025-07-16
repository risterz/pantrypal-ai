'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ChefHat, Utensils, Leaf, Database, Star, Bot, Sparkles, Heart, Clock, Zap, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    howItWorks: false,
    mission: false,
    stats: false,
    cta: false
  });

  const sectionRefs = {
    hero: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    howItWorks: useRef<HTMLElement>(null),
    mission: useRef<HTMLElement>(null),
    stats: useRef<HTMLElement>(null),
    cta: useRef<HTMLElement>(null)
  };

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
          Object.entries(sectionRefs).forEach(([key, ref]) => {
            if (target === ref.current) {
              setIsVisible(prev => ({ ...prev, [key]: true }));
            }
          });
        }
      });
    }, observerOptions);

    Object.values(sectionRefs).forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7FFF7] overflow-hidden">
      {/* Parallax Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-20 left-10 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.1}deg)` }}
        >
          <ChefHat className="h-16 w-16 text-[#FF6B6B]" />
        </div>
        <div
          className="absolute top-40 right-20 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.1}deg)` }}
        >
          <Sparkles className="h-12 w-12 text-[#4ECDC4]" />
        </div>
        <div
          className="absolute top-96 left-1/4 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.25}px) rotate(${scrollY * 0.05}deg)` }}
        >
          <Utensils className="h-14 w-14 text-[#FFD166]" />
        </div>
        <div
          className="absolute bottom-40 right-10 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * -0.15}deg)` }}
        >
          <Heart className="h-18 w-18 text-[#FF6B6B]" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white relative z-10 overflow-hidden">
        {/* Parallax background overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />

        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8 relative z-10">
          <Button
            variant="ghost"
            asChild
            className="mb-8 text-white hover:bg-white/10 hover:text-white"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div
            ref={sectionRefs.hero}
            className={`text-center transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <ChefHat className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About PantryPal AI</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Your smart kitchen companion that finds recipes using Spoonacular's database and enhances them
              with AI-powered suggestions to make them healthier, faster, and tastier.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="space-y-16">
          {/* Features Section */}
          <div
            ref={sectionRefs.features}
            className={`transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PantryPal AI?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Combining Spoonacular's recipe database with AI-powered enhancements for the ultimate cooking experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ChefHat className="h-8 w-8 text-[#FF6B6B]" />}
                title="Spoonacular Recipe Search"
                description="Find recipes based on ingredients you have using Spoonacular's comprehensive recipe database. No more wasted food or unnecessary shopping trips."
                delay="100ms"
                isVisible={isVisible.features}
              />

              <FeatureCard
                icon={<Bot className="h-8 w-8 text-[#FF6B6B]" />}
                title="AI Recipe Enhancements"
                description="Get AI-powered suggestions to make any recipe healthier, faster, and tastier with our intelligent enhancement system."
                delay="200ms"
                isVisible={isVisible.features}
              />

              <FeatureCard
                icon={<Leaf className="h-8 w-8 text-[#4ECDC4]" />}
                title="Dietary Preferences"
                description="Customize your recipe search based on dietary needs - vegetarian, vegan, gluten-free, and more using advanced filters."
                delay="300ms"
                isVisible={isVisible.features}
              />

              <FeatureCard
                icon={<Database className="h-8 w-8 text-[#4ECDC4]" />}
                title="Save Favorites"
                description="Create your personal recipe collection by saving your favorite discoveries and AI enhancements for quick access later."
                delay="400ms"
                isVisible={isVisible.features}
              />

              <FeatureCard
                icon={<Utensils className="h-8 w-8 text-[#FFD166]" />}
                title="Detailed Instructions"
                description="Get comprehensive, step-by-step cooking instructions from Spoonacular plus AI enhancement tips for better results."
                delay="500ms"
                isVisible={isVisible.features}
              />

              <FeatureCard
                icon={<Star className="h-8 w-8 text-[#FFD166]" />}
                title="Enhancement Validation"
                description="Our AI suggestions are validated against expert-sourced data to ensure quality and reliability of improvements."
                delay="600ms"
                isVisible={isVisible.features}
              />
            </div>
          </div>
          {/* Statistics Section */}
          <div
            ref={sectionRefs.stats}
            className={`transition-all duration-1000 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Powered by AI Innovation</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See how our AI technology is transforming the cooking experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className={`bg-gradient-to-br from-red-50 to-pink-50 border-red-200 shadow-lg hover:shadow-xl transition-all duration-500 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Heart className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-red-800 mb-2">Healthier</h3>
                  <p className="text-red-600 font-medium">AI Enhancement Category</p>
                  <p className="text-sm text-gray-600 mt-2">Smart suggestions to make recipes more nutritious</p>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-500 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '400ms' }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">Faster</h3>
                  <p className="text-blue-600 font-medium">AI Enhancement Category</p>
                  <p className="text-sm text-gray-600 mt-2">Time-saving techniques and prep strategies</p>
                </CardContent>
              </Card>

              <Card className={`bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-500 ${isVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '600ms' }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-4">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-yellow-800 mb-2">Tastier</h3>
                  <p className="text-yellow-600 font-medium">AI Enhancement Category</p>
                  <p className="text-sm text-gray-600 mt-2">Flavor boosters and culinary improvements</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* How It Works Section */}
          <div
            ref={sectionRefs.howItWorks}
            className={`transition-all duration-1000 ${isVisible.howItWorks ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl text-green-800">
                  <Sparkles className="mr-3 h-6 w-6 text-green-600" />
                  How PantryPal AI Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {[
                    { step: 1, title: "Enter Ingredients", desc: "List what you have available", icon: <Utensils className="h-6 w-6" /> },
                    { step: 2, title: "Set Preferences", desc: "Choose dietary needs & meal types", icon: <Leaf className="h-6 w-6" /> },
                    { step: 3, title: "Spoonacular Search", desc: "Find recipes from comprehensive database", icon: <Database className="h-6 w-6" /> },
                    { step: 4, title: "AI Enhancements", desc: "Get AI suggestions to improve recipes", icon: <Bot className="h-6 w-6" /> },
                    { step: 5, title: "Save & Cook", desc: "Build your enhanced recipe collection", icon: <Heart className="h-6 w-6" /> }
                  ].map((item, index) => (
                    <div key={item.step} className="text-center">
                      <div className="bg-green-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3 text-green-600">
                        {item.step}
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg mb-2">
                        <div className="flex justify-center mb-2 text-green-600">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold text-sm text-gray-800">{item.title}</h3>
                      </div>
                      <p className="text-xs text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Mission Section */}
          <div
            ref={sectionRefs.mission}
            className={`transition-all duration-1000 ${isVisible.mission ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <Card className="bg-gradient-to-r from-[#556270] to-[#4ECDC4] text-white shadow-xl">
              <CardContent className="p-8 md:p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-white/10 p-4 rounded-full">
                    <Users className="h-12 w-12" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-8">
                  We believe cooking should be accessible, enjoyable, and continuously improving. PantryPal AI combines
                  Spoonacular's extensive recipe database with intelligent AI enhancements to help you reduce food waste
                  and make every recipe better - healthier, faster, and more delicious.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="bg-white/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <Database className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Comprehensive</h3>
                    <p className="text-sm text-white/80">Access thousands of recipes via Spoonacular</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <Bot className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">AI-Enhanced</h3>
                    <p className="text-sm text-white/80">Smart enhancements for better cooking results</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/10 p-3 rounded-full w-fit mx-auto mb-3">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-2">Validated</h3>
                    <p className="text-sm text-white/80">AI suggestions verified against expert data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div
            ref={sectionRefs.cta}
            className={`text-center transition-all duration-1000 ${isVisible.cta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 md:p-12">
              <div className="flex justify-center mb-6">
                <div className="bg-orange-100 p-4 rounded-full">
                  <TrendingUp className="h-12 w-12 text-orange-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Start Cooking Smarter Today</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                No more "what's for dinner?" stress. Find recipes from Spoonacular's database using your available ingredients,
                then enhance them with AI-powered suggestions for healthier, faster, and tastier results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white transform hover:scale-105 transition-all duration-300">
                  <Link href="/recipes/search">
                    Find Recipes Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-2 border-[#4ECDC4] text-[#4ECDC4] hover:bg-[#4ECDC4] hover:text-white transform hover:scale-105 transition-all duration-300">
                  <Link href="/signup">
                    Join PantryPal AI
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  delay = '0ms',
  isVisible = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: string;
  isVisible?: boolean;
}) {
  return (
    <Card
      className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: delay }}
    >
      <CardContent className="p-6">
        <div className="text-center">
          <div className="bg-gray-50 p-4 rounded-full w-fit mx-auto mb-4 transform transition-transform duration-300 hover:scale-110">
            {icon}
          </div>
          <h3 className="font-semibold text-lg mb-3 text-gray-800">{title}</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}