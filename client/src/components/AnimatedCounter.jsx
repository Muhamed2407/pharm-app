import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const AnimatedCounter = ({ end, suffix = "", duration = 1.4 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(end * eased));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, end, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
