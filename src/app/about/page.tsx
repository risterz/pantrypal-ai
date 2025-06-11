'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChefHat, Utensils, Leaf, Database, Star, Bot, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-8 text-center">About PantryPal AI</h1>
      
      <div className="mb-10">
        <p className="text-lg text-center mb-6">
          PantryPal AI is your smart kitchen companion, using AI to help you discover delicious recipes 
          based on ingredients you already have at home.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <FeatureCard 
          icon={<ChefHat className="h-8 w-8 text-[#FF6B6B]" />}
          title="AI-Powered Recipe Search"
          description="Find recipes based on ingredients you already have in your kitchen. No more wasted food or unnecessary shopping trips."
        />
        
        <FeatureCard 
          icon={<Utensils className="h-8 w-8 text-[#FF6B6B]" />}
          title="Detailed Instructions"
          description="Get comprehensive, step-by-step cooking instructions to help you prepare meals like a professional chef."
        />
        
        <FeatureCard 
          icon={<Leaf className="h-8 w-8 text-[#4ECDC4]" />}
          title="Dietary Preferences"
          description="Customize your recipe search based on dietary needs - vegetarian, vegan, gluten-free, and more."
        />
        
        <FeatureCard 
          icon={<Database className="h-8 w-8 text-[#4ECDC4]" />}
          title="Save Favorites"
          description="Create your personal recipe collection by saving your favorite discoveries for quick access later."
        />
        
        <FeatureCard 
          icon={<Star className="h-8 w-8 text-[#FFD166]" />}
          title="Personalized Dashboard"
          description="Track your recipe history and get personalized recommendations based on your preferences."
        />
        
        <FeatureCard 
          icon={<Bot className="h-8 w-8 text-[#FFD166]" />}
          title="Smart Suggestions"
          description="Our AI learns your taste preferences over time to suggest recipes you're likely to enjoy."
        />
      </div>
      
      <Card className="bg-[#f8f9fa] border-none shadow-sm mb-12">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Sparkles className="h-6 w-6 mr-2 text-[#FF6B6B]" />
            How PantryPal AI Works
          </h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Enter the ingredients you have available</li>
            <li>Optionally select dietary preferences and meal types</li>
            <li>Our AI searches through thousands of recipes to find perfect matches</li>
            <li>Review detailed recipe information, ingredients, and cooking instructions</li>
            <li>Save your favorites and build your personal recipe collection</li>
          </ol>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Start Cooking Today</h2>
        <p className="mb-6">
          No more "what's for dinner?" stress. PantryPal AI turns your available ingredients into 
          delicious meals with just a few clicks.
        </p>
        <a 
          href="/recipes/search" 
          className="inline-block bg-[#FF6B6B] hover:bg-[#ff5252] text-white font-bold py-3 px-6 rounded-lg transition duration-200"
        >
          Find Recipes Now
        </a>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardContent className="pt-6">
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 