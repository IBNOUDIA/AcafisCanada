import React from "react";
import { motion, type Variants } from "motion/react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "section";
}

const buildVariants = (y: number): Variants => ({
  hidden: { opacity: 0, y },
  visible: { opacity: 1, y: 0 },
});

/**
 * Consistent fade + slide-up scroll reveal used across section headers and
 * card grids for a cohesive premium feel. Animates once when it enters the viewport.
 */
export const Reveal: React.FC<RevealProps> = ({
  children,
  className = "",
  delay = 0,
  y = 24,
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={buildVariants(y)}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

interface RevealGroupProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}

/**
 * Wraps a grid of cards and staggers each direct child's reveal animation.
 * Children should be simple elements (e.g. mapped array items).
 */
export const RevealGroup: React.FC<RevealGroupProps> = ({
  children,
  className = "",
  stagger = 0.08,
}) => {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger },
    },
  };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerVariants}
    >
      {React.Children.map(children, (child) => (
        <motion.div variants={buildVariants(20)} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
