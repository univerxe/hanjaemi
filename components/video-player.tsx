import { VideoPlayerProps } from "@/types/video-player"
import CustomVideoPlayer from "./custom-video-player"
import YouTubeVideoPlayer from "./youtube-video-player"

export default function VideoPlayer({ src, onColorChange }: VideoPlayerProps) {
  const getYouTubeVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i,
      /^[^"&?\/\s]{11}$/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  const youtubeId = getYouTubeVideoId(src);
  if (youtubeId) {
    return <YouTubeVideoPlayer src={src} />;
  }

  return <CustomVideoPlayer src={src} onColorChange={onColorChange} />;
}
