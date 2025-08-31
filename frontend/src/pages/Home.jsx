import Header from "../sections/Header.jsx";
import Hero from "../sections/Hero.jsx";
import Features from "../sections/Features.jsx";
import Faq from "../sections/Faq.jsx";

import Footer from "../sections/Footer.jsx";
import Resource from "../sections/Resource.jsx";

export default function Home() {
  return (
   <main className="overflow-hidden">
      <Header />
      <Hero />
      <Features />
      <Faq />
      <Resource/>
      <Footer />
    </main>
  );
}
