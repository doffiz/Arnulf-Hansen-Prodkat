import Image from "next/image";
import { Open_Sans } from "next/font/google";
import { frontPageQuery, setupIndexQuery, navQuery, footerQuery, cat } from "@/queries";
import Head from "next/head";
import { GetServerSidePropsContext } from "next";
import { urlFor } from "@/lib/sanityImageBuilder";
import createClient from "@/lib/sanityClient";
import { generateMetadata } from "@/helpers/generateMetadata";
import Categories from "@/components/categories";

const opensans = Open_Sans({ subsets: ["latin"] });

export default function Home({
  metadata,
  frontPage,
  categories,

}: {
  metadata: any;
  frontPage: any;
  menu: any;
  setup: any;
  categories: any;

}) {
  console.log("frontPage", frontPage);
  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={metadata.openGraph.url} />
        <meta property="og:locale" content="nb_NO" />
        {metadata.openGraph.images.map((url: string, index: number) => (
          <meta key={index} property="og:image" content={url} />
        ))}
      </Head>

      <main
        className={`flex min-h-screen bg-slate-50 flex-col md:gap-20 gap-4 items-center justify-between ${opensans.className}`}
      >
       <Categories categories={categories} />

      </main>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
  try {
    const setupData = await createClient.fetch(setupIndexQuery);
    const metadata = generateMetadata(setupData.setup[0], baseUrl);
    const frontPage = await createClient.fetch(frontPageQuery);
    const menuData = await createClient.fetch(navQuery);
    const footerData = await createClient.fetch(footerQuery);
    const categories = await createClient.fetch(cat).catch(console.error);
        console.log(categories);
    console.log(setupData);
    return {
      props: {
        frontPage: frontPage,
        metadata,
        menu: menuData.menu[0],
        setup: setupData.setup[0],
        footerData: footerData[0],
        categories: categories,
      },
    };
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    return {
      props: {
        metadata: null,
        frontPage: null,
        menu: null,
        setup: null,
        footerData: null,
        categories: null,
      },
    };
  }
}

