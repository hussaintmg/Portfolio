import { motion } from "framer-motion";

export default function RevealSection({ children, trigger = "scroll" }) {
  const commonProps = {
    initial: { opacity: 0, y: 80 },
    transition: { duration: 0.8, ease: "easeOut" },
  };

  return (
    <motion.div
      {...commonProps}
      animate={trigger === "load" ? { opacity: 1, y: 0 } : undefined}
      whileInView={trigger === "scroll" ? { opacity: 1, y: 0 } : undefined}
      viewport={trigger === "scroll" ? { once: false, amount: 0.2 } : undefined}
    >
      {children}
    </motion.div>
  );
}
