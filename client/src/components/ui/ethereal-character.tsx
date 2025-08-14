import { motion } from "framer-motion";

// Import ethereal character images
import etherealFigure1 from "@assets/generated_images/Ethereal_fortune_teller_figure_dd1645ae.png";
import etherealFigure2 from "@assets/generated_images/Mystical_tarot_reader_portrait_1cd6954d.png";
import etherealFigure3 from "@assets/generated_images/Crystal_ball_fortune_reader_b0c2a4eb.png";
import etherealFigure4 from "@assets/generated_images/Horoscope_mystic_guide_8fb8eb98.png";

const etherealImages = [etherealFigure1, etherealFigure2, etherealFigure3, etherealFigure4];

interface EtherealCharacterProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: number; // 0-3 for different characters
  animate?: boolean;
}

export function EtherealCharacter({ 
  className = "", 
  size = "md", 
  variant = 0, 
  animate = true 
}: EtherealCharacterProps) {
  const sizeClasses = {
    sm: "w-16 h-20",
    md: "w-24 h-30", 
    lg: "w-32 h-40"
  };

  const imageIndex = Math.max(0, Math.min(3, variant));
  const selectedImage = etherealImages[imageIndex];

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-lg`}
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.img
        src={selectedImage}
        alt="Ethereal fortune teller"
        className="w-full h-full object-cover rounded-lg shadow-lg"
        animate={animate ? {
          filter: ["brightness(1) contrast(1)", "brightness(1.1) contrast(1.1)", "brightness(1) contrast(1)"]
        } : undefined}
        transition={animate ? {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined}
      />
      
      {/* Ethereal glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-amber-200/20 rounded-lg pointer-events-none"
        animate={animate ? {
          opacity: [0.3, 0.6, 0.3]
        } : undefined}
        transition={animate ? {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        } : undefined}
      />
    </motion.div>
  );
}

export function getRandomEtherealVariant(): number {
  return Math.floor(Math.random() * 4);
}