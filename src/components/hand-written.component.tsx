import React, { useMemo } from "react";
import { motion } from "framer-motion";

interface AnimatedTextProps {
  text: string;
  onComplete?: () => void;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
  ease?: number[];
  className?: string;
  type?: "words" | "letters" | "lines";
}

// Компонент анимированного текста
const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  onComplete,
  delay = 0,
  duration = 0.8,
  staggerDelay = 0.04,
  ease = [0.2, 0.65, 0.3, 0.9],
  className = "",
  type = "letters", // 'words' или 'letters' или 'lines'
  ...props
}) => {
  // Обработка текста в зависимости от выбранного типа анимации
  const items = useMemo(() => {
    if (type === "words") return text.split(" ");
    if (type === "letters") return Array.from(text);
    if (type === "lines") return text.split("\n");
    return [text]; // Fallback
  }, [text, type]);

  // Конфигурация анимации для контейнера
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  // Конфигурация анимации для отдельных элементов
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration,
        ease,
      },
    },
  };

  return (
    <motion.div
      className={`animated-text-container ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          className="animated-item"
          variants={itemVariants}
          style={{
            display: "inline-block",
            marginRight: type === "letters" ? "0.3rem" : "0.25em",
            whiteSpace: type === "lines" ? "pre" : "normal",
          }}
          aria-hidden={type === "letters" ? "true" : "false"}
          onAnimationComplete={() => {
            if (index == item.length - 1 && onComplete) {
              onComplete();
            }
          }}
        >
          {item === "-" ? " " : item}
          {type === "letters" && index !== items.length - 1 && " "}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;
