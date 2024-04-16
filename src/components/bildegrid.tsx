import React, { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Masonry from "react-masonry-css";

interface ImageProps {
    cdnUrl: string;
    alt: string;
    caption: string;
    width: number;
    height: number;
}

const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    700: 3,
    500: 2,
};

interface BildeGalleriProps {
    bildegalleri: ImageProps[];
}

const BildeGalleri: React.FC<BildeGalleriProps> = ({ bildegalleri }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [open, setOpen] = useState(false);

    const images = bildegalleri.map((bilde) => ({
        src: bilde.cdnUrl,
        width: bilde.width,
        height: bilde.height,
        alt: bilde.alt,
    }));

    return (
        <section className="mx-auto max-w-[1300px] p-8">
            <h2 className="text-5xl font-bold text-center my-12">Bildegalleri</h2>
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {images.map((image, index) => (
                    <div
                        className="cursor-pointer"
                        key={index}
                        onClick={() => {
                            setOpen(true);
                            setCurrentImage(index);
                        }}
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={image.width || 300}
                            height={image.height || 500}
                        />
                    </div>
                ))}
            </Masonry>
            {open && (
                <Lightbox
                    open={open}
                    close={() => setOpen(false)}
                    slides={[
                        images[currentImage],
                        ...images.slice(0, currentImage),
                        ...images.slice(currentImage + 1),
                    ]}
                />
            )}
        </section>
    );
};

export default BildeGalleri;