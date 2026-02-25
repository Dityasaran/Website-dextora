import React from 'react';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { ReelsPreview } from '@/components/landing/ReelsPreview';
import { Philosophy } from '@/components/landing/Philosophy';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <main className="bg-[#0A0A14] min-h-screen text-[#F0EFF4] selection:bg-[#7B61FF]/30 selection:text-white relative">
      <Navbar />
      <Hero />
      <Features />
      <ReelsPreview />
      <Philosophy />

      {/* CTA Section */}
      <section className="py-40 px-6 text-center relative overflow-hidden bg-gradient-to-b from-[#05050A] to-[#0A0A14]">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-8">
            Ready to command the <br /> <span className="text-[#7B61FF] italic font-drama">Engine?</span>
          </h2>
          <a href="/studio" className="magnetic-btn inline-block px-10 py-5 rounded-full bg-[#7B61FF] text-white font-bold text-lg hover:bg-[#684feb] transition-colors hover:shadow-[0_0_40px_rgba(123,97,255,0.4)]">
            Launch Dextora Studio
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
