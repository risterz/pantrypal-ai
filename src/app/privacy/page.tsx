'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <Button 
        variant="ghost" 
        asChild
        className="mb-8"
      >
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </Button>
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Last updated: May 12, 2025
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">1. Introduction</h2>
        <p className="mb-4">
          Welcome to PantryPal AI. We respect your privacy and are committed to protecting your personal data. 
          This privacy policy will inform you about how we look after your personal data when you visit our website 
          and tell you about your privacy rights and how the law protects you.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">2. The Data We Collect</h2>
        <p className="mb-4">
          We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes email address.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website, products and services, including recipe searches, saved recipes, and preferences.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">3. How We Use Your Data</h2>
        <p className="mb-4">
          We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>To register you as a new user.</li>
          <li>To provide and improve our services to you, including recipe recommendations and AI enhancements.</li>
          <li>To manage our relationship with you.</li>
          <li>To administer and protect our business and this website.</li>
          <li>To use data analytics to improve our website, products/services, marketing, customer relationships and experiences.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">4. Data Security</h2>
        <p className="mb-4">
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">5. Data Retention</h2>
        <p className="mb-4">
          We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">6. Your Legal Rights</h2>
        <p className="mb-4">
          Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Request access to your personal data.</li>
          <li>Request correction of your personal data.</li>
          <li>Request erasure of your personal data.</li>
          <li>Object to processing of your personal data.</li>
          <li>Request restriction of processing your personal data.</li>
          <li>Request transfer of your personal data.</li>
          <li>Right to withdraw consent.</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">7. Third-Party Links</h2>
        <p className="mb-4">
          This website may include links to third-party websites, plug-ins and applications. Clicking on those links or enabling those connections may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">8. Changes to the Privacy Policy</h2>
        <p className="mb-4">
          We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">9. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this privacy policy or our privacy practices, please contact us at:
        </p>
        <p className="mb-4">
          <strong>Email:</strong> privacy@pantrypal-ai.com
        </p>
      </div>
    </div>
  );
}
