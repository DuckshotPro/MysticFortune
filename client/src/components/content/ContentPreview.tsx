
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSyncAlt, 
  faCalendarAlt, 
  faStar, 
  faLeaf, 
  faSnowflake, 
  faSun, 
  faMaple,
  faEye,
  faHeart,
  faBriefcase
} from "@fortawesome/free-solid-svg-icons";
import { getCurrentSeason, getDayTheme, getWeeklyPreview, getSeasonalFortune } from "@/lib/contentRotation";
import { generateRandomFortune } from "@/lib/fortuneGenerator";
import { FortuneCategoryType } from "@shared/schema";

const seasonIcons = {
  spring: faLeaf,
  summer: faSun,
  autumn: faMaple,
  winter: faSnowflake
};

const categoryIcons = {
  love: faHeart,
  career: faBriefcase,
  general: faStar
};

export default function ContentPreview() {
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategoryType>('general');
  const [refreshKey, setRefreshKey] = useState(0);
  
  const currentSeason = getCurrentSeason();
  const dayTheme = getDayTheme();
  const weeklyPreview = getWeeklyPreview();

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const sampleFortune = generateRandomFortune(selectedCategory);
  const seasonalFortune = getSeasonalFortune(selectedCategory);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-purple-950 via-purple-900 to-indigo-950">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-['Cinzel'] text-3xl md:text-4xl text-amber-500 mb-4">
            Endless Mystical Content
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover fresh insights daily with our dynamic content system. 
            New fortunes, themes, and cosmic guidance updated continuously.
          </p>
        </motion.div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid grid-cols-4 bg-purple-900/50 mb-8">
            <TabsTrigger value="daily" className="text-white">Daily Themes</TabsTrigger>
            <TabsTrigger value="seasonal" className="text-white">Seasonal Content</TabsTrigger>
            <TabsTrigger value="variety" className="text-white">Fortune Variety</TabsTrigger>
            <TabsTrigger value="preview" className="text-white">Weekly Preview</TabsTrigger>
          </TabsList>

          {/* Daily Themes */}
          <TabsContent value="daily" className="space-y-6">
            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-500">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Today's Theme: {dayTheme.theme}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {dayTheme.focus} - Energy: {dayTheme.energy}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {(['love', 'career', 'general'] as FortuneCategoryType[]).map(category => {
                    const fortune = getSeasonalFortune(category);
                    return (
                      <Card key={category} className="bg-purple-800/50 border-amber-500/20">
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon 
                              icon={categoryIcons[category]} 
                              className="text-amber-500" 
                            />
                            <span className="font-['Cinzel'] text-amber-500 capitalize">
                              {category}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <h4 className="font-semibold text-white mb-2">{fortune.title}</h4>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {fortune.content.slice(0, 120)}...
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seasonal Content */}
          <TabsContent value="seasonal" className="space-y-6">
            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-amber-500">
                  <FontAwesomeIcon icon={seasonIcons[currentSeason]} />
                  Current Season: {currentSeason.charAt(0).toUpperCase() + currentSeason.slice(1)}
                </CardTitle>
                <CardDescription className="text-white/70">
                  Seasonal content automatically adapts to cosmic energies throughout the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-['Cinzel'] text-amber-500 mb-3">
                      Spring Content Examples
                    </h4>
                    <div className="space-y-3">
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        "Blossoming Romance" - New love enters with natural timing
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        "Professional Growth Spurt" - Career rapid development
                      </Badge>
                      <Badge variant="outline" className="border-green-500 text-green-400">
                        "Life Renewal" - Personal renaissance begins
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-['Cinzel'] text-amber-500 mb-3">
                      Winter Content Examples
                    </h4>
                    <div className="space-y-3">
                      <Badge variant="outline" className="border-blue-400 text-blue-300">
                        "Deep Intimacy" - Relationships foster profound connections
                      </Badge>
                      <Badge variant="outline" className="border-blue-400 text-blue-300">
                        "Inner Strength" - Challenges develop resilience
                      </Badge>
                      <Badge variant="outline" className="border-blue-400 text-blue-300">
                        "Spiritual Depth" - Introspective energy leads to insights
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fortune Variety */}
          <TabsContent value="variety" className="space-y-6">
            <div className="flex justify-center gap-4 mb-6">
              {(['love', 'career', 'general'] as FortuneCategoryType[]).map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  <FontAwesomeIcon icon={categoryIcons[category]} className="mr-2" />
                  {category}
                </Button>
              ))}
            </div>

            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-amber-500">
                    Sample {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Fortunes
                  </CardTitle>
                  <Button onClick={handleRefresh} variant="outline" size="sm">
                    <FontAwesomeIcon icon={faSyncAlt} className="mr-2" />
                    Refresh
                  </Button>
                </div>
                <CardDescription className="text-white/70">
                  See how our content varies with each generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6" key={refreshKey}>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-amber-400">Standard Fortune:</h4>
                    <Card className="bg-purple-800/50 border-amber-500/20 p-4">
                      <h5 className="font-['Cinzel'] text-white mb-2">{sampleFortune.title}</h5>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {sampleFortune.content}
                      </p>
                    </Card>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-amber-400">Seasonal Enhanced:</h4>
                    <Card className="bg-purple-800/50 border-amber-500/20 p-4">
                      <h5 className="font-['Cinzel'] text-white mb-2">{seasonalFortune.title}</h5>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {seasonalFortune.content}
                      </p>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly Preview */}
          <TabsContent value="preview" className="space-y-6">
            <Card className="bg-purple-900/30 border-amber-500/30">
              <CardHeader>
                <CardTitle className="text-amber-500">This Week's Cosmic Journey</CardTitle>
                <CardDescription className="text-white/70">
                  Each day brings unique themes and energies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {weeklyPreview.map((day, index) => (
                    <Card 
                      key={day.day} 
                      className={`bg-purple-800/50 border-amber-500/20 ${
                        new Date().getDay() === (index + 1) % 7 ? 'ring-2 ring-amber-500' : ''
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FontAwesomeIcon icon={faEye} className="text-amber-500" />
                          <span className="font-['Cinzel'] text-amber-500">{day.day}</span>
                        </div>
                        <h4 className="font-semibold text-white mb-1">{day.theme}</h4>
                        <p className="text-white/70 text-xs mb-2">{day.focus}</p>
                        <Badge variant="secondary" className="text-xs">
                          {day.energy}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Content Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Card className="bg-purple-900/30 border-amber-500/30">
            <CardContent className="p-6">
              <h3 className="font-['Cinzel'] text-xl text-amber-500 mb-4">
                Content Freshness Guarantee
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">500+</div>
                  <div className="text-white/70 text-sm">Unique Fortunes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">7</div>
                  <div className="text-white/70 text-sm">Daily Themes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">4</div>
                  <div className="text-white/70 text-sm">Seasonal Variants</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-white/70 text-sm">Combinations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
