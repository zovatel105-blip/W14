import React, { useRef, useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';

const AudioWaveform = ({ 
  audioUrl, 
  waveformData = null, 
  isPlaying = false, 
  currentTime = 0, 
  duration = 30,
  height = 60,
  className = ""
}) => {
  const canvasRef = useRef(null);
  const [generatedWaveform, setGeneratedWaveform] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate waveform from audio if no waveform data provided
  useEffect(() => {
    if (!waveformData && audioUrl && !isGenerating) {
      generateWaveformFromAudio();
    }
  }, [audioUrl, waveformData]);

  const generateWaveformFromAudio = async () => {
    if (!audioUrl) return;
    
    setIsGenerating(true);
    
    try {
      // Create audio context for analysis
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Fetch and decode audio
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Get channel data (use first channel)
      const channelData = audioBuffer.getChannelData(0);
      const samples = 100; // Number of waveform bars
      const blockSize = Math.floor(channelData.length / samples);
      const waveform = [];
      
      // Process audio data into waveform
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        const start = i * blockSize;
        const end = Math.min(start + blockSize, channelData.length);
        
        for (let j = start; j < end; j++) {
          sum += Math.abs(channelData[j]);
        }
        
        const average = sum / (end - start);
        // Normalize and scale to 0-100
        waveform.push(Math.min(100, Math.max(10, average * 200)));
      }
      
      setGeneratedWaveform(waveform);
      audioContext.close();
    } catch (error) {
      console.error('Error generating waveform:', error);
      // Fallback to generated waveform
      const fallbackWaveform = [];
      for (let i = 0; i < 100; i++) {
        fallbackWaveform.push(Math.random() * 60 + 20);
      }
      setGeneratedWaveform(fallbackWaveform);
    } finally {
      setIsGenerating(false);
    }
  };

  // Draw waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const { width, height: canvasHeight } = canvas;
    const waveform = waveformData || generatedWaveform;
    
    if (!waveform || waveform.length === 0) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, canvasHeight);
    
    // Calculate bar width and spacing
    const barCount = waveform.length;
    const barWidth = Math.max(1, Math.floor(width / barCount * 0.8));
    const barSpacing = Math.max(1, Math.floor(width / barCount * 0.2));
    
    // Calculate progress position
    const progressPosition = duration > 0 ? (currentTime / duration) * width : 0;
    
    // Draw waveform bars
    waveform.forEach((value, index) => {
      const barHeight = (value / 100) * canvasHeight * 0.8;
      const x = index * (barWidth + barSpacing);
      const y = (canvasHeight - barHeight) / 2;
      
      // Determine bar color based on playback position
      const isPlayed = x < progressPosition;
      
      if (isPlaying && isPlayed) {
        // Played portion - bright green
        ctx.fillStyle = '#10B981';
      } else if (isPlaying && !isPlayed) {
        // Unplayed portion - light gray
        ctx.fillStyle = '#D1D5DB';
      } else {
        // Not playing - medium gray
        ctx.fillStyle = '#9CA3AF';
      }
      
      // Draw rounded bar
      ctx.beginPath();
      const radius = Math.min(barWidth / 2, 2);
      ctx.roundRect(x, y, barWidth, barHeight, radius);
      ctx.fill();
    });
    
  }, [waveformData, generatedWaveform, isPlaying, currentTime, duration]);

  // Set canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = height;
  }, [height]);

  if (isGenerating) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <div className="flex items-center gap-2 text-gray-500">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
          <span className="text-sm">Analyzing audio...</span>
        </div>
      </div>
    );
  }

  if (!waveformData && generatedWaveform.length === 0 && !audioUrl) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <Volume2 className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={`w-full ${className}`}
      style={{ height }}
    />
  );
};

export default AudioWaveform;