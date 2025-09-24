import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp, 
  Target,
  Activity,
  Loader2
} from "lucide-react";

interface FeedbackPanelProps {
  isAnalyzing: boolean;
  analysisComplete: boolean;
}

const mockFeedbackData = {
  overallScore: 78,
  status: "Good" as "Good" | "Needs Improvement" | "Warning",
  metrics: [
    {
      name: "Shoulder Rotation",
      score: 85,
      status: "Good" as "Good" | "Needs Improvement" | "Warning",
      feedback: "Excellent shoulder turn and proper coil"
    },
    {
      name: "Hip Alignment",
      score: 72,
      status: "Needs Improvement" as "Good" | "Needs Improvement" | "Warning",
      feedback: "Hip rotation could be more fluid"
    },
    {
      name: "Arm Extension",
      score: 45,
      status: "Warning" as "Good" | "Needs Improvement" | "Warning",
      feedback: "Keep left arm straighter through impact"
    },
    {
      name: "Weight Transfer",
      score: 88,
      status: "Good" as "Good" | "Needs Improvement" | "Warning",
      feedback: "Great weight shift from back to front foot"
    },
    {
      name: "Follow Through",
      score: 79,
      status: "Good" as "Good" | "Needs Improvement" | "Warning",
      feedback: "Good extension, maintain balance"
    }
  ],
  keyInsights: [
    "Your backswing plane is excellent",
    "Work on maintaining left arm extension",
    "Hip rotation timing needs improvement",
    "Overall tempo is very good"
  ]
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Good":
      return <CheckCircle className="w-4 h-4 text-success" />;
    case "Needs Improvement":
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case "Warning":
      return <XCircle className="w-4 h-4 text-destructive" />;
    default:
      return <Activity className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Good":
      return "bg-success/10 text-success border-success/20";
    case "Needs Improvement":
      return "bg-warning/10 text-warning border-warning/20";
    case "Warning":
      return "bg-destructive/10 text-destructive border-destructive/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  isAnalyzing,
  analysisComplete,
}) => {
  if (isAnalyzing) {
    return (
      <Card className="shadow-medium">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Analyzing Your Swing</h3>
              <p className="text-muted-foreground text-sm">
                Our AI is processing your video and tracking pose landmarks...
              </p>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">Processing steps:</div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-success" />
                  <span>Video uploaded</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Detecting pose landmarks...</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-3 h-3 border border-muted-foreground/30 rounded-full" />
                  <span>Analyzing swing mechanics</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <div className="w-3 h-3 border border-muted-foreground/30 rounded-full" />
                  <span>Generating feedback</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analysisComplete) {
    return (
      <Card className="shadow-medium opacity-50">
        <CardHeader>
          <CardTitle className="text-muted-foreground">Swing Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center">
            Upload a video to see your swing analysis
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Overall Score */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <div className="text-4xl font-bold text-foreground">
              {mockFeedbackData.overallScore}
              <span className="text-lg font-normal text-muted-foreground">/100</span>
            </div>
            <Badge className={getStatusColor(mockFeedbackData.status)}>
              {getStatusIcon(mockFeedbackData.status)}
              {mockFeedbackData.status}
            </Badge>
          </div>
          <Progress 
            value={mockFeedbackData.overallScore} 
            className="h-3"
          />
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Swing Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockFeedbackData.metrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <span className="font-medium text-sm">{metric.name}</span>
                </div>
                <span className="text-sm font-medium">{metric.score}%</span>
              </div>
              <Progress value={metric.score} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {metric.feedback}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {mockFeedbackData.keyInsights.map((insight, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};