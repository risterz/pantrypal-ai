'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Clock, AlertTriangle, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7FFF7]">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-[#4ECDC4] to-[#556270] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
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
                <Shield className="h-12 w-12" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Your privacy is important to us. Learn how we protect and handle your personal information.
            </p>
            <p className="text-lg text-white/80 mt-4">
              Last updated: May 12, 2025
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8">
          {/* Introduction Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <FileText className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Welcome to PantryPal AI. We respect your privacy and are committed to protecting your personal data.
                This privacy policy will inform you about how we look after your personal data when you visit our website
                and tell you about your privacy rights and how the law protects you.
              </p>
            </CardContent>
          </Card>

          {/* Data Collection Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Eye className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                2. The Data We Collect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Identity Data</h4>
                  <p className="text-sm text-gray-600">First name, last name, username or similar identifier.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Contact Data</h4>
                  <p className="text-sm text-gray-600">Email address for communication.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Technical Data</h4>
                  <p className="text-sm text-gray-600">IP address, browser type, operating system, and device information.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">Usage Data</h4>
                  <p className="text-sm text-gray-600">Recipe searches, saved recipes, preferences, and website interactions.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Users className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                3. How We Use Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">To register you as a new user.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">To provide and improve our services to you, including recipe recommendations and AI enhancements.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">To manage our relationship with you.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">To administer and protect our business and this website.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-600">To use data analytics to improve our website, products/services, marketing, customer relationships and experiences.</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Lock className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
              </p>
            </CardContent>
          </Card>
          {/* Data Retention Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Clock className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                5. Data Retention
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
            </CardContent>
          </Card>

          {/* Legal Rights Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <Shield className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                6. Your Legal Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-3"></div>
                  <span className="text-gray-600 text-sm">Request access to your personal data</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-3"></div>
                  <span className="text-gray-600 text-sm">Request correction of your personal data</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-3"></div>
                  <span className="text-gray-600 text-sm">Request erasure of your personal data</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-3"></div>
                  <span className="text-gray-600 text-sm">Object to processing of your personal data</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-3"></div>
                  <span className="text-gray-600 text-sm">Request restriction of processing</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-3"></div>
                  <span className="text-gray-600 text-sm">Request transfer of your personal data</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="w-2 h-2 bg-[#4ECDC4] rounded-full mr-3"></div>
                  <span className="text-gray-600 text-sm">Right to withdraw consent</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third-Party Links Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <AlertTriangle className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                7. Third-Party Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </CardContent>
          </Card>

          {/* Policy Changes Card */}
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-gray-800">
                <FileText className="mr-3 h-6 w-6 text-[#4ECDC4]" />
                8. Changes to the Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
              </p>
            </CardContent>
          </Card>

          {/* Contact Card */}
          <Card className="bg-gradient-to-r from-[#4ECDC4] to-[#556270] text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Mail className="mr-3 h-6 w-6" />
                9. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-white/90 leading-relaxed">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <div className="p-4 bg-white/10 rounded-lg">
                <p className="font-semibold">
                  Email: privacy@pantrypal-ai.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
