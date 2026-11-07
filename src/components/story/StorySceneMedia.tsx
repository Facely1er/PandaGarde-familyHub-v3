import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';

type ClipStatus = 'idle' | 'playing' | 'paused' | 'ended';

interface StorySceneMediaProps {
  /** Still used as the scene image and as the clip poster. */
  imageUrl?: string;
  /** Short silent clip. Omitted scenes stay a still image. */
  videoUrl?: string;
  label: string;
}

/**
 * Scene illustration with an optional mini clip in the same frame.
 * The clip stays muted and starts only after a tap, so narration and
 * reduced-motion settings are unchanged.
 */
export function StorySceneMedia({ imageUrl, videoUrl, label }: StorySceneMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<ClipStatus>('idle');
  const [clipUnavailable, setClipUnavailable] = useState(false);

  useEffect(() => {
    setStatus('idle');
    setClipUnavailable(false);
  }, [imageUrl, videoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || status !== 'playing') {
      return;
    }
    video.muted = true;
    void video.play().catch(() => setStatus('idle'));
  }, [status]);

  if (!imageUrl && !videoUrl) {
    return null;
  }

  const clipUrl = clipUnavailable ? undefined : videoUrl;
  const showStill = !clipUrl || status === 'idle';

  const onControlClick = () => {
    const video = videoRef.current;
    if (status === 'playing') {
      video?.pause();
      setStatus('paused');
      return;
    }
    if (video && status === 'ended') {
      video.currentTime = 0;
    }
    setStatus('playing');
  };

  const controlLabel =
    status === 'playing' ? 'Pause clip' : status === 'ended' ? 'Replay clip' : 'Play clip';
  const ControlIcon = status === 'playing' ? Pause : status === 'ended' ? RotateCcw : Play;

  return (
    <>
      {imageUrl && showStill && (
        <img
          src={imageUrl}
          alt={label}
          className="story-image"
          loading="lazy"
          decoding="async"
        />
      )}

      {clipUrl && status !== 'idle' && (
        <video
          ref={videoRef}
          className="story-image"
          poster={imageUrl}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          onEnded={() => setStatus('ended')}
          onError={() => {
            setClipUnavailable(true);
            setStatus('idle');
          }}
        >
          <source src={clipUrl} type={clipUrl.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      )}

      {clipUrl && (
        <button
          type="button"
          onClick={onControlClick}
          aria-label={controlLabel}
          className="absolute bottom-3 right-3 z-10 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gray-900/80 px-3 text-sm font-semibold text-white hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-400"
        >
          <ControlIcon size={16} aria-hidden />
          {controlLabel}
        </button>
      )}
    </>
  );
}
