"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "./ui/skeleton";
import { DownloadIcon } from "lucide-react";

export default function Generator() {
  const prompt = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [guidance, setGuidance] = useState([7.5]);
  const [strength, setStrength] = useState([1]);
  const [model, setModel] = useState("sxdl-lightning");
  const [imgUrl, setImgUrl] = useState("");
  const [tperformance, setPerformance] = useState(0);
  const url = process.env.NEXT_PUBLIC_URL || "";

  async function generateImage() {
    try {
      setLoading(true);
      console.log(model, guidance, strength);
      if (prompt.current !== null) {
        const newUrl =
          url +
          "?prompt=" +
          prompt.current.value +
          "&model=" +
          model +
          "&guidance=" +
          guidance +
          "&strength=" +
          strength;
        const t1 = performance.now();
        const response = await fetch(newUrl, {
          method: "get",
        });

        if (response.ok) {
          const t2 = performance.now();
          setPerformance(t2 - t1 - 300);
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImgUrl(objectUrl);
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
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-24 max-w-6xl mx-auto px-4 py-8 md:py-24 w-full relative">
      <div className="fixed h-32 w-1/3 -left-24 top-1/2 bg-zinc-500/40 blur-3xl -translate-x-1/2"></div>
      <div className="fixed h-32 w-1/3 top-1/2 -right-28 bg-zinc-500/40 blur-3xl translate-x-1/2"></div>
      <div className="flex flex-col gap-6">
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
          <Label htmlFor="model">Model</Label>
          <Select onValueChange={setModel} defaultValue={"sdxl-lightning"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sdxl-lightning">
                Stable Diffusion Lightning (Fastest)⚡
              </SelectItem>
              <SelectItem value="sdxl">
                Stable Diffusion Base (Best for all around) ✨
              </SelectItem>
              <SelectItem value="dreamshaper">
                Dreamshaper (Realistic Portraits)😇
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4">
          <Label htmlFor="guidance">Guidance</Label>
          <Slider
            value={guidance}
            onValueChange={setGuidance}
            id="guidance"
            name="guidance"
            min={4}
            max={10}
            step={0.5}
            defaultValue={[7.5]}
            className="w-full"
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="strength">Strength</Label>
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
        <Button
          size="lg"
          className="w-full"
          onClick={() => generateImage()}
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
              src={
                imgUrl ||
                "https://assets.lummi.ai/assets/QmXio7iaCQepiJ8XRe6EgwbvbQamtnn3eLBCxfwWB9odfB?auto=format&w=1500"
              }
              alt="Generated Image"
              width={600}
              height={600}
              className="max-w-full object-cover group-hover:scale-110 transition-all duration-700"
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
