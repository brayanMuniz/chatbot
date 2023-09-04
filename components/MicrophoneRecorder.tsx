import React, { useState, useRef, useEffect } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

const MicrophoneRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = () => {
    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        console.log(event.data);
        // Todo: Handle the audio data in event.data
      });

      mediaRecorder.addEventListener("stop", () => {
        setIsRecording(false);
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handleMicrophoneClick = () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        setMediaStream(stream);
      })
      .catch((err) => {
        console.error(err);
      });

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <MicrophoneIcon
      onClick={handleMicrophoneClick}
      className={`h-8 w-1/12 ${
        isRecording ? "text-red-500" : "text-button"
      } hover:text-button-hover cursor-pointer`}
    />
  );
};

export default MicrophoneRecorder;
