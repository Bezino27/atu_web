/* eslint-disable @next/next/no-img-element */
"use client";

import Image, { getImageProps } from "next/image";
import { useEffect, useRef } from "react";
import styles from "./HeroScrollZoomImage.module.css";

type HeroScrollZoomImageProps = {
  src: string;
  alt: string;
  wrapperClassName?: string;
  imageClassName?: string;
  sizes?: string;
  mobileSrc?: string;
  mobileBreakpoint?: number;
  priority?: boolean;
  unoptimized?: boolean;
  scrollZoom?: number;
  scrollDistance?: number;
  smoothing?: number;
};

export default function HeroScrollZoomImage({
  src,
  alt,
  wrapperClassName = "",
  imageClassName = "",
  sizes = "100vw",
  mobileSrc,
  mobileBreakpoint = 768,
  priority = false,
  unoptimized = false,
  scrollZoom = 1.05,
  scrollDistance = 0.2,
  smoothing = 0.12,
}: HeroScrollZoomImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const image = imageRef.current;

    if (!image) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let reducedMotion = reducedMotionQuery.matches;
    let currentScale = 1;
    let targetScale = currentScale;
    let frameId = 0;

    const getTargetScale = () => {
      if (reducedMotion) return 1;

      const distance = Math.max(window.innerHeight * scrollDistance, 1);
      const progress = Math.min(Math.max(window.scrollY / distance, 0), 1);

      return 1 + (scrollZoom - 1) * progress;
    };

    const renderFrame = () => {
      frameId = 0;
      targetScale = getTargetScale();

      if (reducedMotion) {
        currentScale = 1;
      } else {
        currentScale += (targetScale - currentScale) * smoothing;
      }

      image.style.setProperty("--hero-scroll-scale", currentScale.toFixed(5));

      if (Math.abs(targetScale - currentScale) > 0.0001) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const requestRender = () => {
      targetScale = getTargetScale();

      if (!frameId) {
        frameId = window.requestAnimationFrame(renderFrame);
      }
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      requestRender();
    };

    image.style.setProperty("--hero-scroll-scale", String(currentScale));
    requestRender();

    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [scrollZoom, scrollDistance, smoothing]);

  if (mobileSrc) {
    const { props: desktopImageProps } = getImageProps({
      src,
      alt,
      fill: true,
      priority,
      unoptimized,
      sizes,
    });

    const { props: mobileImageProps } = getImageProps({
      src: mobileSrc,
      alt,
      fill: true,
      priority,
      unoptimized,
      sizes,
    });

    return (
      <div className={`${styles.loadZoom} ${wrapperClassName}`}>
        <picture>
          <source
            media={`(max-width: ${mobileBreakpoint}px)`}
            srcSet={mobileImageProps.srcSet}
          />
          <img
            {...desktopImageProps}
            ref={imageRef}
            className={`${styles.scrollImage} ${imageClassName}`}
          />
        </picture>
      </div>
    );
  }

  return (
    <div className={`${styles.loadZoom} ${wrapperClassName}`}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        unoptimized={unoptimized}
        sizes={sizes}
        className={`${styles.scrollImage} ${imageClassName}`}
      />
    </div>
  );
}
