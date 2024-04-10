import Link from "next/link";
import dynamic from "next/dynamic";
import { Open_Sans } from "next/font/google";
const opensans = Open_Sans({ subsets: ["latin"] });
const FontAwesomeIcon = dynamic(
    () => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon),
    { ssr: false }
  );
  import { faAccessibleIcon } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import CustomPortableText from "@/helpers/CustomPortableText";
library.add(faAccessibleIcon);

interface BlockNode {
  style: string;
  children: { text: string }[];
}

interface ImageNode {
  image: { asset: { _ref: string } };
}

export default function Footer({ footer }: { footer: any }) {
  console.log("footer", footer);
  let bg = footer.bgColor.hex ? footer.bgColor.hex : "#f5f5f5";
  let tekst = footer.textColor.hex ? footer.textColor.hex : "#000000";

  return (
    <footer
      style={{ backgroundColor: bg, color: tekst }}
      className={`flex ${opensans.className} flex-col gap-4 items-center justify-center px-12 py-20`}
    >
      <div className="max-w-[1600px] mx-auto flex gap-20 items-center justify-center">
      {footer && footer.columns && footer.columns.map((column: any, index: number) => (
  <div key={index}>
   <CustomPortableText content={column.content} />
   </div>
))}
      </div>
      <div className="flex flex-col gap-4 text-center">
        { footer && footer.personvern && (
          <Link className="text-sky-200 underline" href="/personvern">Personvern og informasjonskapsler</Link>
        )}
        {footer && footer.byline && <Link className="px-4 flex items-center py-1 hover:bg-white hover:text-black rounded-xl" href="https://digitaltbyra.no">Universelt utformet nettside <FontAwesomeIcon className="mx-2 w-4 h-4" icon={['fab', 'accessible-icon']} />fra Digitalt Byrå</Link>}      </div>
    </footer>
  );
}
