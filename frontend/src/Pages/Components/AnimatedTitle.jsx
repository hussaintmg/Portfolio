import { motion } from "framer-motion";

export default function AnimatedTitle({ children }) {
  return (
    <div style={{ textAlign: "center", width: "100%" }}>
      <div style={{ display: "inline-block", position: "relative",}}>
        <h2 style={{ fontSize: "45px" }}>{children}</h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            position: "absolute",
            bottom: "-5px",
            transform: "translateX(-50%)",
            width: "100%",
            height: "3px",
            background: "#0f8f44ff",
            transformOrigin: "center",
          }}
        />
      </div>
    </div>
  );
}
