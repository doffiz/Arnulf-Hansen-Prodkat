import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/lib/sanityImageBuilder";
import { getImageDimensions } from "@sanity/asset-utils";

interface CustomPortableTextProps {
    content: any;
}

const CustomPortableText: React.FC<CustomPortableTextProps> = ({ content }) => {
    if (!content) {
        return null;
    }

    return (
        <PortableText
            value={content}
            components={{
                block: {
                    h2: ({ children }: { children?: any }) => (
                        <h2 className="text-3xl text-bold">{children}</h2>
                    ),
                    h3: ({ children }: { children?: any }) => (
                        <h3 className="text-2xl text-bold">{children}</h3>
                    ),
                    normal: ({ children }: { children?: any }) => (
                        <p className="text-lg">{children}</p>
                    ),
                    postImageBlock: (props: any) => {
                        const node = props.node;
                        const dimensions = getImageDimensions(node.image.asset);
                        return (
                            <Image
                                className="my-6"
                                width={dimensions.width}
                                height={dimensions.height}
                                src={urlFor(node.image.asset).url()}
                                alt={node.image.alt}
                            />
                        );
                    },
                },
                marks: {
                    strong: ({ children }: { children: any }) => (
                        <strong className="font-bold">{children}</strong>
                    ),
                },
            }}
        />
    );
};

export default CustomPortableText;