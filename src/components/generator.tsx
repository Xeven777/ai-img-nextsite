"use client";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef, useState } from "react";

export default function Generator() {
  const prompt = useRef<HTMLTextAreaElement>(null);
  const [imgUrl, setImgUrl] = useState("");
  const url = "https://ai-image-api.xeven.workers.dev/img";

  async function generateImage() {
    if (prompt.current !== null) {
      const newUrl = url + "?prompt=" + prompt.current.value;
      const response = await fetch(newUrl, {
        method: "get",
      });

      if (response.ok) {
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImgUrl(objectUrl);
      }
    }
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-24 max-w-6xl mx-auto px-4 py-8 md:py-12 w-full">
      <div className="flex flex-col gap-6">
        <div className="grid gap-4">
          <h1 className="text-3xl font-bold">Image Generation</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Generate unique images from text prompts.
          </p>
        </div>
        <div className="grid gap-4">
          <Label htmlFor="prompt">Prompt</Label>
          <Textarea
            ref={prompt}
            id="prompt"
            name="prompt"
            placeholder="Enter a description of the image you want to generate..."
            rows={3}
            className="resize-none rounded-lg border border-gray-200 bg-transparent p-3 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:focus:ring-gray-300"
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="guidance">Guidance</Label>
          <Slider
            id="guidance"
            name="guidance"
            min={0}
            max={20}
            step={1}
            defaultValue={[10]}
            className="w-full"
          />
        </div>
        <div className="grid gap-4">
          <Label htmlFor="strength">Strength</Label>
          <Slider
            id="strength"
            name="strength"
            min={0}
            max={20}
            step={1}
            defaultValue={[10]}
            className="w-full"
          />
        </div>
        <Button size="lg" className="w-full" onClick={() => generateImage()}>
          Generate Image
        </Button>
      </div>
      <div className="flex items-center justify-center ">
        <Image
          src={imgUrl}
          alt="Generated Image"
          width={500}
          height={500}
          className="max-w-full object-cover rounded-lg border border-gray-200 dark:border-gray-800"
        />
      </div>
    </div>
  );
}
