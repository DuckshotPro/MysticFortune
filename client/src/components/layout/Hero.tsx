import { motion } from "framer-motion";
import { fadeIn } from "@/lib/animations";

export default function Hero() {
  return (
    <section className="py-12 px-4 bg-[url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-purple-950 bg-opacity-70"></div>
      <div className="container mx-auto relative z-10 text-center">
        <motion.h1 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="font-['Tangerine'] text-5xl md:text-7xl mb-3 text-amber-500"
        >
          Discover Your Destiny
        </motion.h1>
        
        <motion.p 
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={1}
          className="font-['Cinzel'] text-lg md:text-xl max-w-2xl mx-auto mb-8"
        >
          Unlock the secrets of your future through our mystical fortune telling experience
        </motion.p>
        
        <motion.a 
          href="#fortune-teller"
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          custom={2}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block bg-purple-900 hover:bg-opacity-90 text-white font-['Cinzel'] px-8 py-3 rounded-full border border-amber-500 shadow-lg transition-all hover:shadow-xl"
        >
          Begin Your Journey
        </motion.a>
      </div>
    </section>
  );
}
