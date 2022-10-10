import React from 'react';
import BusinessPlansSection from './layouts/BusinessPlansSection';
import DealsSection from './layouts/DealsSection';
import EntertainmentSection from './layouts/EntertainmentSection';
import Footer from './layouts/Footer';
import Hero from './layouts/Hero';
import Navbar from './layouts/Navbar';
import QuickActionsSection from './layouts/QuickActionsSection';
import UnlimitedPlansSection from './layouts/UnlimitedPlansSection';

const App = () => {
  return (
    <div className="font-body">
      <Navbar />
      <Hero />
      <QuickActionsSection />
      <DealsSection />
      <UnlimitedPlansSection />
      <BusinessPlansSection />
      <EntertainmentSection />
      <Footer />
    </div>
  );
};

export default App;
