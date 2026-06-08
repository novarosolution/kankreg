import React from "react";
import SectionReveal from "../motion/SectionReveal";
import KankregResponsiveGrid from "./KankregResponsiveGrid";
import useStaggeredReveal from "../../hooks/useStaggeredReveal";
import { motionStagger } from "../../theme/motion";

/**
 * Product/catalog grid with capped staggered reveals per child.
 */
export default function CatalogGridReveal({ children, variant = "catalog", style, gridStyle }) {
  const childArray = React.Children.toArray(children).filter(Boolean);
  const delays = useStaggeredReveal(childArray.length, {
    gap: motionStagger.gap,
    initialDelay: motionStagger.initialDelay,
  });

  return (
    <KankregResponsiveGrid variant={variant} style={[style, gridStyle]}>
      {childArray.map((child, i) => (
        <SectionReveal key={child.key ?? `grid-${i}`} delay={delays[i]} preset="fade-up">
          {child}
        </SectionReveal>
      ))}
    </KankregResponsiveGrid>
  );
}
