import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Open_Sans } from "next/font/google";
const opensans = Open_Sans({ subsets: ["latin"] });

type LinkType = {
  internalLink?: {
    _ref: string;
    slug?: {
      current: string;
    };
  };
  externalLink?: string;
};

type MenuItem = {
  title: string;
  link: LinkType;
};

type Menu = {
  navbarMenuItems: MenuItem[];
  menuType: string;
  menuColor: string;
  menuTextColor: string;
  extranav: MenuItem[];
};

type ImageType = {
  asset: {
    url: string;
  };
};

type Setup = {
  logo: ImageType;
  title: string;
};

type Props = {
  menu: Menu;
  setup: Setup;
};

export default function Header({ menu, setup }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  console.log(menu);
  return (
    <>
      <header
        className={`${opensans.className}`}
        style={{ backgroundColor: menu.menuColor, color: menu.menuTextColor }}
      >
        <div className="flex items-center justify-between py-4 px-[20px] md:min-h-[220px] xl:px-0 lg:text-xl text-lg max-w-[1300px] mx-auto">
          <Link
            className="max-h-[50px] md:max-h-[100px] max-w-[150px] md:max-w-[450px] w-full"
            href="/"
          >
            <Image
              src={setup.logo.asset.url}
              width={250}
              height={100}
              className="md:max-h-[100px] max-h-[50px] max-w-[150px] md:max-w-[450px] w-full"
              alt={setup.title + " - Til forsiden"}
            />
          </Link>
          <div className="flex flex-col items-end justify-start">
          {menu.extranav && (
            <nav>
              <ul className="flex gap-4 px-4 ">
                {menu.extranav &&
                  menu.extranav.map((item) => (
                    <li className="border-[1px] rounded-full cursor-pointer text-[1rem] font-semibold px-4 py-[0.2rem] hover:bg-white hover:text-[#842426]" key={item.title}>
                      <Link
                        role="button"
                        href={
                          item.link?.externalLink ||
                          `/${item.link?.internalLink?.slug?.current ?? "#"}`
                        }
                        >
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          
          )}
          {menu.menuType === "hamburger" ? (
            <button
            className="flex flex-col p-4 justify-end w-fit items-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <FontAwesomeIcon icon={isMenuOpen ? "times" : "bars"} size="2x" />
              Meny
            </button>
          ) : (
            <nav className={`hidden lg:flex`}>
              <ul className="flex gap-4">
                {menu.navbarMenuItems &&
                  menu.navbarMenuItems.map((item) => (
                    <li key={item.title}>
                      <Link
                        href={
                          item.link?.externalLink ||
                          `/${item.link?.internalLink?.slug?.current ?? "#"}`
                        }
                        >
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          )}
          </div>
        </div>
      {isMenuOpen && (
  <nav
    style={{ backgroundColor: menu.menuColor, color: menu.menuTextColor }}
    className="flex flex-col gap-4 w-full p-12 text-2xl"
  >
    <ul className="grid max-w-[1300px] w-full mx-auto grid-cols-2 gap-4 pointer">
      {menu.navbarMenuItems &&
        menu.navbarMenuItems.map((item) => (
          <li
            key={item.title}
            className="text-[#852526] cursor-pointer text-3xl bg-white border border-white group hover:bg-[#852526] hover:text-white px-[30px] py-[20px] transition-all duration-300 ease-in-out"
          >
            <Link
              className="transition-transform ease-in-out duration-500 group-hover:ml-[5px] "
              href={
                item.link?.externalLink ||
                `/${item.link?.internalLink?.slug?.current ?? "#"}`
              }
            >
              {item.title}
            </Link>
          </li>
      ))}
    </ul>
  </nav>
)}
      </header>



    </>
  );
}
