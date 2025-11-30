import { useEffect, useRef, useState } from 'react';

interface ScalingBlockWrapperProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
}

export function ScalingBlockWrapper({ 
  children, 
  minScale = 0.3,
  maxScale = 1 
}: ScalingBlockWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (!containerRef.current || !contentRef.current) return;

      const container = containerRef.current;
      const content = contentRef.current;

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      const contentWidth = content.scrollWidth;
      const contentHeight = content.scrollHeight;

      // Calculate scale to fit both width and height
      const scaleX = containerWidth / contentWidth;
      const scaleY = containerHeight / contentHeight;
      const newScale = Math.min(scaleX, scaleY, maxScale);

      // Apply min/max constraints
      const constrainedScale = Math.max(minScale, Math.min(maxScale, newScale));
      
      setScale(constrainedScale);
    };

    // Calculate on mount and when content changes
    calculateScale();

    // Use MutationObserver to detect content changes (like "well done" messages)
    const mutationObserver = new MutationObserver(calculateScale);
    if (contentRef.current) {
      mutationObserver.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }

    // Recalculate on window resize
    const resizeObserver = new ResizeObserver(calculateScale);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [children, minScale, maxScale]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex items-center justify-center overflow-hidden"
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease-out',
        }}
      >
        {children}
      </div>
    </div>
  );
}