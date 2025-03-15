"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { YouTubeVideoPlayerProps } from "@/types/video-player"
import { Button } from "@/components/ui/button"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import ReactPlayer from "react-player"

export default function YouTubeVideoPlayer({ src }: YouTubeVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [played, setPlayed] = useState(0)
  const [duration, setDuration] = useState(0)
  const [seeking, setSeeking] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const playerRef = useRef<ReactPlayer>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const handleSeekChange = (value: number[]) => {
    setPlayed(value[0])
  }

  const handleSeekMouseUp = (value: number[]) => {
    setSeeking(false)
    if (playerRef.current) {
      playerRef.current.seekTo(value[0])
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    if (!seeking) {
      setPlayed(state.played)
    }
  }

  const handleDuration = (duration: number) => {
    setDuration(duration)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    seconds = Math.floor(seconds % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  return (
    <Card className="w-full h-auto overflow-hidden">
      <CardContent className="p-0">
        <div 
          className="relative w-full" 
          style={{ aspectRatio: "16/9" }}
          ref={containerRef}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <ReactPlayer
            ref={playerRef}
            url={src}
            width="100%"
            height="100%"
            playing={isPlaying}
            volume={volume}
            muted={isMuted}
            onProgress={handleProgress}
            onDuration={handleDuration}
            config={{
              youtube: {
                playerVars: {
                  controls: 0,
                  modestbranding: 1,
                  showinfo: 0,
                }
              }
            }}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />

          <div
            className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${
              showControls ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="p-4 space-y-2">
              <Slider
                value={[played]}
                max={1}
                step={0.001}
                onValueChange={handleSeekChange}
                onValueCommit={handleSeekMouseUp}
                className="h-1"
              />

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={handlePlayPause}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>

                  <span className="text-xs text-white">
                    {formatTime(played * duration)} / {formatTime(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 w-24">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white" onClick={toggleMute}>
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Slider
                      value={[volume]}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="h-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
