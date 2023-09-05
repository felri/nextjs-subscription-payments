'use client';

import { useRef, useState } from 'react';

const CaptureVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const onVideoRecorded = (videoBlob: Blob) => {
    const videoUrl = URL.createObjectURL(videoBlob);
    console.log('videoUrl', videoUrl);
  };

  const startCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks((prev) => prev.concat(event.data));
          }
        };

        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
      }
    } catch (err) {
      console.error('Error capturing video:', err);
    }
  };

  const stopCapture = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      setIsCapturing(false);
    }

    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    onVideoRecorded(videoBlob);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <video
        ref={videoRef}
        autoPlay
        className="mb-4 border-4 border-gray-600 rounded-md"
      ></video>
      <div className="flex space-x-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md focus:outline-none"
          onClick={startCapture}
          disabled={isCapturing}
        >
          Start Capture
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md focus:outline-none"
          onClick={stopCapture}
          disabled={!isCapturing}
        >
          Stop Capture
        </button>
      </div>
    </div>
  );
};

export default CaptureVideo;
