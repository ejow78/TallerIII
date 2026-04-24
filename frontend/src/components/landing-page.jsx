import React from 'react';
import Hero from './Hero';
import { NavigationBar } from './navigation-bar';
import { Features } from './features';
import { ContactSection } from './ContactSection';
import { FooterSection } from './footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-brand/30 pt-16">
      <NavigationBar />
      <main>
        <Hero />
        <Features />
        <ContactSection />
      </main>
      <FooterSection />
    </div>
  );
}
