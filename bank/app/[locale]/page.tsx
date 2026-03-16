import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import TrustBar from "@/app/components/TrustBar";
import Features from "@/app/components/Features";
import AppShowcase from "@/app/components/AppShowcase";
import CardShowcase from "@/app/components/CardShowcase";
import LiveRates from "@/app/components/LiveRates";
import HowItWorks from "@/app/components/HowItWorks";
import Pricing from "@/app/components/Pricing";
import Security from "@/app/components/Security";
import Testimonials from "@/app/components/Testimonials";
import BlogPreview from "@/app/components/BlogPreview";
import FAQ from "@/app/components/FAQ";
import CTA from "@/app/components/CTA";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0E0E10]">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <AppShowcase />
      <CardShowcase />
      <LiveRates />
      <HowItWorks />
      <Pricing />
      <Security />
      <Testimonials />
      <BlogPreview />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}
