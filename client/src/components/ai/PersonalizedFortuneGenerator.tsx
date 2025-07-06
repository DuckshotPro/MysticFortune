import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface PersonalizedFortune {
  content: string;
  title: string;
  personalization: string;
}

export default function PersonalizedFortuneGenerator() {
  const [fortune, setFortune] = useState<PersonalizedFortune | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [category, setCategory] = useState("");
  const [preferences, setPreferences] = useState("");
  const { toast } = useToast();

  const generatePersonalizedFortune = async () => {
    if (!birthDate || !category) {
      toast({
        title: "Missing Information",
        description: "Please enter your birth date and select a category.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/personalized-fortune", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          userId: 1,
          birthDate,
          preferences: preferences.split(",").map(p => p.trim()).filter(Boolean),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate personalized fortune");
      }

      const result = await response.json();
      setFortune(result);
      
      toast({
        title: "Fortune Generated!",
        description: "Your personalized reading is ready.",
      });
    } catch (error) {
      console.error("Error generating personalized fortune:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate your personalized fortune. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-400" />
              AI Personalized Fortune
            </CardTitle>
            <CardDescription className="text-lg">
              Get a fortune tailored specifically to your cosmic energy and preferences
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-purple-900/20 border-purple-500/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Fortune Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-purple-900/20 border-purple-500/30">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="love">💕 Love & Relationships</SelectItem>
                    <SelectItem value="career">🌟 Career & Success</SelectItem>
                    <SelectItem value="general">✨ General Life Guidance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferences">Your Interests (comma-separated)</Label>
              <Input
                id="preferences"
                placeholder="e.g., spiritual growth, romance, creativity, success"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                className="bg-purple-900/20 border-purple-500/30"
              />
            </div>
            
            <Button 
              onClick={generatePersonalizedFortune}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consulting the AI Oracle...
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Generate My Personalized Fortune
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {fortune && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-indigo-300">
                  {fortune.title}
                </CardTitle>
                <Badge variant="secondary" className="bg-indigo-500/20 text-indigo-300">
                  {fortune.personalization}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed text-lg">
                {fortune.content}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}