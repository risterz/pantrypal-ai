'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
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
      
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Terms of Service</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg text-gray-600 mb-6">
          Last updated: May 12, 2025
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">1. Introduction</h2>
        <p className="mb-4">
          Welcome to PantryPal AI. These Terms of Service ("Terms") govern your use of our website and services. 
          By accessing or using PantryPal AI, you agree to be bound by these Terms. If you disagree with any part 
          of the terms, you may not access the service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">2. Use of Service</h2>
        <p className="mb-4">
          PantryPal AI provides an AI-powered recipe enhancement platform. Our service allows users to search for recipes,
          receive AI-powered suggestions to improve recipes, and save favorite recipes. You agree to use the service only for
          lawful purposes and in accordance with these Terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">3. User Accounts</h2>
        <p className="mb-4">
          When you create an account with us, you must provide information that is accurate, complete, and current at all times.
          Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
        </p>
        <p className="mb-4">
          You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">4. Intellectual Property</h2>
        <p className="mb-4">
          The service and its original content, features, and functionality are and will remain the exclusive property of PantryPal AI and its licensors.
          The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of PantryPal AI.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">5. User Content</h2>
        <p className="mb-4">
          Our service allows you to post, link, store, share and otherwise make available certain information, text, or material ("Content").
          You are responsible for the Content that you post on or through the service, including its legality, reliability, and appropriateness.
        </p>
        <p className="mb-4">
          By posting Content on or through the service, you represent and warrant that: (i) the Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms, and (ii) the posting of your Content on or through the service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">6. Limitation of Liability</h2>
        <p className="mb-4">
          In no event shall PantryPal AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; (iii) any content obtained from the service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">7. Disclaimer</h2>
        <p className="mb-4">
          Your use of the service is at your sole risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
        </p>
        <p className="mb-4">
          PantryPal AI, its subsidiaries, affiliates, and its licensors do not warrant that a) the service will function uninterrupted, secure or available at any particular time or location; b) any errors or defects will be corrected; c) the service is free of viruses or other harmful components; or d) the results of using the service will meet your requirements.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">8. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
        </p>
        <p className="mb-4">
          Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">9. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        <p className="mb-4">
          By continuing to access or use our service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800">10. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mb-4">
          <strong>Email:</strong> terms@pantrypal-ai.com
        </p>
      </div>
    </div>
  );
}
