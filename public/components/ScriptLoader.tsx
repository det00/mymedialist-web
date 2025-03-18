'use client';

import { useEffect } from 'react';

export default function ScriptLoader() {
  useEffect(() => {
    // Cargar scripts dinámicamente
    const scripts = [
      '/vendor/jquery/jquery.min.js',
      '/vendor/bootstrap/js/bootstrap.min.js',
      '/assets/js/isotope.min.js',
      '/assets/js/owl-carousel.js',
      '/assets/js/tabs.js',
      '/assets/js/popup.js',
      '/assets/js/custom.js',
    ];

    scripts.forEach((src) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    });

    // Limpieza (opcional)
    return () => {
      scripts.forEach((src) => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script) document.body.removeChild(script);
      });
    };
  }, []);

  return null; // No renderiza nada en el DOM
}