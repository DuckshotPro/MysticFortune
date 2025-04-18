import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";
import { fadeIn } from "@/lib/animations";
import { FortuneCategoryType } from "@shared/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faBriefcase, 
  faStar,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";

const categoryIcons: Record<FortuneCategoryType, any> = {
  love: { icon: faHeart, className: "text-rose-500" },
  career: { icon: faBriefcase, className: "text-teal-500" },
  general: { icon: faStar, className: "text-amber-500" }
};

export default function SavedFortunes() {
  const userId = 1; // In a real app, this would be the actual user ID
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  const { data: savedFortunes, isLoading } = useQuery({
    queryKey: ["/api/saved-fortunes", userId],
    queryFn: async ({ queryKey }) => {
      const [_, userId] = queryKey;
      const res = await fetch(`/api/saved-fortunes/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch saved fortunes");
      return res.json();
    }
  });
  
  const filteredFortunes = savedFortunes?.filter(
    (fortune: any) => categoryFilter === "all" || fortune.category === categoryFilter
  );
  
  return (
    <section id="favorites" className="py-16 px-4 bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950">
      <div className="container mx-auto">
        <motion.h2 
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="font-['Cinzel'] text-3xl md:text-4xl text-center mb-12 text-amber-500"
        >
          Your Saved Fortunes
        </motion.h2>
        
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-900/60 border-purple-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-['Cinzel'] text-xl text-amber-500">Fortune History</h3>
                <div className="text-sm">
                  <Select
                    value={categoryFilter}
                    onValueChange={(value) => setCategoryFilter(value)}
                  >
                    <SelectTrigger className="bg-purple-950 border-purple-800 w-[150px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-950 border-purple-800">
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="love">Love</SelectItem>
                      <SelectItem value="career">Career</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Spinner className="w-10 h-10 text-amber-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFortunes && filteredFortunes.length > 0 ? (
                    filteredFortunes.map((fortune: any) => (
                      <motion.div 
                        key={fortune.id}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="bg-purple-950/60 p-4 rounded-lg hover:bg-purple-900/80 transition-colors cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center">
                              <FontAwesomeIcon 
                                icon={categoryIcons[fortune.category as FortuneCategoryType].icon} 
                                className={`${categoryIcons[fortune.category as FortuneCategoryType].className} mr-2`} 
                              />
                              <h4 className="font-['Cinzel'] text-lg text-amber-500">{fortune.fortuneTitle}</h4>
                            </div>
                            <p className="mt-2 text-sm">{fortune.fortuneContent}</p>
                          </div>
                          <div className="text-xs text-white/60 whitespace-nowrap">
                            {formatDate(new Date(fortune.date))}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-white/70">
                      <p>No saved fortunes found. Discover new fortunes and save them for future reference!</p>
                    </div>
                  )}
                </div>
              )}
              
              {filteredFortunes && filteredFortunes.length > 0 && (
                <div className="mt-6 text-center">
                  <button className="text-amber-500 hover:text-amber-400 font-['Cinzel'] text-sm">
                    View All Saved Fortunes <FontAwesomeIcon icon={faArrowRight} className="ml-1" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
