import Navbar from "../components/landing/Navbar";
import ProductHero from "../components/landing/ProductHero";
import ProblemsSection from "../components/landing/ProblemsSection";
import ProductFeatures from "../components/landing/ProductFeatures";
import PricingPlans from "../components/landing/PricingPlans";
import SystemModules from "../components/landing/SystemModules";
import SystemWorkflow from "../components/landing/SystemWorkflow";
import AdminAIAssistant from "../components/landing/AdminAIAssistant";
import FeaturesAndBenefits from "../components/landing/FeaturesAndBenefits";
import WhyUs from "../components/landing/WhyUs";
import Footer from "../components/landing/Footer";

function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="h-16 sm:h-20" aria-hidden="true" />

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

export default LandingPage;