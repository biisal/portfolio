import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerPlayButton,
  AudioPlayerSeekBackwardButton,
  AudioPlayerSeekForwardButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
} from "@/components/ui/audio-player";

export function ListenBtn({ url }: { url: string }) {
  return (
    <AudioPlayer className="bg-blog-bg overflow-auto">
      <AudioPlayerElement src={url} />
      <AudioPlayerControlBar>
        <AudioPlayerPlayButton />
        <AudioPlayerSeekBackwardButton seekOffset={10} />
        <AudioPlayerSeekForwardButton seekOffset={10} />
        <AudioPlayerTimeDisplay />
        <AudioPlayerTimeRange />
        <AudioPlayerDurationDisplay />
      </AudioPlayerControlBar>
    </AudioPlayer>
  );
}
