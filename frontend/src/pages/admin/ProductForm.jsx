import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { adminAPI } from '../../api/adminAPI';
import styles from './admin.module.css';

function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(!isEdit);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    brand: 'Essence Aura',
    category_id: '',
    gender: 'unisex',
    fragrance_family: '',
    top_notes: '',
    middle_notes: '',
    base_notes: '',
    sizes: '50ml, 100ml',
    stock: '20',
    featured: false,
    trending: false,
    best_seller: false
  });

  useEffect(() => {
    document.title = `${isEdit ? 'Edit' : 'New'} Product | Essence Aura Admin`;
    adminAPI.listCategories()
      .then(setCategories)
      .catch(() => {});

    if (isEdit) {
      adminAPI.listProducts({ limit: 1000 })
        .then((res) => {
          const product = (res.list || []).find((p) => String(p.id) === String(id));
          if (product) {
            setForm({
              name: product.name || '',
              description: product.description || '',
              price: product.price ?? '',
              discount_price: product.discount_price ?? '',
              brand: product.brand || 'Essence Aura',
              category_id: product.category_id ?? '',
              gender: product.gender || 'unisex',
              fragrance_family: product.fragrance_family || '',
              top_notes: (product.top_notes || []).join(', '),
              middle_notes: (product.middle_notes || []).join(', '),
              base_notes: (product.base_notes || []).join(', '),
              sizes: (product.sizes || []).join(', '),
              stock: product.stock ?? 0,
              featured: Boolean(product.featured),
              trending: Boolean(product.trending),
              best_seller: Boolean(product.best_seller)
            });
            if (Array.isArray(product.images)) setExistingImages(product.images);
          } else {
            setError('Product not found.');
          }
        })
        .catch((e) => setError(e.message || 'Failed to load product.'))
        .finally(() => setLoaded(true));
    }
  }, [isEdit, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (error) setError('');
  };

  const handleFiles = (e) => {
    setImageFiles(Array.from(e.target.files || []));
  };

  const removeExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Product name is required.');
      return;
    }
    if (!form.price) {
      setError('Price is required.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : 0,
      brand: form.brand.trim(),
      category_id: form.category_id || undefined,
      gender: form.gender,
      fragrance_family: form.fragrance_family.trim(),
      top_notes: form.top_notes,
      middle_notes: form.middle_notes,
      base_notes: form.base_notes,
      sizes: form.sizes,
      stock: Number(form.stock || 0),
      existingImages: existingImages.join(','),
      featured: form.featured,
      trending: form.trending,
      best_seller: form.best_seller
    };

    setSubmitting(true);
    setError('');
    try {
      if (isEdit) {
        await adminAPI.updateProduct(id, payload, imageFiles);
      } else {
        await adminAPI.createProduct(payload, imageFiles);
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.message || 'Failed to save product.');
      setSubmitting(false);
    }
  };

  if (!loaded) {
    return <div className={styles.empty}>Loading product...</div>;
  }

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1 className={styles.pageTitle}>{isEdit ? 'Edit Product' : 'New Product'}</h1>
          <p className={styles.pageSub}>
            <Link to="/admin/products" className={styles.btnLink}>Back to products</Link>
          </p>
        </div>
      </div>

      {error && <div className={`${styles.message} ${styles.fail}`}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.card}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 18 }}>Basic Information</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Name *</label>
              <input className={styles.input} style={{ width: '100%' }} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Amber Noir" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Brand</label>
              <input className={styles.input} style={{ width: '100%' }} name="brand" value={form.brand} onChange={handleChange} />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Description</label>
            <textarea
              className={styles.textarea}
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Fragrance story and character..."
            />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Price (USD) *</label>
              <input className={styles.input} style={{ width: '100%' }} type="number" min="0" step="0.01" name="price" value={form.price} onChange={handleChange} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Discount Price (USD)</label>
              <input className={styles.input} style={{ width: '100%' }} type="number" min="0" step="0.01" name="discount_price" value={form.discount_price} onChange={handleChange} placeholder="Optional" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Gender</label>
              <select className={styles.input} style={{ width: '100%' }} name="gender" value={form.gender} onChange={handleChange}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Category</label>
              <select className={styles.input} style={{ width: '100%' }} name="category_id" value={form.category_id} onChange={handleChange}>
                <option value="">— None —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Fragrance Family</label>
            <input className={styles.input} style={{ width: '100%' }} name="fragrance_family" value={form.fragrance_family} onChange={handleChange} placeholder="e.g. Amber, Woody, Floral" />
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Top Notes</label>
              <input className={styles.input} style={{ width: '100%' }} name="top_notes" value={form.top_notes} onChange={handleChange} placeholder="Comma separated" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Middle Notes</label>
              <input className={styles.input} style={{ width: '100%' }} name="middle_notes" value={form.middle_notes} onChange={handleChange} placeholder="Comma separated" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Base Notes</label>
              <input className={styles.input} style={{ width: '100%' }} name="base_notes" value={form.base_notes} onChange={handleChange} placeholder="Comma separated" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Sizes</label>
              <input className={styles.input} style={{ width: '100%' }} name="sizes" value={form.sizes} onChange={handleChange} placeholder="50ml, 100ml" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Stock Quantity</label>
            <input className={styles.input} style={{ width: '100%' }} type="number" min="0" name="stock" value={form.stock} onChange={handleChange} />
          </div>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 18 }}>Images</h2>
          {existingImages.length > 0 && (
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
              {existingImages.map((img) => (
                <div key={img} style={{ position: 'relative' }}>
                  <img src={img} alt="" style={{ width: 96, height: 128, objectFit: 'cover', borderRadius: 4, border: '1px solid var(--color-border)' }} />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img)}
                    style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: '50%', border: 'none', background: '#c62828', color: 'white', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                    title="Remove image"
                  >×</button>
                </div>
              ))}
            </div>
          )}
          <label className={styles.formLabel}>Upload New Images</label>
          <input type="file" accept="image/*" multiple onChange={handleFiles} />
          {imageFiles.length > 0 && (
            <div className={styles.cellSub} style={{ marginTop: 8 }}>{imageFiles.length} file(s) to upload</div>
          )}
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle} style={{ marginBottom: 18 }}>Flags</h2>
          <div className={styles.formRow} style={{ gap: 32 }}>
            {[
              ['featured', 'Featured'],
              ['trending', 'Trending'],
              ['best_seller', 'Best Seller']
            ].map(([key, label]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" className={styles.btn} style={{ background: 'var(--color-accent)' }} disabled={submitting}>
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <Link to="/admin/products" className={`${styles.btn} ${styles.btnOutline}`}>Cancel</Link>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;