'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, User, Shield, Copyright, AlertTriangle, Scale, Gavel, RefreshCw, Mail, Utensils, Clock, Heart, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from 'react';

export default function TermsPage() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    intro: false,
    usage: false,
    accounts: false,
    intellectual: false,
    content: false,
    liability: false,
    disclaimer: false,
    governing: false,
    changes: false,
    contact: false
  });

  const sectionRefs = {
    intro: useRef<HTMLElement>(null),
    usage: useRef<HTMLElement>(null),
    accounts: useRef<HTMLElement>(null),
    intellectual: useRef<HTMLElement>(null),
    content: useRef<HTMLElement>(null),
    liability: useRef<HTMLElement>(null),
    disclaimer: useRef<HTMLElement>(null),
    governing: useRef<HTMLElement>(null),
    changes: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null)
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
          <Scale className="h-16 w-16 text-[#4ECDC4]" />
        </div>
        <div
          className="absolute top-40 right-20 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.15}px) rotate(${scrollY * -0.1}deg)` }}
        >
          <Gavel className="h-12 w-12 text-[#FF6B6B]" />
        </div>
        <div
          className="absolute top-96 left-1/4 opacity-10"
          style={{ transform: `translateY(${scrollY * 0.25}px) rotate(${scrollY * 0.05}deg)` }}
        >
          <Shield className="h-14 w-14 text-[#556270]" />
        </div>
        <div
          className="absolute bottom-40 right-10 opacity-10"
          style={{ transform: `translateY(${scrollY * -0.3}px) rotate(${scrollY * -0.15}deg)` }}
        >
          <FileText className="h-18 w-18 text-[#4ECDC4]" />
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#556270] to-[#4ECDC4] text-white relative z-10 overflow-hidden">
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

          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-full">
                <Scale className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Please read these terms carefully before using PantryPal AI services.
            </p>
            <p className="text-lg text-white/80 mt-4">
              Last updated: May 12, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="grid gap-8">
          {/* Introduction Card */}
          <Card
            ref={sectionRefs.intro}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.intro ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <FileText className="mr-3 h-6 w-6 text-[#556270]" />
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Welcome to PantryPal AI. These Terms of Service ("Terms") govern your use of our website and services.
                By accessing or using PantryPal AI, you agree to be bound by these Terms. If you disagree with any part
                of the terms, you may not access the service.
              </p>
            </CardContent>
          </Card>

          {/* Use of Service Card */}
          <Card
            ref={sectionRefs.usage}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.usage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Utensils className="mr-3 h-6 w-6 text-[#556270]" />
                2. Use of Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                PantryPal AI provides an AI-powered recipe enhancement platform. Our service allows users to search for recipes,
                receive AI-powered suggestions to improve recipes, and save favorite recipes. You agree to use the service only for
                lawful purposes and in accordance with these Terms.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts Card */}
          <Card
            ref={sectionRefs.accounts}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.accounts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <User className="mr-3 h-6 w-6 text-[#556270]" />
                3. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                  Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
                </p>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-amber-800">Important:</strong> You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
                    You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Intellectual Property Card */}
          <Card
            ref={sectionRefs.intellectual}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.intellectual ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Copyright className="mr-3 h-6 w-6 text-[#556270]" />
                4. Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                The service and its original content, features, and functionality are and will remain the exclusive property of PantryPal AI and its licensors.
                The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of PantryPal AI.
              </p>
            </CardContent>
          </Card>

          {/* User Content Card */}
          <Card
            ref={sectionRefs.content}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.content ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Heart className="mr-3 h-6 w-6 text-[#556270]" />
                5. User Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Our service allows you to post, link, store, share and otherwise make available certain information, text, or material ("Content").
                  You are responsible for the Content that you post on or through the service, including its legality, reliability, and appropriateness.
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-blue-800">Content Requirements:</strong> By posting Content on or through the service, you represent and warrant that:
                    (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and
                    (ii) the posting of your Content on or through the service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitation of Liability Card */}
          <Card
            ref={sectionRefs.liability}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.liability ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <AlertTriangle className="mr-3 h-6 w-6 text-[#556270]" />
                6. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-gray-600 leading-relaxed">
                  <strong className="text-red-800">Important Legal Notice:</strong> In no event shall PantryPal AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
                </p>
              </div>
            </CardContent>
          </Card>
          {/* Disclaimer Card */}
          <Card
            ref={sectionRefs.disclaimer}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.disclaimer ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '700ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Shield className="mr-3 h-6 w-6 text-[#556270]" />
                7. Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-yellow-800">Service Disclaimer:</strong> Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                  </p>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  PantryPal AI, its subsidiaries, affiliates, and its licensors do not warrant that a) the service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the service is free of viruses or other harmful components; or d) the results of using the service will meet your requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Governing Law Card */}
          <Card
            ref={sectionRefs.governing}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.governing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '800ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Gavel className="mr-3 h-6 w-6 text-[#556270]" />
                8. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
                </p>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-gray-600 leading-relaxed">
                    Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms Card */}
          <Card
            ref={sectionRefs.changes}
            className={`bg-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.changes ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '900ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <RefreshCw className="mr-3 h-6 w-6 text-[#556270]" />
                9. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-gray-600 leading-relaxed">
                    <strong className="text-green-800">Notice:</strong> By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Contact Card */}
          <Card
            ref={sectionRefs.contact}
            className={`bg-gradient-to-r from-[#556270] to-[#4ECDC4] text-white shadow-lg hover:shadow-xl transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: '1000ms' }}
          >
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Mail className="mr-3 h-6 w-6" />
                10. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/90 leading-relaxed">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="font-semibold">
                  Email: terms@pantrypal-ai.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
