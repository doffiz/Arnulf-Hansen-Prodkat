import React from "react";
import { urlFor } from "@/lib/sanityImageBuilder";
import Image from "next/image";
import { TextChild, TextBlock } from "@/types";

interface Props {
  annenhver: {
    Bilde: {
      asset: {
        _ref: string;
      };
      alt: string;
    };
    Overskrift: string;
    Ingress: string;
    Tekst: TextBlock[];
    bgfarge: string;
    tekstfarge: string;
    
      };
  isReverse: boolean;
}

// ... (imports)

const Annenhver: React.FC<Props> = ({ annenhver, isReverse }) => {
  const { Bilde, Overskrift, Tekst, bgfarge, tekstfarge, Ingress } = annenhver;
  let imageUrl = '';
  if (Bilde && Bilde.asset && Bilde.asset._ref) {
    imageUrl = urlFor(Bilde.asset._ref).url();
  }  
  let bakgrunn = bgfarge ? bgfarge : isReverse ? "#f5f5f5" : "transparent";
  let tekst = tekstfarge ? tekstfarge : "#000000";
  const flexDirection = isReverse ? "md:flex-row-reverse" : "md:flex-row";

  return (
    <section
      className="w-screen py-20"
      style={{ backgroundColor: bakgrunn, color: tekst }}
    >
      <div
        className={`flex flex-col ${flexDirection} gap-20 max-w-[1600px] mx-auto px-12`}
      >
        <div className="flex-1">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={Bilde.alt}
              width={640}
              height={640}
              loading="lazy"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col gap-4 justify-center">
          <h2 className="text-5xl font-bold">{Overskrift}</h2>
          {Ingress && (
            <p className="text-xl">{Ingress}</p>
          )}
          {Tekst && (
            <div>
              {Tekst.map((block) =>
                block.children.map((child) => (
                  <p className="text-md" key={child._key}>
                    {child.text}
                  </p>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Annenhver;
