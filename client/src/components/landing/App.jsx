import Navbar from "./components/Navbar";
import ProductHero from "./components/ProductHero";
import ProblemsSection from "./components/ProblemsSection";
import ProductFeatures from "./components/ProductFeatures";
import PricingPlans from "./components/PricingPlans";
import SystemModules from "./components/SystemModules";
import SystemWorkflow from "./components/SystemWorkflow";
import AdminAIAssistant from "./components/AdminAIAssistant";
import FeaturesAndBenefits from "./components/FeaturesAndBenefits";
import WhyUs from "./components/WhyUs";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />

      <section id="home">
        <ProductHero />
      </section>

      <section id="problems">
        <ProblemsSection />
      </section>

      <section id="features">
        <ProductFeatures />
      </section>

      <section id="plans">
        <PricingPlans />
      </section>

      <section id="modules">
        <SystemModules />
      </section>

      <section id="workflow">
        <SystemWorkflow />
      </section>

      <section id="ai-assistant">
        <AdminAIAssistant />
      </section>

      <section id="benefits">
        <FeaturesAndBenefits />
      </section>

      <section id="why">
        <WhyUs />
      </section>

      <section id="contact">
        <Footer />
      </section>
    </>
  );
}

export default App;