import React, { useState } from "react";
import {
  isImageFitCover,
  isImageSlide,
  useLightboxProps,
  useLightboxState,
} from "yet-another-react-lightbox";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



interface ImageGalleryProps {
  hovedbilde: {
    cdnUrl: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  };
  bildekarusell: {
    cdnUrl: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
  }[];
}
/* eslint-disable */
// @ts-ignore
const NextJsImage = ({ slide, offset, rect }) => {
  console.log("Rendering NextJsImage", slide);
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps();

  const { currentIndex } = useLightboxState();

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit);

  if (!isNextJsImage(slide)) return null;

  const width = !cover
    ? Math.round(
        Math.min(rect.width, (rect.height / slide.height) * slide.width)
      )
    : rect.width;

  const height = !cover
    ? Math.round(
        Math.min(rect.height, (rect.width / slide.width) * slide.height)
      )
    : rect.height;
// @ts-ignore
  function isNextJsImage(slide) {
    return (
      isImageSlide(slide) &&
      typeof slide.width === "number" &&
      typeof slide.height === "number"
    );
  }

  return (
    <div style={{ position: "relative", width, height }}>
      <Image
        layout="fill"
        alt=""
        src={slide}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? "blur" : undefined}
        style={{
          objectFit: cover ? "cover" : "contain",
          cursor: click ? "pointer" : undefined,
        }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={
          offset === 0 ? () => click?.({ index: currentIndex }) : undefined
        }
      />
    </div>
  );
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
  hovedbilde,
  bildekarusell,
}) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [open, setOpen] = useState(false);
  const images = [hovedbilde, ...bildekarusell].map((bilde) => ({
    src: bilde.cdnUrl,
    width: bilde.width || 700,
    height: bilde.height || 500,
    alt: bilde.alt,
  }));

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((currentImage - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-8 mt-8">
      <div className="max-h-[60vh] border-2 flex items-center justify-center p-12 aspect-square rounded-lg object-cover cursor-pointer">
        <button
          className="p-4 h-fit hover:bg-slate-100 rounded-full"
          onClick={prevImage}
        >
          <FontAwesomeIcon icon="chevron-left" />
        </button>
        <Image
          className="mix-blend-darken max-h-[50vh] object-contain"
          src={images[currentImage].src}
          alt={images[currentImage].alt}
          width={images[currentImage].width !== 0 ? images[currentImage].width : 700}
height={images[currentImage].height !== 0 ? images[currentImage].height : 500}
          onClick={() => {
            setOpen(true);
            setCurrentImage(currentImage);
          }}
        />
        <button
          className="p-4 h-fit hover:bg-slate-200 rounded-full"
          onClick={nextImage}
        >
          <FontAwesomeIcon icon="chevron-right" />
        </button>
      </div>

      <div className="grid grid-cols-8 gap-2 cursor-pointer">
        {bildekarusell.map((bilde, index) => (
          <div
            className="h-[100px] w-full max-h-[50px] aspect-square object-contain"
            key={index}
            onClick={() => {
              setOpen(true);
              setCurrentImage(index + 1);
            }}
          >
            <Image
              tabIndex={0}
              className="mix-blend-darken h-full w-full object-contain rounded-sm"
              src={bilde.cdnUrl}
              alt=""
              width={150}
              height={150}
              onClick={() => {
                setOpen(true);
                setCurrentImage(index + 1);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  setOpen(true);
                  setCurrentImage(index + 1);
                }
              }}
            />
          </div>
        ))}
      </div>
      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          slides={[
            images[currentImage],
            ...images.slice(0, currentImage),
            ...images.slice(currentImage + 1),
          ]}
          render={{ slide: NextJsImage }}
        />
      )}
    </div>
  );
};
/* eslint-enable */

export default ImageGallery;
