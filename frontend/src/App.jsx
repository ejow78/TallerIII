import React from 'react';
import Hero from './components/Hero';

function App() {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans selection:bg-accent/30">
      <main>
        <Hero />
      </main>
    </div>
  );
}

export default App;
