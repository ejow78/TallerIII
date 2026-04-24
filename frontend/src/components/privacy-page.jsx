import React from 'react';
import { NavigationBar } from './navigation-bar';
import { FooterSection } from './footer';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans pt-16">
      <NavigationBar isSimple={true} />
      <main className="max-w-4xl mx-auto px-6 py-20">
        <section className="mb-16">
          <h1 className="text-4xl font-bold mb-8 text-foreground">Política de Privacidad</h1>
          <div className="space-y-6 text-text-muted leading-relaxed">
            <p>
              En RepairIT, nos tomamos muy en serio la privacidad de tus datos y los de tus clientes.
            </p>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  );
};

export default PrivacyPage;
