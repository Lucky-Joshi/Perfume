import { useMemo, useEffect } from 'react';
import CategoryBanner from '../components/CategoryBanner';
import SectionTitle from '../components/SectionTitle';
import ProductGrid from '../components/ProductGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useProducts } from '../context/ProductContext';
import useScrollReveal from '../hooks/useScrollReveal';
import styles from './CategoryPage.module.css';

function CategoryPage({ category, title, subtitle, banner, description }) {
  const { byGender, loading } = useProducts();
  const products = useMemo(() => byGender(category), [byGender, category]);
  const gridRef = useScrollReveal();

  useEffect(() => {
    document.title = `${title} Collection | Essence Aura`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', `Discover the ${title.toLowerCase()} perfume collection at Essence Aura. ${description}`);
    }
  }, [title, description]);

  return (
    <div className="page-wrapper">
      <CategoryBanner
        eyebrow={`${title} Fragrances`}
        title={title}
        subtitle={subtitle}
        image={banner}
        link="#collection"
        btnText="Shop Collection"
      />

      <section id="collection" className="section">
        <div className="container">
          <SectionTitle
            eyebrow={`${title} Edition`}
            title={`The ${title} Collection`}
            subtitle={description}
          />

          {loading ? (
            <LoadingSkeleton count={8} />
          ) : products.length ? (
            <div ref={gridRef} className={styles.products}>
              <ProductGrid products={products} />
            </div>
          ) : (
            <div ref={gridRef} className={styles.products}>
              <p className={styles.empty}>No fragrances found in this collection yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default CategoryPage;