import { useState, useCallback, useEffect, RefObject } from 'react';

/**
 * Hook para medir y observar el tamaño de un elemento
 * @param elementRef Referencia al elemento a medir
 * @returns Objeto con el ancho y alto del elemento
 */
export function useElementSize<T extends HTMLElement = HTMLDivElement>(
  elementRef: RefObject<T>
) {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // Callback para actualizar el tamaño
  const updateSize = useCallback(() => {
    const element = elementRef?.current;
    if (element) {
      const rect = element.getBoundingClientRect();
      setSize({
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
      });
    }
  }, [elementRef]);

  // Efecto para observar cambios en el tamaño
  useEffect(() => {
    if (!elementRef?.current) {
      return;
    }

    updateSize();

    // Usar ResizeObserver para detectar cambios en el tamaño
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    resizeObserver.observe(elementRef.current);

    // Limpiar observer al desmontar
    return () => {
      if (elementRef.current) {
        resizeObserver.unobserve(elementRef.current);
      }
      resizeObserver.disconnect();
    };
  }, [elementRef, updateSize]);

  return size;
}
