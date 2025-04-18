import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Fortune, FortuneCategoryType } from "@shared/schema";
import { modalVariants, backdropVariants } from "@/lib/animations";

const categoryIcons: Record<FortuneCategoryType, string> = {
  love: "fa-heart",
  career: "fa-briefcase",
  general: "fa-star"
};

interface FortuneModalProps {
  fortune: Fortune;
  onClose: () => void;
  onSave: () => void;
}

export function FortuneModal({ fortune, onClose, onSave }: FortuneModalProps) {
  return (
    <motion.div 
      className="fixed inset-0 bg-purple-950/80 flex items-center justify-center z-50"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div 
        className="w-11/12 max-w-md bg-purple-950 rounded-lg shadow-2xl border border-amber-500 p-6 transform transition-all"
        variants={modalVariants}
      >
        <div className="text-right mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-amber-500"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </Button>
        </div>
        
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-purple-900">
            <i className={`fas ${categoryIcons[fortune.category as FortuneCategoryType]} text-amber-500 text-2xl`}></i>
          </div>
          
          <h3 className="font-['Cinzel'] text-2xl text-amber-500 mb-2">{fortune.title}</h3>
          <p className="mb-6 text-white">{fortune.content}</p>
          
          <div className="flex justify-center space-x-6 mb-4">
            <Button 
              variant="ghost" 
              className="text-teal-500 hover:text-teal-400 flex items-center"
              onClick={onSave}
            >
              <i className="fas fa-bookmark mr-1"></i> Save
            </Button>
            <Button 
              variant="ghost" 
              className="text-teal-500 hover:text-teal-400 flex items-center"
            >
              <i className="fas fa-share-alt mr-1"></i> Share
            </Button>
          </div>
          
          <div className="text-xs text-white/60">
            <p>Fortune revealed on {formatDate(new Date())}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
