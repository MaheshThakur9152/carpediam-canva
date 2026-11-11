import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initImageReveals } from './ImageReveal';
import { initTextReveals } from './TextReveal';
import { initScrollReveals } from './ScrollReveal';
import { initHeaderAnimation } from './HeaderAnimation';
import { initPageTransitions } from './PageTransitions';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function initAnimations(): void {
  if (typeof window === 'undefined') return;

  // Clean up any stale ScrollTriggers
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  initHeaderAnimation();
  initImageReveals();
  initTextReveals();
  initScrollReveals();
  initPageTransitions();

  // Refresh ScrollTrigger after DOM adjustments
  ScrollTrigger.refresh();
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimations);
  } else {
    initAnimations();
  }
}
