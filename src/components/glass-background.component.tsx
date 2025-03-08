import { motion } from "framer-motion";
import styled from "styled-components";

const GlassmorphicBackground = () => {
  return (
    <GlassContainer>
      <GlassLayer
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: "easeOut",
          },
        }}
        whileHover={{
          scale: 1.02,
          transition: { duration: 0.3 },
        }}
      >
        <BlurLayer />
      </GlassLayer>
    </GlassContainer>
  );
};

const GlassContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1),
    rgba(255, 255, 255, 0)
  );
  overflow: hidden;
`;

const GlassLayer = styled(motion.div)`
  width: 80%;
  height: 80%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
`;

const BlurLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: inherit;
  backdrop-filter: blur(10px);
  z-index: -1;
`;

export default GlassmorphicBackground;
