"use client";
import { ChevronLeft, Pause, Play, SkipBack, SkipForward } from "lucide-react";
import { Slider } from "./ui/slider";
import { useAudio } from "@/lib/hooks/use-audio";
import useDistributionFree from "@/lib/hooks/use-distruciton-free";
import { cn } from "@/lib/utils";

const iconProps = { className: "h-4 w-4 fill-current" };
const actionButtonProps = {
  type: "button" as const,
  className:
    "inline-flex items-center justify-center py-1 px-2 hover:bg-muted/50 active:scale-95 transition-all duration-150",
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Timer({ time }: { time: string }) {
  return (
    <div className="flex items-center py-1.5 px-3 text-sm tabular-nums text-muted-foreground">
      {time}
    </div>
  );
}

interface PlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  url: string;
}

export function Player({ url, className }: PlayerProps) {
  const { hidden: isHidden, toggleHidden } = useDistributionFree();
  const { isPlaying, currentTime, duration, play, pause, seek } = useAudio({
    src: url,
  });

  const handlePlayPause = () => (isPlaying ? pause() : play());
  const skip = (seconds: number) =>
    seek(Math.max(0, Math.min(currentTime + seconds, duration)));

  return (
    <>
      <div
        className={cn(
          "fixed left-0 top-20 z-50 transition-all duration-300 ease-out",
          isHidden
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <button
          type="button"
          onClick={() => toggleHidden()}
          className="group flex items-center justify-center py-2.5 pl-1.5 pr-2.5 bg-background/95  border border-l-0 border-border rounded-r-lg  hover:pr-3.5  transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground group-hover:text-foreground transition-colors" />
        </button>
      </div>

      <div
        className={cn(
          "sticky top-20 z-40 w-fit my-1 transition-all duration-300 ease-out",
          isHidden
            ? "-translate-x-[calc(100%+1rem)] opacity-0 pointer-events-none"
            : "translate-x-0 opacity-100",
          className
        )}
      >
        <div className="inline-flex items-stretch bg-background/95 backdrop-blur-sm rounded-lg border border-border divide-x divide-border overflow-hidden shadow-lg">
          <button {...actionButtonProps} onClick={() => toggleHidden()}>
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <button {...actionButtonProps} onClick={handlePlayPause}>
            {isPlaying ? <Pause {...iconProps} /> : <Play {...iconProps} />}
          </button>
          <button {...actionButtonProps} onClick={() => skip(-10)}>
            <SkipBack {...iconProps} />
          </button>
          <button {...actionButtonProps} onClick={() => skip(10)}>
            <SkipForward {...iconProps} />
          </button>
          <Timer time={formatTime(currentTime)} />
          <div className="flex items-center px-4">
            <Slider
              value={[currentTime]}
              onValueChange={([v]) => seek(v)}
              max={duration || 100}
              step={1}
              className="w-14 cursor-pointer max-w-xs"
            />
          </div>
          <Timer time={formatTime(duration)} />
        </div>
      </div>
    </>
  );
}
