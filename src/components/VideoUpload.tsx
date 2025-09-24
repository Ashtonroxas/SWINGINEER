import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Video, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onVideoUpload: (videoUrl: string) => void;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUpload }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("video/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload a video file.",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (50MB limit)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 50MB.",
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      try {
        // Create a local URL for the video
        const videoUrl = URL.createObjectURL(file);
        
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onVideoUpload(videoUrl);
        
        toast({
          title: "Video uploaded successfully",
          description: "Your golf swing video is ready for analysis.",
        });
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "There was an error uploading your video. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [onVideoUpload, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    multiple: false,
    disabled: uploading,
  });

  return (
    <Card className="shadow-medium hover:shadow-large transition-all duration-300">
      <CardContent className="p-8">
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? "border-primary bg-primary/5 scale-105" 
              : "border-border hover:border-primary hover:bg-primary/5"
            }
            ${uploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {uploading ? (
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-pulse-glow">
                  <Upload className="w-8 h-8 text-primary animate-bounce" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Video className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {uploading ? "Uploading..." : "Upload Your Golf Swing Video"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isDragActive
                  ? "Drop your video here..."
                  : "Drag and drop a video file here, or click to browse"}
              </p>
            </div>

            <Button
              disabled={uploading}
              variant="default"
              size="lg"
              className="bg-gradient-hero hover:scale-105 transition-all duration-300"
            >
              {uploading ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Video File
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mt-6">
              <div className="flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                <span>Max 50MB</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                <span>MP4, MOV, AVI, WebM</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};