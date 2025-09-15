import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Custom Text Splitter (chars only)
function splitTextToChars(element) {
  const text = element.innerText;
  element.innerHTML = text
    .split("")
    .map((char) =>
      char === " " ? `<span class="char">&nbsp;</span>` : `<span class="char">${char}</span>`
    )
    .join("");
  return element.querySelectorAll(".char");
}

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const ref = useRef(null);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Split into characters
    const chars = splitTextToChars(ref.current);

    const startPct = (1 - threshold) * 100;
    const start = `top ${startPct}%+=${rootMargin}`;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ref.current,
        start,
        toggleActions: "play none none none",
        once: true,
        onToggle: (self) => {
          scrollTriggerRef.current = self;
        },
      },
      onComplete: () => {
        onLetterAnimationComplete?.();
      },
    });

    tl.set(chars, { ...from });
    tl.to(chars, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
    });

    return () => {
      tl.kill();
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }
      gsap.killTweensOf(chars);
    };
  }, [
    delay,
    duration,
    ease,
    from,
    to,
    threshold,
    rootMargin,
    onLetterAnimationComplete,
  ]);

  return (
    <div style={{ textAlign }}>
      <p
        ref={ref}
        className={`split-parent ${className}`}
        style={{
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      >
        {text}
      </p>
    </div>
  );
};

export default SplitText;
