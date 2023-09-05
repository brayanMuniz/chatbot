import React, { useState, useRef, useEffect } from "react";
import { MicrophoneIcon } from "@heroicons/react/24/solid";

const MicrophoneRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]); // To store audio chunks

  const startRecording = () => {
    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: "audio/webm;codecs=opus",
      });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = []; // Clear previous audio chunks
      mediaRecorder.start();
      setIsRecording(true);

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        console.log(audioBlob);
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
    } else {
      startRecording();
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
