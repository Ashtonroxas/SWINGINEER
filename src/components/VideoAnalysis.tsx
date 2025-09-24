import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Loader2 } from "lucide-react";
import { PoseLandmarks }  from "./PoseLandmarks"

interface VideoAnalysisProps {
  videoUrl: string;
  isAnalyzing: boolean;
  analysisComplete: boolean;
}

export const VideoAnalysis: React.FC<VideoAnalysisProps> = ({
  videoUrl,
  isAnalyzing,
  analysisComplete,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const resetVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(false);
      videoRef.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-glow" />
          Video Analysis
          {isAnalyzing && (
            <Loader2 className="w-4 h-4 animate-spin text-primary ml-auto" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Container */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          
          {/* Pose Landmarks Overlay */}
          {analysisComplete && (
            <div className="absolute inset-0 pointer-events-none">
              <PoseLandmarks 
                currentTime={currentTime}
                duration={duration}
              />
            </div>
          )}

          {/* Analysis Loading Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Analyzing Swing...</p>
                <p className="text-sm opacity-75">AI is processing your golf swing</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Controls */}
        <div className="space-y-3">
          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground min-w-[40px]">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-primary 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <span className="text-sm text-muted-foreground min-w-[40px]">
              {formatTime(duration)}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-2">
            <Button
              onClick={resetVideo}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            
            <Button
              onClick={togglePlay}
              variant="default"
              size="sm"
              className="gap-2 bg-gradient-hero min-w-[100px]"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Play
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Analysis Status */}
        {analysisComplete && (
          <div className="text-center p-4 bg-success/10 rounded-lg border border-success/20">
            <p className="text-success font-medium">
              ✓ Analysis complete! View your swing feedback on the right.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};