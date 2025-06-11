'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Utensils, Save, Filter, ArrowRight, Sparkles, Clock, Heart } from "lucide-react";
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/types/supabase';
import Image from 'next/image';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#556270] text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Make Your Recipes Better with AI
            </h1>
            <p className="text-xl mb-6">
              Enhance your cooking with smart AI suggestions to make your favorite recipes tastier, healthier, and more efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-[#FF6B6B] hover:bg-[#ff5252] text-white">
                <Link href="/recipes/search">
                  Find Recipes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4ECDC4] font-medium transition-colors">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-72 md:h-96 w-full rounded-lg overflow-hidden shadow-xl">
              <Image 
                src="/ai-cooking-enhancement.jpg" 
                alt="Cooking with PantryPal"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How PantryPal AI Makes Cooking Better</h2>
            <p className="mt-4 text-xl text-gray-600">Our AI assistant enhances your favorite recipes with smart suggestions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-t-4 border-t-[#4ECDC4]">
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image 
                  src="/chef-cooking.jpg"
                  alt="Chef cooking food"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 25%' }}
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#4ECDC4] bg-opacity-10 p-3 rounded-full w-fit">
                  <Sparkles className="h-6 w-6 text-[#4ECDC4]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Healthier Options</h3>
                <p className="text-gray-600">
                  Get smart suggestions to make recipes healthier while maintaining great taste. Substitute ingredients and try better cooking methods.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-[#FF6B6B]">
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image 
                  src="/cooking-spices.jpg"
                  alt="Cooking spices and ingredients"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#FF6B6B] bg-opacity-10 p-3 rounded-full w-fit">
                  <Clock className="h-6 w-6 text-[#FF6B6B]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Time-Saving Techniques</h3>
                <p className="text-gray-600">
                  Learn efficient cooking techniques and prep strategies to save time in the kitchen without sacrificing quality.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-t-4 border-t-[#556270]">
              <div className="relative h-48 w-full mb-4 overflow-hidden rounded-t-lg">
                <Image 
                  src="/ai-cooking-enhancement.jpg"
                  alt="AI-enhanced cooking"
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: 'cover', objectPosition: 'center 60%' }}
                />
              </div>
              <CardContent className="pt-2">
                <div className="mb-4 bg-[#556270] bg-opacity-10 p-3 rounded-full w-fit">
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
      <section className="w-full py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Enhancing your recipes is easy with PantryPal</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#4ECDC4] rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mb-4">1</div>
              <h3 className="text-xl font-bold mb-2">Find a Recipe</h3>
              <p className="text-gray-600">
                Search for recipes based on ingredients, cuisine, or dietary preferences.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#4ECDC4] rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mb-4">2</div>
              <h3 className="text-xl font-bold mb-2">View Recipe Details</h3>
              <p className="text-gray-600">
                Check out the full recipe with ingredients, instructions, and cooking time.
              </p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-[#4ECDC4] rounded-full h-12 w-12 flex items-center justify-center text-white font-bold text-xl mb-4">3</div>
              <h3 className="text-xl font-bold mb-2">Get AI Enhancements</h3>
              <p className="text-gray-600">
                See AI-powered suggestions to make the recipe healthier, faster, or tastier.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="bg-[#4ECDC4] hover:bg-[#44b8b1]">
              <Link href="/recipes/search">
                Start Exploring Recipes
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-16 bg-[#556270] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Cooking?</h2>
          
          {user ? (
            <>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Continue enhancing your recipes with our AI-powered suggestions.
              </p>
              <Button asChild size="lg" className="bg-white text-[#556270] hover:bg-gray-100">
                <Link href="/recipes/search">
                  Discover New Recipes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Join PantryPal today and start enhancing your recipes with our AI-powered suggestions.
              </p>
              <Button asChild size="lg" className="bg-white text-[#556270] hover:bg-gray-100">
                <Link href="/signup">
                  Sign Up for Free
                  <Heart className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
