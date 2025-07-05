import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Download, Share2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FortuneCategory, type FortuneCategoryType } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import { hasPremiumAccess } from "@/lib/premiumUtils";

interface AIArtwork {
  imageUrl: string;
  prompt: string;
  category: FortuneCategoryType;
}

export function AIArtworkGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<FortuneCategoryType>(FortuneCategory.GENERAL);
  const [generatedArtwork, setGeneratedArtwork] = useState<AIArtwork | null>(null);
  const { toast } = useToast();

  const generateArtworkMutation = useMutation({
    mutationFn: async (category: FortuneCategoryType): Promise<AIArtwork> => {
      const response = await apiRequest("POST", "/api/premium/generate-artwork", { category });
      return await response.json();
    },
    onSuccess: (data: AIArtwork) => {
      setGeneratedArtwork(data);
      toast({
        title: "Artwork Generated!",
        description: "Your mystical artwork has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate artwork. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDownload = () => {
    if (!generatedArtwork) return;
    
    const link = document.createElement('a');
    link.href = generatedArtwork.imageUrl;
    link.download = `mystical-artwork-${generatedArtwork.category}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedArtwork) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Mystical Fortune Artwork',
          text: `Beautiful mystical artwork from MysticFortune - ${generatedArtwork.prompt}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(generatedArtwork.imageUrl);
      toast({
        title: "Link Copied",
        description: "Artwork link copied to clipboard!",
      });
    }
  };

  if (!hasPremiumAccess()) {
    return (
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5" />
            AI Mystical Artwork Generator
          </CardTitle>
          <CardDescription>Premium Feature</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Unlock AI-generated mystical artwork featuring beautiful, ethereal figures and cosmic imagery 
            tailored to your fortune readings.
          </p>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Sparkles className="h-5 w-5" />
            AI Mystical Artwork Generator
          </CardTitle>
          <CardDescription>
            Generate beautiful, ethereal artwork for your fortune readings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Fortune Category</label>
            <Select value={selectedCategory} onValueChange={(value: FortuneCategoryType) => setSelectedCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={FortuneCategory.LOVE}>Love & Romance</SelectItem>
                <SelectItem value={FortuneCategory.CAREER}>Career & Success</SelectItem>
                <SelectItem value={FortuneCategory.GENERAL}>General Wisdom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => generateArtworkMutation.mutate(selectedCategory)}
            disabled={generateArtworkMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {generateArtworkMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Mystical Artwork...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Artwork
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {generatedArtwork && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Artwork</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {generatedArtwork.category}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={generatedArtwork.imageUrl} 
                    alt="Generated mystical artwork"
                    className="w-full h-auto max-h-96 object-contain bg-gray-50"
                  />
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 italic">
                    "{generatedArtwork.prompt}"
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleDownload} variant="outline" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button onClick={handleShare} variant="outline" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}