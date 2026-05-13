import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const InitAOS = () => {
   useEffect(() => {
      // Init AOS
      AOS.init({
         duration: 700,
         once: true,
         easing: 'ease-out-quart',
         offset: 60,
      });

      // Scroll progress bar
      const bar = document.getElementById('scroll-progress');
      const updateProgress = () => {
         if (!bar) return;
         const scrolled = window.scrollY;
         const total = document.documentElement.scrollHeight - window.innerHeight;
         bar.style.width = total > 0 ? `${(scrolled / total) * 100}%` : '0%';
      };
      window.addEventListener('scroll', updateProgress, { passive: true });

      // IntersectionObserver for .reveal* classes
      const observer = new IntersectionObserver(
         (entries) => {
            entries.forEach((e) => {
               if (e.isIntersecting) {
                  e.target.classList.add('visible');
                  observer.unobserve(e.target);
               }
            });
         },
         { threshold: 0.12 },
      );
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach((el) => {
         observer.observe(el);
      });

      // Counter animation for [data-count] elements
      const counterObs = new IntersectionObserver(
         (entries) => {
            entries.forEach((e) => {
               if (!e.isIntersecting) return;
               const el = e.target;
               const target = parseFloat(el.dataset.count);
               const suffix = el.dataset.suffix || '';
               const duration = 1400;
               const start = performance.now();
               const update = (now) => {
                  const progress = Math.min((now - start) / duration, 1);
                  const eased = 1 - Math.pow(1 - progress, 3);
                  el.textContent = Math.round(eased * target) + suffix;
                  if (progress < 1) requestAnimationFrame(update);
               };
               requestAnimationFrame(update);
               counterObs.unobserve(el);
            });
         },
         { threshold: 0.5 },
      );
      document.querySelectorAll('[data-count]').forEach((el) => counterObs.observe(el));

      return () => {
         window.removeEventListener('scroll', updateProgress);
      };
   }, []);

   return null;
};

export default InitAOS;
