"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import ReactLenis from "lenis/react";

const images = [
  "/img.jpg",
  "/generated-image(1).jpg",
  "/generated-image(3).png",
  "/generated-image.jpg",
  "/img (1).jpg",
  "/img (2).jpeg",
  "/img (3).jpeg",
  "/img (4).jpeg",
  "/img (5).jpeg",
  "/img (1).png",
  "/img (2).png",
  "/img (3).png",
  "/img (4).png",
  "/img (5).png",
  "/img (1).jpg",
  "/img (6).png",
];

const SwipeGrid = () => {
  const grid = useRef<any>(null);
  const gridWrap = useRef<any>(null);

  const hasRun = useRef(false);

  const applyAnimation = () => {
    // Register Scroll Triggren
    gsap.registerPlugin(ScrollTrigger);

    // Child elements of grid
    const gridItems = grid.current?.querySelectorAll(".grid__item");
    const gridItemsInner = [...gridItems].map((item) =>
      item.querySelector(".grid__item-inner")
    );

    // Define GSAP timeline with ScrollTrigger
    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: gridWrap.current,
        start: "top bottom+=5%",
        end: "bottom top-=5%",
        scrub: true,
        // markers: true // Optional: for debugging
      },
    });

    grid.current.style.perspective = "1000px";
    grid.current.style.width = "calc(1 / 0.65 * 100%)";
    grid.current.style.height = "calc(1 / 0.5 * 100%)";

    timeline
      .set(gridWrap.current, {
        rotationY: 25,
      })
      .set(gridItems, {
        z: () => gsap.utils.random(-1600, 200),
      })
      .fromTo(
        gridItems,
        { xPercent: () => gsap.utils.random(-1000, -500) },
        { xPercent: () => gsap.utils.random(500, 1000) },
        0
      )
      .fromTo(gridItemsInner, { scale: 2 }, { scale: 0.5 }, 0);
  };

  useEffect(() => {
    //make sure we run this function only once
    if (!hasRun.current && grid.current) {
      applyAnimation();
      window.scrollTo({ top: 0 });
      hasRun.current = true;
    }
  }, [grid]);

  return (
    <ReactLenis root>
      <div className="z-10 w-full overflow-hidden relative">
        <div className="absolute h-20 w-72 left-1/2 -top-12 bg-zinc-400/50 blur-3xl right-1/2 -translate-x-1/2"></div>
        <h1 className="h-[50%] py-20 text-center font-semibold bg-gradient-to-b bg-clip-text text-transparent from-white to-background/80 text-4xl">
          Image Gallery
        </h1>
        <p className="text-center text-lg text-zinc-600">
          Scroll down to see the magic
        </p>
        <section className="relative mb-[20vh]">
          <div
            ref={grid}
            className="grid h-[calc(1/1*100%)] w-[calc(1/1*100%)] place-items-center p-8"
            style={{ perspective: "1500px" }}
          >
            <div
              style={{ transformStyle: "preserve-3d" }}
              ref={gridWrap}
              className="grid h-auto w-full grid-cols-4 gap-[2vw] cursor-crosshair"
            >
              {Array(5)
                .fill(images)
                .flat()
                .map((src, index) => (
                  <div
                    key={index}
                    className="grid__item relative grid aspect-[1.01] h-auto w-full place-items-center overflow-hidden rounded-md"
                  >
                    <Image
                      quality={90}
                      fetchPriority="low"
                      priority={false}
                      src={src}
                      fill={true}
                      className="grid__item-inner relative object-cover object-center h-auto min-w-[300px]"
                      alt="image"
                    />
                  </div>
                ))}
            </div>
          </div>
          <p className="text-center text-muted-foreground">The End</p>
        </section>
      </div>
    </ReactLenis>
  );
};

export default SwipeGrid;
