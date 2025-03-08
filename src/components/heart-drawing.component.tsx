import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./HeartDrawing.css";
import AnimatedText from "./hand-written.component";
import img from "../assets/img/cover.jpg";
const HeartDrawing = () => {
  const [path, setPath] = useState("");
  const [key, setKey] = useState(0);

  const [startText, setStartText] = useState<boolean>(false);

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Мемоизированная функция генерации пути сердца
  const generateHeartPath = useCallback((width: number, height: number) => {
    const points = [];
    const numPoints = 200; // Увеличил количество точек для более плавной формы

    // Вычисляем масштаб для адаптации к размеру экрана
    // Учитываем отступы с обеих сторон
    const padding = Math.min(width, height) * 0.15;
    const scaleX = (width - padding * 2) / 32;
    const scaleY = (height - padding * 2) / 30;
    const scale = Math.min(scaleX, scaleY); // Сохраняем пропорции

    // Центрирование относительно экрана
    const centerX = width / 2;
    const centerY = height / 2;

    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * 2 * Math.PI;

      // Параметрическое уравнение сердца
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);

      // Масштабирование и центрирование
      const scaledX = centerX + x * scale;
      const scaledY = centerY - y * scale; // Инвертируем Y для правильной ориентации

      points.push(`${scaledX},${scaledY}`);
    }

    // Создаем SVG path и замыкаем форму
    return `M${points[0]} ${points
      .slice(1)
      .map((point) => `L${point}`)
      .join(" ")} Z`;
  }, []);

  // Обработчик изменения размеров окна
  const handleResize = useCallback(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  // Установка пути сердца и обработчика ресайза
  useEffect(() => {
    setPath(generateHeartPath(dimensions.width, dimensions.height));

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dimensions.width, dimensions.height, generateHeartPath, handleResize]);

  // Обновление пути при изменении размеров
  useEffect(() => {
    setPath(generateHeartPath(dimensions.width, dimensions.height));
  }, [dimensions, generateHeartPath]);

  // Перезапуск анимации
  const restartAnimation = useCallback(() => {
    setStartText(false);
    setKey((prevKey) => prevKey + 1);
  }, []);

  const handleOnHeartComplete = () => {
    setStartText(true);
  };

  // Варианты анимации для пути
  const pathVariants = {
    hidden: {
      pathLength: 0,
      fill: "rgba(255, 0, 0, 0)",
    },
    visible: {
      pathLength: 1,
      fill: "rgba(255, 0, 0, 0.7)",
      transition: {
        pathLength: { duration: 3, ease: "easeInOut" },
        fill: { duration: 2, delay: 2.5, ease: "easeInOut" },
      },
    },
    beat: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop" as const,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="heart-container">
      <motion.svg
        key={key}
        className="heart-svg"
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height + 200}`}
        initial="hidden"
        animate={`${startText ? "visible" : pathVariants["beat"]}`}
      >
        <motion.path
          d={path}
          variants={pathVariants}
          stroke="#ff0055"
          strokeWidth={Math.max(
            2,
            Math.min(dimensions.width, dimensions.height) / 200
          )}
          initial="hidden"
          animate="visible"
          fill="transparent"
          strokeLinecap="round"
          strokeLinejoin="round"
          onAnimationComplete={handleOnHeartComplete}
        />

        <motion.defs>
          <motion.clipPath id="customClipPath">
            <motion.path
              d={path}
              variants={pathVariants}
              stroke="#ff0055"
              strokeWidth={Math.max(
                2,
                Math.min(dimensions.width, dimensions.height) / 200
              )}
              initial="hidden"
              animate="visible"
              fill="transparent"
              strokeLinecap="round"
              strokeLinejoin="round"
              onAnimationComplete={handleOnHeartComplete}
            />
          </motion.clipPath>
        </motion.defs>

        {startText && (
          <motion.image
            animate="visible"
            variants={pathVariants}
            href={img}
            width="100%"
            height="100%"
            clipPath="url(#customClipPath)"
            style={{
              objectFit: "cover",
            }}
          />
        )}
      </motion.svg>
      {startText && (
        <AnimatedText text="С 8 марта, принцесса!" className="heart-title" />
      )}

      <div className="controls">
        {startText && (
          <AnimatedText text="Сияй!🖤" className="heart-discription" />
        )}
        <button className="replay-button" onClick={restartAnimation}>
          Нарисовать снова
        </button>
      </div>
      <span
        style={{
          position: "absolute",
          bottom: "1%",
          left: "1%",
          fontFamily: "roboto",
          color: "rgba(0,0,0,0.45)",
        }}
      >
        created by @vlim_nikitin
      </span>
    </div>
  );
};

export default HeartDrawing;
