import createClient from "../lib/sanityClient";
import { urlFor } from "@/lib/sanityImageBuilder";
import { setupQuery, ansattesettingsQuery } from "@/queries";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { generateMetadata } from "@/helpers/generateMetadata";
import { BlockNode, ImageNode, Ansatt } from "@/types";
import fetchHeaderAndFooterData from "@/helpers/fetchHeaderAndFooter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "@/components/breadcrumb";
import CustomPortableText from "@/helpers/CustomPortableText";

type Props = {
  ansatte: Ansatt[];
  setup: any;
  metadata: any;
};

export default function AnsattePage({
  ansatte,
  setup,
  metadata,
}: Props) {
console.log(ansatte);
  // Render your page here
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
      <main className="bg-[#efefef] text-black min-h-screen">
        <Breadcrumb data={setup} />
        <section className="max-w-[1600px] mx-auto px-4 md:px-12 py-4 ">
          <h1 className="text-5xl font-bold py-2">{setup.title}</h1>
          {setup.ingress && ( <p className="text-xl my-4">{setup.ingress}</p> )}
          {setup.ingressImage && setup.ingressImageShow && (
            <Image className="my-6" alt={setup.ingressImage.alt} src={setup.ingressImage.asset.url} width={1600} height={900} />
            )}
          {setup.content && (

            <CustomPortableText content={setup.content} />
            )}
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {ansatte && ansatte.map((ansatt, index) => (
              <li key={ansatt._id} className="flex flex-col gap-2">
                <Image
                  width={300}
                  height={300}
                  className="w-full"
                  src={
                    urlFor(ansatt.image.asset._ref)
                    .width(500)
                    .height(500)
                    .url() || ""
                  }
                  alt={ansatt.image.alt}
                  priority={index < 3}
                  />
                  { ansatt.name && ( <h2 className="text-3xl font-bold my-2">{ansatt.name}</h2>)}
                  { ansatt.description && ( <p>{ansatt.description}</p> )}
                    {ansatt.email && (
                      <p className="underline flex items-center gap-2"><FontAwesomeIcon className="w-4 h-4" icon={["fas", "envelope"]} /><a href={`mailto:${ansatt.email}`}>{ansatt.email}</a></p>
                      )}                    
                    {ansatt.phone && (
                      <p className="flex items-center gap-2"><FontAwesomeIcon className="w-4 h-4" icon={["fas", "phone"]} /><a href={`tel:${ansatt.phone.replace(/\s/g, '')}`}>{ansatt.phone}</a></p>
                      )}           </li>
                      ))}
          </ul>
        </section>
      </main>
      </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";

  const query = '*[_type == "employee"]';
  const ansatte = await createClient.fetch(query);
  const nav = await createClient.fetch(setupQuery);
  const setup = await createClient.fetch(ansattesettingsQuery);
  const headerAndFooterData = await fetchHeaderAndFooterData();

console.log(ansatte);
  console.log(setup);

  return {
    props: {
      ...headerAndFooterData,
      ansatte,
      menu: nav.menu[0],
      setup,
      headersetup: nav.setup[0],
      metadata: generateMetadata(setup, baseUrl),
    },
  };
}
