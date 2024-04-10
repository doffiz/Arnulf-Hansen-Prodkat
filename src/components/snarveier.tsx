import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Link from "next/link";
import dynamic from 'next/dynamic';

const FontAwesomeIcon = dynamic(
  () => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon),
  { ssr: false }
);

library.add(fab, fas, far);

type ShortcutItem = {
  title: string;
  icon?: string;
  link: {
    internalLink?: {
      _type: string;
      _id: string;
      slug: {
        current: string;
      };
    };
    externalLink?: string;
  };
};

type ShortcutArrayProps = {
  shortcutArray: ShortcutItem[];
};

const ShortcutGrid: React.FC<ShortcutArrayProps> = ({ shortcutArray }) => {
  console.log(shortcutArray);
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2 md:gap-8 max-w-[1600px] w-full md:px-12 px-4">
      {shortcutArray.map((item, index) => {
        const link = item.link.internalLink
          ? item.link.internalLink.slug.current
          : item.link.externalLink;

        return (
          link && (
            <Link key={index} href={link}>
              <div className="border border-gray-300 md:p-16 p-4 rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-4">
                {item.icon && <FontAwesomeIcon className="max-w-12 max-h-12" color="black" size="2x" icon={item.icon as IconProp} />} 
                <h2 className="font-semibold text-md sm:text-xl md:text-3xl text-black">{item.title}</h2>
              </div>
            </Link>
          )
        );
      })}
    </section>
  );
};

export default ShortcutGrid;
