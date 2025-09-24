import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoUpload } from "@/components/VideoUpload";
import { VideoAnalysis } from "@/components/VideoAnalysis";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { Activity, Upload, Eye, Target } from "lucide-react";
//import heroImage from "@/assets/golf.jpg"; // Ensure you have an appropriate hero image in assets


const Index = () => {
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const handleVideoUpload = (videoUrl: string) => {
    setUploadedVideo(videoUrl);
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };

  const resetAnalysis = () => {
    setUploadedVideo(null);
    setIsAnalyzing(false);
    setAnalysisComplete(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img
            //src={heroImage}
            alt="Golf swing analysis"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />
        </div>
        
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Perfect Your Golf Swing
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 animate-fade-in">
              AI-powered pose analysis to improve your game with professional insights
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-scale-in">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Activity className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">Professional Feedback</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <Eye className="w-5 h-5 text-primary" />
                <span className="text-white font-medium">Pose Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          {!uploadedVideo ? (
            /* Upload Section */
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Upload Your Golf Swing
                </h2>
                <p className="text-lg text-muted-foreground">
                  Upload a video of your golf swing to get detailed AI-powered analysis
                </p>
              </div>
              <VideoUpload onVideoUpload={handleVideoUpload} />
              
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mt-16">
                <Card className="text-center shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>Easy Upload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Simply drag and drop your golf swing video or click to browse
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Activity className="w-6 h-6 text-accent" />
                    </div>
                    <CardTitle>AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Advanced pose estimation tracks every joint and movement
                    </CardDescription>
                  </CardContent>
                </Card>

                <Card className="text-center shadow-soft hover:shadow-medium transition-all duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Target className="w-6 h-6 text-success" />
                    </div>
                    <CardTitle>Get Feedback</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Receive detailed feedback on form, posture, and technique
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            /* Analysis Section */
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-foreground">
                  Swing Analysis
                </h2>
                <Button onClick={resetAnalysis} variant="outline">
                  Upload New Video
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Video Analysis - 2 columns */}
                <div className="lg:col-span-2">
                  <VideoAnalysis 
                    videoUrl={uploadedVideo}
                    isAnalyzing={isAnalyzing}
                    analysisComplete={analysisComplete}
                  />
                </div>

                {/* Feedback Panel - 1 column */}
                <div className="space-y-6">
                  <FeedbackPanel 
                    isAnalyzing={isAnalyzing}
                    analysisComplete={analysisComplete}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;