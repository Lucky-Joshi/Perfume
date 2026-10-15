import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Hero from '../components/Hero';
import SectionTitle from '../components/SectionTitle';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import FeatureCard from '../components/FeatureCard';
import Testimonials from '../components/Testimonials';
import { useProducts } from '../context/ProductContext';
import useScrollReveal from '../hooks/useScrollReveal';
import styles from './Home.module.css';

const featureIcons = {
  craft: (
    <>
      <path d="M10 2L14 6H10V2zM6.5 22a5.5 5.5 0 10-2-10.6M16 18.5a2.5 2.5 0 00-2.5-2.5M6 18a4 4 0 004 4h5a3 3 0 003-3"/>
      <circle cx="18" cy="12" r="4"/>
      <path d="M19 13l-1.5 1.5L20 17l2.5-2.5"/>
    </>
  ),
  ingredients: (
    <>
      <path d="M12 22a7 7 0 005-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a7 7 0 005 12z"/>
      <path d="M9 2h6M8 21h8"/>
    </>
  ),
  delivery: (
    <>
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </>
  ),
  authentication: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <polyline points="9 12 11 14 15 10"/>
    </>
  )
};

function Home() {
  const { featured, featuredLoading } = useProducts();
  const aboutRef = useScrollReveal();
  const featuresRef = useScrollReveal();

  useEffect(() => {
    document.title = 'Essence Aura | Luxury in Every Drop';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', "Essence Aura - Luxury in Every Drop. Discover our premium collection of men's, women's, and unisex perfumes, gift sets and more.");
    }
  }, []);

  return (
    <div className="page-wrapper">
      <Hero />

      {/* About Us */}
      <section className={`section ${styles.about}`} ref={aboutRef}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <span className={styles.eyebrow}>About Us</span>
              <h2 className={styles.aboutTitle}>The Art of Extraordinary Fragrance</h2>
              <p className={styles.aboutParagraph}>
                <strong>Essence Aura</strong> is a luxury olfactory house dedicated to crafting
                perfumes that transcend the everyday. Our business is built on a simple belief:
                that a great fragrance is not an accessory, but an extension of your identity.
              </p>
              <p className={styles.aboutParagraph}>
                Born from a passion for rare ingredients and timeless composition, we blend
                hand-selected essences from Grasse, Mysore, and Agarwood forests to create
                scents that linger in the memory long after you leave the room.
              </p>

              <div className={styles.missionGrid}>
                <div className={styles.missionCard}>
                  <h3 className={styles.missionTitle}>Our Mission</h3>
                  <p className={styles.missionText}>
                    To make world-class fragrance accessible to those who appreciate the
                    finer things in life, without compromise on quality or character.
                  </p>
                </div>
                <div className={styles.missionCard}>
                  <h3 className={styles.missionTitle}>Our Vision</h3>
                  <p className={styles.missionText}>
                    To become the world's most cherished independent fragrance house —
                    known for integrity, artistry, and unforgettable scents.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.aboutImageWrap}>
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&h=800&fit=crop"
                alt="Essence Aura perfume craftsmanship"
                className={styles.aboutImage}
                loading="lazy"
              />
              <div className={styles.aboutBadge}>
                <span className={styles.aboutBadgeYear}>8+</span>
                <span className={styles.aboutBadgeText}>Years of<br/>Perfume Artistry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section--alt" ref={featuresRef}>
        <div className="container">
          <SectionTitle
            eyebrow="Why Choose Us"
            title="The Essence Aura Difference"
            subtitle="Every bottle in our collection is a testament to our commitment to luxury, quality, and soul."
          />
          <div className={styles.featuresGrid}>
            <FeatureCard
              icon={featureIcons.craft}
              title="Expert Craftsmanship"
              description="Each fragrance is composed by master perfumers with over 20 years of experience in the world's finest fragrance houses."
            />
            <FeatureCard
              icon={featureIcons.ingredients}
              title="Rare Ingredients"
              description="From Grasse jasmine to Cambodian oud, we source only the most precious and ethically harvested raw materials."
            />
            <FeatureCard
              icon={featureIcons.delivery}
              title="Luxury Packaging"
              description="Every order arrives in our signature gold-embossed box, ready to be unwrapped like the treasure it contains."
            />
            <FeatureCard
              icon={featureIcons.authentication}
              title="Certified Authenticity"
              description="Every bottle is serial-numbered and certified, guaranteeing you an authentic Essence Aura creation."
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="Featured Collection"
            title="Our Bestsellers"
            subtitle="Handpicked signature scents loved by our most discerning customers around the world."
          />
          <div className={styles.featuredWrap}>
            {featuredLoading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <ProductGrid products={featured} />
            )}
          </div>
          <div className={styles.centerBtn}>
            <Link to="/men" className={styles.viewAllBtn}>
              View All Collections
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
    </div>
  );
}

export default Home;