import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import VideoSection from "@/components/sections/VideoSection";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import Differentiators from "@/components/sections/Differentiators";
import WhyKankrej from "@/components/sections/WhyKankrej";
import Benefits from "@/components/sections/Benefits";
import Testimonials from "@/components/sections/Testimonials";
import ProductOrder from "@/components/sections/ProductOrder";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/sections/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VideoSection />
        <ProcessTimeline />
        <Differentiators />
        <WhyKankrej />
        <Benefits />
        <Testimonials />
        <ProductOrder />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
