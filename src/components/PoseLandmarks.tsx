import { useEffect, useState } from "react";

interface PoseLandmarksProps {
  currentTime: number;
  duration: number;
}

interface LandmarkPoint {
  x: number;
  y: number;
  visibility: number;
}

interface PoseData {
  timestamp: number;
  landmarks: {
    [key: string]: LandmarkPoint;
  };
}

// Mock pose data - in a real app, this would come from your ML analysis
const generateMockPoseData = (duration: number): PoseData[] => {
  const data: PoseData[] = [];
  const frameRate = 30; // 30 FPS
  const totalFrames = Math.floor(duration * frameRate);
  
  for (let frame = 0; frame < totalFrames; frame++) {
    const timestamp = frame / frameRate;
    const progress = frame / totalFrames;
    
    // Simulate a golf swing motion with key poses
    const swingPhase = Math.sin(progress * Math.PI * 2) * 0.5 + 0.5;
    
    data.push({
      timestamp,
      landmarks: {
        // Head
        nose: { x: 50 + Math.sin(progress * Math.PI) * 5, y: 15, visibility: 0.9 },
        
        // Shoulders
        leftShoulder: { x: 40 + Math.sin(progress * Math.PI * 2) * 15, y: 25, visibility: 0.95 },
        rightShoulder: { x: 60 - Math.sin(progress * Math.PI * 2) * 15, y: 25, visibility: 0.95 },
        
        // Arms
        leftElbow: { x: 35 + Math.sin(progress * Math.PI * 2) * 20, y: 35 + Math.cos(progress * Math.PI * 2) * 10, visibility: 0.9 },
        rightElbow: { x: 65 - Math.sin(progress * Math.PI * 2) * 20, y: 35 + Math.cos(progress * Math.PI * 2) * 10, visibility: 0.9 },
        leftWrist: { x: 30 + Math.sin(progress * Math.PI * 2) * 25, y: 45 + Math.cos(progress * Math.PI * 2) * 15, visibility: 0.85 },
        rightWrist: { x: 70 - Math.sin(progress * Math.PI * 2) * 25, y: 45 + Math.cos(progress * Math.PI * 2) * 15, visibility: 0.85 },
        
        // Hips
        leftHip: { x: 45 + Math.sin(progress * Math.PI) * 8, y: 50, visibility: 0.9 },
        rightHip: { x: 55 - Math.sin(progress * Math.PI) * 8, y: 50, visibility: 0.9 },
        
        // Knees
        leftKnee: { x: 42 + Math.sin(progress * Math.PI) * 5, y: 65, visibility: 0.85 },
        rightKnee: { x: 58 - Math.sin(progress * Math.PI) * 5, y: 65, visibility: 0.85 },
        
        // Ankles
        leftAnkle: { x: 40, y: 80, visibility: 0.8 },
        rightAnkle: { x: 60, y: 80, visibility: 0.8 },
      }
    });
  }
  
  return data;
};

const connections = [
  // Torso
  ['leftShoulder', 'rightShoulder'],
  ['leftShoulder', 'leftHip'],
  ['rightShoulder', 'rightHip'],
  ['leftHip', 'rightHip'],
  
  // Arms
  ['leftShoulder', 'leftElbow'],
  ['leftElbow', 'leftWrist'],
  ['rightShoulder', 'rightElbow'],
  ['rightElbow', 'rightWrist'],
  
  // Legs
  ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'],
  ['rightHip', 'rightKnee'],
  ['rightKnee', 'rightAnkle'],
  
  // Head
  ['nose', 'leftShoulder'],
  ['nose', 'rightShoulder'],
];

export const PoseLandmarks: React.FC<PoseLandmarksProps> = ({
  currentTime,
  duration,
}) => {
  const [poseData, setPoseData] = useState<PoseData[]>([]);
  const [currentPose, setCurrentPose] = useState<PoseData | null>(null);

  useEffect(() => {
    // Generate mock pose data when component mounts
    const mockData = generateMockPoseData(duration);
    setPoseData(mockData);
  }, [duration]);

  useEffect(() => {
    // Find the pose data closest to current time
    if (poseData.length > 0) {
      const closestPose = poseData.reduce((closest, pose) => {
        return Math.abs(pose.timestamp - currentTime) < Math.abs(closest.timestamp - currentTime)
          ? pose
          : closest;
      });
      setCurrentPose(closestPose);
    }
  }, [currentTime, poseData]);

  if (!currentPose) return null;

  return (
    <svg 
      className="w-full h-full absolute inset-0" 
      viewBox="0 0 100 100" 
      preserveAspectRatio="none"
    >
      {/* Draw connections */}
      {connections.map(([point1, point2], index) => {
        const landmark1 = currentPose.landmarks[point1];
        const landmark2 = currentPose.landmarks[point2];
        
        if (!landmark1 || !landmark2 || landmark1.visibility < 0.5 || landmark2.visibility < 0.5) {
          return null;
        }
        
        return (
          <line
            key={`connection-${index}`}
            x1={`${landmark1.x}%`}
            y1={`${landmark1.y}%`}
            x2={`${landmark2.x}%`}
            y2={`${landmark2.y}%`}
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
            opacity="0.8"
            className="animate-pulse"
          />
        );
      })}
      
      {/* Draw landmarks */}
      {Object.entries(currentPose.landmarks).map(([name, landmark]) => {
        if (landmark.visibility < 0.5) return null;
        
        const isKeyPoint = ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftWrist', 'rightWrist'].includes(name);
        
        return (
          <circle
            key={name}
            cx={`${landmark.x}%`}
            cy={`${landmark.y}%`}
            r={isKeyPoint ? "1.2" : "0.8"}
            fill="hsl(var(--primary))"
            stroke="white"
            strokeWidth="0.3"
            opacity={landmark.visibility}
            className={isKeyPoint ? "animate-pulse-glow" : ""}
          >
            <title>{name}</title>
          </circle>
        );
      })}
      
      {/* Analysis indicators */}
      <g opacity="0.7">
        {/* Shoulder line indicator */}
        {currentPose.landmarks.leftShoulder && currentPose.landmarks.rightShoulder && (
          <line
            x1={`${currentPose.landmarks.leftShoulder.x}%`}
            y1={`${currentPose.landmarks.leftShoulder.y}%`}
            x2={`${currentPose.landmarks.rightShoulder.x}%`}
            y2={`${currentPose.landmarks.rightShoulder.y}%`}
            stroke="hsl(var(--accent))"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            opacity="0.6"
          />
        )}
        
        {/* Hip line indicator */}
        {currentPose.landmarks.leftHip && currentPose.landmarks.rightHip && (
          <line
            x1={`${currentPose.landmarks.leftHip.x}%`}
            y1={`${currentPose.landmarks.leftHip.y}%`}
            x2={`${currentPose.landmarks.rightHip.x}%`}
            y2={`${currentPose.landmarks.rightHip.y}%`}
            stroke="hsl(var(--accent))"
            strokeWidth="0.8"
            strokeDasharray="2,2"
            opacity="0.6"
          />
        )}
      </g>
    </svg>
  );
};