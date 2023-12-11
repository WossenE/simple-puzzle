import React, { useState, useEffect, useRef, ReactNode } from 'react';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';

interface DraggableWrapperProps {
  children: ReactNode;
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({ children }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const [stopButtonDisabled, setStopButtonDisabled] = useState(false);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      intervalIdRef.current = setInterval(() => {
        setElapsedTime((prev) => (prev + 1) % 60); // Increment every second, reset every minute
      }, 1000);
    } else {
      clearInterval(intervalIdRef.current!); // Clear the interval when timer stops
    }

    return () => clearInterval(intervalIdRef.current!); // Cleanup on component unmount

  }, [isTimerRunning]);

  const handleDrag = (e: DraggableEvent, data: DraggableData) => {
    setPosition({ x: data.x, y: data.y });
  };

  const handleStopButtonClick = () => {
    setIsTimerRunning(false);
    setStopButtonDisabled(true);
    clearInterval(intervalIdRef.current!);
  };

  return (
    <Draggable
      handle=".drag-handle"
      defaultPosition={{ x: 0, y: 0 }}
      position={position}
      onDrag={handleDrag}
    >
      <div className="draggable-wrapper">
        <div className="drag-handle">
          <div className="timer">{elapsedTime}s</div>
          <button
            className="stop-button"
            onClick={handleStopButtonClick}
            disabled={stopButtonDisabled}
          >
            Stop
          </button>
        </div>
        <div className="content">{children}</div>
      </div>
    </Draggable>
  );
};

export default DraggableWrapper;
