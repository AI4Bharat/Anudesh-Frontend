import React, { useState, useEffect } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import IconButton from '@mui/material/IconButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import Button from '@mui/material/Button';
import { franc } from 'franc-min';

const AudioRecorder = ({ onTranscription, prompt }) => {
  const { startRecording, stopRecording, mediaBlobUrl, pauseRecording, resumeRecording } = useReactMediaRecorder({ audio: true });
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recognizer, setRecognizer] = useState(null);

  const handleStart = () => {
    setIsRecording(true);
    startRecording();
  };

  const handleStop = () => {
    setIsRecording(false);
    stopRecording();
  };

  const handlePause = () => {
    pauseRecording();
  };

  const handleResume = () => {
    resumeRecording();
  };

  const handleDelete = () => {
    setAudioUrl(null);
    onTranscription('');
  };

  const handleSetText = () => {
    if (mediaBlobUrl) {
      const recognizer = new window.webkitSpeechRecognition();
      recognizer.lang = 'en-US';
      recognizer.interimResults = false;
      recognizer.maxAlternatives = 1;

      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscription(transcript);
      };

      recognizer.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognizer.onaudioend = () => {
        stopRecording();
      };

      setRecognizer(recognizer);

      const audio = new Audio(mediaBlobUrl);
      audio.onplay = () => recognizer.start();
      audio.onended = () => recognizer.stop();

      // Detect language
      const language = franc(prompt);
      if (language && language !== 'und') {
        recognizer.lang = language;
      } else {
        recognizer.lang = 'en-US';
      }

      audio.play();
    }
  };

  useEffect(() => {
    if (mediaBlobUrl) {
      setAudioUrl(mediaBlobUrl);
      prompt = mediaBlobUrl
    }
    return () => {
      if (recognizer) {
        recognizer.onresult = null;
        recognizer.onerror = null;
        recognizer.onaudioend = null;
      }
    };
  }, [mediaBlobUrl, recognizer]);

  return (
    <div>
      <IconButton onClick={isRecording ? handleStop : handleStart}>
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls />
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleSetText}>Set Text</Button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
