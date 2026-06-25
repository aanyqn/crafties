import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CategorySection from "@/components/CategorySection";
import PopularProducts from "@/components/PopularProducts";
import ArticlesSection from "@/components/ArticlesSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSlider />
        <CategorySection />
        <PopularProducts />
        <ArticlesSection />
      </main>
      <Footer />
    </>
  );
}
