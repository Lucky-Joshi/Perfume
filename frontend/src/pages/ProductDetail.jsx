import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import productsAPI from '../api/productsAPI';
import reviewsAPI from '../api/reviewsAPI';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatMoney, formatDate, initials } from '../utils/format';
import LoadingSkeleton from '../components/LoadingSkeleton';
import styles from './ProductDetail.module.css';

const CATEGORY_LABELS = { men: 'Men', women: 'Women', unisex: 'Unisex' };

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [reviews, setReviews] = useState({ list: [], meta: { total: 0 } });
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewError, setReviewError] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = await productsAPI.getByIdentifier(id);
      setProduct(p);
      setSelectedSize(p.sizes?.[0] || '');
      const r = await reviewsAPI.forProduct(p.id, { limit: 20 });
      setReviews({ list: r?.list ?? r, meta: r?.meta ?? { total: (r?.list ?? r)?.length || 0 } });
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (product) document.title = `${product.name} | Essence Aura`;
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, selectedSize);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewError('');
    setSubmittingReview(true);
    try {
      await reviewsAPI.add(product.id, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      const r = await reviewsAPI.forProduct(product.id, { limit: 20 });
      setReviews({ list: r?.list ?? r, meta: r?.meta ?? { total: (r?.list ?? r)?.length || 0 } });
    } catch (err) {
      setReviewError(err.message || 'Could not submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className="container">
          <LoadingSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className="container" style={{ textAlign: 'center', padding: '120px 20px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28 }}>Product Not Found</h2>
          <p style={{ color: 'var(--color-text-light)', margin: '14px 0 24px' }}>This perfume may have been discontinued.</p>
          <Link to="/men" className={styles.btn}>Back to Collection</Link>
        </div>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length ? product.images : [product.image];

  return (
    <div className={styles.page}>
      <div className="container">
        <nav className={styles.breadcrumb}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/${product.category}`}>{CATEGORY_LABELS[product.category] || product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className={styles.top}>
          <div className={styles.gallery}>
            <div className={styles.mainImageWrap}>
              {images[activeImage] ? (
                <img src={images[activeImage]} alt={product.name} className={styles.mainImage} />
              ) : (
                <div className={styles.noImage}>No image available</div>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.thumbs}>
                {images.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className={styles.info}>
            {product.badge && <span className={styles.badge}>{product.badge}</span>}
            <h1 className={styles.name}>{product.name}</h1>
            <div className={styles.meta}>
              <span className={styles.rating}>
                {'★'.repeat(Math.round(product.rating))}
                <span className={styles.ratingDim}>{'★'.repeat(5 - Math.round(product.rating))}</span>
              </span>
              <span className={styles.ratingText}>{product.rating.toFixed(1)}</span>
              <span className={styles.reviewCount}>({product.reviewsCount || Math.max(reviews.meta?.total || 0, reviews.list?.length || 0)} reviews)</span>
            </div>

            <div className={styles.priceRow}>
              <span className={styles.price}>{formatMoney(product.price)}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>{formatMoney(product.originalPrice)}</span>
              )}
            </div>

            <p className={styles.description}>{product.description}</p>

            {product.sizes?.length > 0 && (
              <div className={styles.sizes}>
                <span className={styles.label}>Size</span>
                <div className={styles.sizeBtnRow}>
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeActive : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.availability}>
              <span className={product.stock > 0 ? styles.inStock : styles.outStock}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
              {product.stock > 0 && product.stock < 10 && (
                <span className={styles.lowStock}>Only {product.stock} left</span>
              )}
            </div>

            <button className={styles.addBtn} onClick={handleAddToCart} disabled={product.stock <= 0}>
              Add to Cart — {formatMoney(product.price)}
            </button>

            {product.fragranceNotes && (
              <div className={styles.notes}>
                <div className={styles.notesCol}>
                  <span className={styles.notesLabel}>Top Notes</span>
                  <p>{product.fragranceNotes.top?.join(', ') || '—'}</p>
                </div>
                <div className={styles.notesCol}>
                  <span className={styles.notesLabel}>Heart Notes</span>
                  <p>{product.fragranceNotes.heart?.join(', ') || '—'}</p>
                </div>
                <div className={styles.notesCol}>
                  <span className={styles.notesLabel}>Base Notes</span>
                  <p>{product.fragranceNotes.base?.join(', ') || '—'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <section className={styles.reviewsSection}>
          <h2 className={styles.sectionTitle}>Customer Reviews</h2>

          {reviews.list?.length ? (
            <div className={styles.reviewsList}>
              {reviews.list.map((review) => (
                <div className={styles.review} key={review.id}>
                  <div className={styles.reviewAvatar}>{initials(review.user_name)}</div>
                  <div className={styles.reviewBody}>
                    <div className={styles.reviewHead}>
                      <span className={styles.reviewAuthor}>{review.user_name || 'Anonymous'}</span>
                      <span className={styles.reviewStars}>
                        {'★'.repeat(Math.round(review.rating))}
                        <span className={styles.ratingDim}>{'★'.repeat(5 - Math.round(review.rating))}</span>
                      </span>
                      <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>
                    </div>
                    <p className={styles.reviewComment}>{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.noReviews}>No reviews yet. Be the first to review this fragrance.</p>
          )}

          <div className={styles.reviewFormCard}>
            <h3 className={styles.reviewFormTitle}>Write a Review</h3>
            {!user ? (
              <p className={styles.noReviews}>
                <Link to="/login" className={styles.link}>Login</Link> to leave a review.
              </p>
            ) : (
              <>
                {reviewError && <p className={styles.error}>{reviewError}</p>}
                <form onSubmit={handleReview} noValidate>
                  <div className={styles.field}>
                    <span className={styles.label}>Rating</span>
                    <div className={styles.starPicker}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          className={n <= reviewForm.rating ? styles.starOn : styles.starOff}
                          onClick={() => setReviewForm((prev) => ({ ...prev, rating: n }))}
                          aria-label={`${n} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="comment">Your Review *</label>
                    <textarea
                      id="comment"
                      rows="4"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                      placeholder="Share your experience with this fragrance..."
                      className={styles.textarea}
                    />
                  </div>
                  <button type="submit" className={styles.btn} disabled={submittingReview || reviewForm.comment.length < 5}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetail;