"use client";

import { motion } from "framer-motion";

/**
 * MotionWrapper
 * @param {Object} props
 * @param {React.ReactNode} props.children - le contenu à animer
 * @param {number} [props.delay=0] - délai avant l'animation
 * @param {number} [props.duration=0.5] - durée de l'animation
 * @param {number[]} [props.y=[10,0]] - déplacement vertical
 * @param {number[]} [props.opacity=[0,1]] - opacité initiale → finale
 * @param {string} [props.className] - classes tailwind supplémentaires
 */
export default function MotionWrapper({
  children,
  delay = 0,
  duration = 0.5,
  y = [10, 0],
  opacity = [0, 1],
  className = "",
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: opacity[0], y: y[0] }}
      animate={{ opacity: opacity[1], y: y[1] }}
      transition={{ duration, delay }}>
      {children}
    </motion.div>
  );
}
