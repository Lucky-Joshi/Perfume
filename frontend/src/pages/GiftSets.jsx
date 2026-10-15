import { useEffect } from 'react';
import CategoryBanner from '../components/CategoryBanner';
import SectionTitle from '../components/SectionTitle';
import { useCart } from '../context/CartContext';
import useScrollReveal from '../hooks/useScrollReveal';
import giftSets from '../data/giftSets';
import styles from './GiftSets.module.css';

function GiftSets() {
  const { addToCart } = useCart();
  const gridRef = useScrollReveal();

  useEffect(() => {
    document.title = 'Gift Sets | Essence Aura';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Explore Essence Aura premium gift sets — beautifully packaged collections perfect for every occasion.');
    }
  }, []);

  const handleBuy = (set) => {
    addToCart({
      id: set.id,
      name: set.name,
      price: set.price,
      image: set.image,
      sizes: ['Gift Set']
    });
  };

  return (
    <div className="page-wrapper">
      <CategoryBanner
        eyebrow="Curated for Gifting"
        title="Premium Gift Sets"
        subtitle="Beautifully packaged collections for every occasion, from birthdays to milestone celebrations."
        image="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=1920&h=900&fit=crop"
        link="#gift-sets"
        btnText="Explore Sets"
      />

      <section id="gift-sets" className="section">
        <div className="container">
          <SectionTitle
            eyebrow="The Gift of Luxury"
            title="Signature Gift Sets"
            subtitle="Each set arrives in our signature packaging, ready to impress before it's even opened."
          />

          <div ref={gridRef} className={styles.grid}>
            {giftSets.map(set => (
              <article className={styles.card} key={set.id}>
                <div className={styles.imageWrap}>
                  <img
                    src={set.image}
                    alt={set.name}
                    className={styles.image}
                    loading="lazy"
                  />
                  {set.badge && <span className={styles.badge}>{set.badge}</span>}
                </div>

                <div className={styles.content}>
                  <h3 className={styles.name}>{set.name}</h3>
                  <p className={styles.description}>{set.description}</p>

                  <div className={styles.pricing}>
                    <span className={styles.price}>${set.price.toFixed(2)}</span>
                    {set.originalPrice && (
                      <span className={styles.originalPrice}>${set.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  <div className={styles.details}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Contents</span>
                      <ul className={styles.contents}>
                        {set.contents.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Occasion</span>
                      <span className={styles.detailValue}>{set.occasion}</span>
                    </div>

                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Packaging</span>
                      <span className={styles.detailValue}>{set.packaging}</span>
                    </div>
                  </div>

                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i < Math.round(set.rating) ? '#D4AF37' : 'none'} stroke="#D4AF37" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>

                  <button className={styles.buyBtn} onClick={() => handleBuy(set)}>
                    Buy Now
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default GiftSets;