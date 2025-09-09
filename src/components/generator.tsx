"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { toast } from "sonner";
import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "./ui/skeleton";
import {
  ChevronRightIcon,
  DownloadIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import ShimmerButton from "./ui/shimmer-button";

const RATE_LIMITS = {
  flux: { perMinute: 4, perHour: 10 },
  lucid: { perMinute: 4, perHour: 10 },
  phoenix: { perMinute: 4, perHour: 10 },
  default: { perMinute: 8, perHour: 25 },
};

interface RateLimits {
  perMinute: number;
  perHour: number;
}

const getRateLimits = (model: string): RateLimits => {
  if (model === "flux-schnell") return RATE_LIMITS.flux;
  if (model === "lucid-origin") return RATE_LIMITS.lucid;
  if (model === "phoenix") return RATE_LIMITS.phoenix;
  return RATE_LIMITS.default;
};

const checkRateLimit = (model: string): boolean => {
  const limits = getRateLimits(model);
  const now = Date.now();
  const requestTimes: number[] = JSON.parse(
    localStorage.getItem(model) || "[]"
  );

  const requestsInLastMinute: number = requestTimes.filter(
    (time: number) => now - time < 60 * 1000
  ).length;
  const requestsInLastHour: number = requestTimes.filter(
    (time: number) => now - time < 60 * 60 * 1000
  ).length;

  if (requestsInLastMinute >= limits.perMinute) {
    toast.error(
      "Rate limit exceeded: Please wait a minute before trying again."
    );
    return false;
  }

  if (requestsInLastHour >= limits.perHour) {
    toast.error(
      "Rate limit exceeded: Please wait an hour before trying again."
    );
    return false;
  }

  return true;
};

const recordRequest = (model: string): void => {
  const now = Date.now();
  const requestTimes: number[] = JSON.parse(
    localStorage.getItem(model) || "[]"
  );
  requestTimes.push(now);
  localStorage.setItem(model, JSON.stringify(requestTimes));
};

interface RemainingRequests {
  perMinute: number;
  perHour: number;
}

const getRemainingRequests = (model: string): RemainingRequests => {
  const limits = getRateLimits(model);
  const now = Date.now();
  const requestTimes: number[] = JSON.parse(
    localStorage.getItem(model) || "[]"
  );

  const requestsInLastMinute = requestTimes.filter(
    (time: number) => now - time < 60 * 1000
  ).length;
  const requestsInLastHour = requestTimes.filter(
    (time: number) => now - time < 60 * 60 * 1000
  ).length;

  return {
    perMinute: limits.perMinute - requestsInLastMinute,
    perHour: limits.perHour - requestsInLastHour,
  };
};

export default function Generator() {
  const prompt = useRef<HTMLTextAreaElement>(null);
  const negativePrompt = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState([7.5]);
  const [strength, setStrength] = useState([1]);
  const [model, setModel] = useState("flux-schnell");
  const [imgUrl, setImgUrl] = useState("");
  const [tperformance, setPerformance] = useState(0);
  const [remainingRequests, setRemainingRequests] = useState({
    perMinute: 0,
    perHour: 0,
  });

  // Additional parameters
  const [steps, setSteps] = useState([20]);
  const [seed, setSeed] = useState("");
  const [width, setWidth] = useState([1024]);
  const [height, setHeight] = useState([1024]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const url = useMemo(
    () =>
      process.env.NODE_ENV === "production"
        ? process.env.NEXT_PUBLIC_URL
        : "http://127.0.0.1:8787/img",
    []
  );

  useEffect(() => {
    setRemainingRequests(getRemainingRequests(model));

    // Reset parameters based on model
    switch (model) {
      case "flux-schnell":
        setSteps([4]);
        setGuidance([7.5]);
        break;
      case "lucid-origin":
        setSteps([30]);
        setGuidance([4.5]);
        setWidth([1120]);
        setHeight([1120]);
        break;
      case "phoenix":
        setSteps([25]);
        setGuidance([2]);
        break;
      case "sdxl-lightning":
        setSteps([15]);
        setGuidance([7.5]);
        break;
      case "sdxl":
        setSteps([20]);
        setGuidance([7.5]);
        break;
      case "dreamshaper":
        setSteps([20]);
        setGuidance([7.5]);
        break;
      default:
        setSteps([20]);
        setGuidance([7.5]);
    }
  }, [model]);

  const generateImage = useCallback(async () => {
    if (!checkRateLimit(model)) return;

    try {
      setLoading(true);
      if (prompt.current !== null) {
        // Build URL with parameters
        const params = new URLSearchParams({
          prompt: prompt.current.value,
          model: model,
          guidance: guidance[0].toString(),
          strength: strength[0].toString(),
        });

        // Add model-specific parameters
        if (steps[0] !== 20) params.append("steps", steps[0].toString());
        if (seed) params.append("seed", seed);
        if (width[0] !== 1024) params.append("width", width[0].toString());
        if (height[0] !== 1024) params.append("height", height[0].toString());

        // Add negative prompt for supported models
        if (
          negativePrompt.current?.value &&
          ["sdxl", "sdxl-lightning", "dreamshaper", "phoenix"].includes(model)
        ) {
          params.append("negative_prompt", negativePrompt.current.value);
        }

        const newUrl = `${url}?${params.toString()}`;
        const t1 = performance.now();
        const response = await fetch(newUrl, { method: "get" });

        if (response.ok) {
          const t2 = performance.now();
          setPerformance(t2 - t1 - 300);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImgUrl(objectUrl);
          recordRequest(model);
          setRemainingRequests(getRemainingRequests(model));
          toast.success("Image generated successfully!");
        } else {
          toast.error("An error occurred while generating the image.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while generating the image.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [url, model, guidance, strength, steps, seed, width, height]);

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-24 max-w-6xl mx-auto px-4 py-8 md:py-24 w-full relative">
      <div className="fixed h-32 w-1/3 -left-24 top-1/2 bg-zinc-500/40 blur-3xl -translate-x-1/2"></div>
      <div className="fixed h-32 w-1/3 top-1/2 -right-28 bg-zinc-500/40 blur-3xl translate-x-1/2"></div>
      <div className="flex flex-col gap-6">
        <div>
          <ShimmerButton className="shadow-2xl ml-4">
            <span className="text-foreground text-xs inline-flex">
              New Flux Schnell model <ChevronRightIcon size={15} />
            </span>
          </ShimmerButton>
        </div>
        <div className="grid gap-4">
          <h1 className="text-4xl font-bold">Image Generation</h1>
          <p className="text-muted-foreground">
            Generate unique images from text prompts.
          </p>
        </div>
        <div className="grid gap-4">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            required
            ref={prompt}
            id="prompt"
            name="prompt"
            placeholder="Enter a description of the image you want to generate..."
            rows={3}
            className="resize-none rounded-lg border border-gray-200 bg-transparent p-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:focus:ring-gray-300"
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="model">
            Model{" "}
            <span className="ml-5 text-xs text-muted-foreground">
              Remaining: {remainingRequests.perMinute}/min ,{" "}
              {remainingRequests.perHour}/hour
            </span>
          </Label>
          <Select onValueChange={setModel} defaultValue={"flux-schnell"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flux-schnell">
                <span className="bg-gradient-to-r from-lime-500 via-cyan-500 brightness-105 saturate-150 to-violet-500 w-fit bg-clip-text text-transparent">
                  Flux Schnell
                </span>{" "}
                (Most Realistic and best model)🔥
              </SelectItem>
              <SelectItem value="lucid-origin">
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 brightness-105 saturate-150 to-pink-500 w-fit bg-clip-text text-transparent">
                  Lucid Origin
                </span>{" "}
                (High Quality)🌟
              </SelectItem>
              <SelectItem value="phoenix">
                <span className="bg-gradient-to-r from-orange-500 via-red-500 brightness-105 saturate-150 to-yellow-500 w-fit bg-clip-text text-transparent">
                  Phoenix
                </span>{" "}
                (Creative Generation)🔥
              </SelectItem>
              <SelectItem value="sdxl-lightning">
                <span className="bg-gradient-to-r from-yellow-600 brightness-105 saturate-150 to-red-400 w-fit bg-clip-text text-transparent">
                  Stable Diffusion Lightning
                </span>
                (Fastest)⚡
              </SelectItem>
              <SelectItem value="sdxl">
                <span className="bg-gradient-to-r from-red-500 via-purple-600 brightness-105 saturate-150 to-emerald-400 w-fit bg-clip-text text-transparent">
                  Stable Diffusion Base
                </span>
                (Good for all around) ✨
              </SelectItem>
              <SelectItem value="dreamshaper">
                <span className="bg-gradient-to-r from-purple-600 brightness-105 saturate-150 to-rose-400 w-fit bg-clip-text text-transparent">
                  Dreamshaper
                </span>
                Low Quality
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4">
          <Label htmlFor="guidance">Guidance: {guidance[0]}</Label>
          <Slider
            value={guidance}
            onValueChange={setGuidance}
            id="guidance"
            name="guidance"
            min={model === "phoenix" ? 2 : model === "lucid-origin" ? 0 : 4}
            max={10}
            step={0.5}
            defaultValue={[7.5]}
            className="w-full"
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="strength">Strength: {strength[0]}</Label>
          <Slider
            value={strength}
            onValueChange={setStrength}
            id="strength"
            name="strength"
            min={0.2}
            max={2}
            step={0.1}
            defaultValue={[1]}
            className="w-full"
          />
        </div>

        {/* Advanced Parameters */}
        <div className="grid gap-4 p-4 border rounded-lg bg-card/50">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <p>
              Advanced Settings{" "}
              <span className="text-[10px] px-1 font-light">
                (not supported by all models)
              </span>
            </p>
            {showAdvanced ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>

          {showAdvanced && (
            <div className="grid gap-4 animate-in slide-in-from-top-2 duration-200">
              {/* Negative Prompt - Only for supported models */}
              {["sdxl", "sdxl-lightning", "dreamshaper", "phoenix"].includes(
                model
              ) && (
                <div className="grid gap-2">
                  <Label htmlFor="negative-prompt" className="text-xs">
                    Negative Prompt{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Textarea
                    ref={negativePrompt}
                    id="negative-prompt"
                    placeholder="What to exclude from the image..."
                    rows={2}
                    className="resize-none text-xs"
                  />
                </div>
              )}

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="width" className="text-xs">
                    Width: {width[0]}px
                  </Label>
                  <Slider
                    value={width}
                    onValueChange={setWidth}
                    id="width"
                    min={256}
                    max={2048}
                    step={64}
                    defaultValue={[1024]}
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height" className="text-xs">
                    Height: {height[0]}px
                  </Label>
                  <Slider
                    value={height}
                    onValueChange={setHeight}
                    id="height"
                    min={256}
                    max={2048}
                    step={64}
                    defaultValue={[1024]}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Steps and Seed */}
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="steps" className="text-xs">
                    Steps: {steps[0]}
                  </Label>
                  <Slider
                    value={steps}
                    onValueChange={setSteps}
                    id="steps"
                    min={1}
                    max={
                      model === "flux-schnell"
                        ? 8
                        : model === "lucid-origin"
                        ? 40
                        : model === "phoenix"
                        ? 50
                        : 20
                    }
                    step={1}
                    defaultValue={[model === "flux-schnell" ? 4 : 20]}
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="seed" className="text-xs">
                    Seed{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    type="number"
                    value={seed}
                    onChange={(e) => setSeed(e.target.value)}
                    placeholder="Random"
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={generateImage}
          disabled={loading}
        >
          Generate Image
        </Button>
      </div>
      <div className="flex flex-col min-h-[500px] group items-center justify-center">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <div className="flex relative m-2 border shadow hover:shadow-lg hover:shadow-gray-600 transition-all duration-500 shadow-gray-600 aspect-square overflow-hidden rounded-lg">
            <Image
              src={imgUrl || "/img.jpg"}
              alt="Generated Image"
              width={600}
              height={600}
              className="max-w-full object-cover group-hover:scale-110 transition-all bg-blue-400/10 duration-700"
            />
            {imgUrl && (
              <Button
                size={"icon"}
                onClick={() => {
                  if (imgUrl) {
                    const a = document.createElement("a");
                    a.href = imgUrl;
                    a.download = "generated-image.png";
                    a.click();
                  }
                }}
                className="absolute bottom-2 right-2 backdrop-blur-md bg-white/20 hover:bg-white/30 rounded-full p-2"
              >
                <DownloadIcon />
              </Button>
            )}
          </div>
        )}

        <p>Time taken: {(tperformance / 1000).toFixed(2)} secs</p>
      </div>
    </div>
  );
}
