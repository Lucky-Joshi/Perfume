import { useState, useEffect } from 'react';
import testimonials from '../data/testimonials';
import styles from './Testimonials.module.css';

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section
      className={`${styles.section} fade-in`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.quoteIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391C14.017 5.183 18.292 2.119 24 2v3.855c-2.083.586-3.5 2.252-3.5 4.145h3.5v11h-9.983zM0 21v-7.391c0-6.426 4.274-9.49 9.983-9.609v3.855c-2.083.586-3.5 2.252-3.5 4.145H9.983v11H0z"/>
            </svg>
          </div>
          <p key={activeIndex} className={styles.quote}>
            {testimonials[activeIndex].text}
          </p>
          <div className={styles.author}>
            <span className={styles.avatar}>{testimonials[activeIndex].avatar}</span>
            <div>
              <div className={styles.name}>{testimonials[activeIndex].name}</div>
              <div className={styles.role}>{testimonials[activeIndex].role}</div>
            </div>
          </div>
          <div className={styles.dots}>
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === activeIndex ? styles.activeDot : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Testimonials;