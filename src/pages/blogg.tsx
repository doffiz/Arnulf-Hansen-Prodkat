import createClient from "../lib/sanityClient";
import { urlFor } from "@/lib/sanityImageBuilder";
import { setupQuery, bloggsettingsQuery, footerQuery } from "@/queries";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import { generateMetadata } from "@/helpers/generateMetadata";
import BlockContent from "@sanity/block-content-to-react";
import { BlockNode, ImageNode, Artikkel } from "@/types";
import fetchHeaderAndFooterData from "@/helpers/fetchHeaderAndFooter";
import Breadcrumb from "@/components/breadcrumb";


type Props = {
  artikler: Artikkel[];
  menu: any;
  setup: any;
  footer: any;
  metadata: any;
  headersetup: any;
};

export default function ArtikkelPage({
  artikler,
  setup,
  metadata,
}: Props) {

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
        <section className="max-w-[1600px] mx-auto px-4 md:p-12 py-4 ">
          <h1 className="text-5xl font-bold py-2">{setup.title}</h1>
          {setup.ingress && ( <p className="text-xl my-4">{setup.ingress}</p> )}
          {setup.ingressImage && setup.ingressImageShow && (
            <Image className="my-6" alt={setup.ingressImage.alt} src={setup.ingressImage.asset.url} width={1600} height={900} />
            )}
          {setup.content && (
            <BlockContent
            blocks={setup.content}
            serializers={{
              types: {
                block: ({ node }: { node: BlockNode }) => {
                  if (node.style === "h2") {
                    return (
                      <h2 className="text-3xl text-center text-bold">
                          {node.children[0].text}
                        </h2>
                      );
                    }
                    return <p className="text-lg">{node.children[0].text}</p>;
                  },
                  postImageBlock: ({ node }: { node: ImageNode }) => (
                    <img
                    className="image-class-name"
                    src={urlFor(node.image.asset).url()}
                    />
                    ),
                  },
                  marks: {
                    strong: ({ children }: { children: React.ReactNode }) => (
                      <strong className="strong-class-name">{children}</strong>
                      ),
                      em: ({ children }: { children: React.ReactNode }) => (
                        <em className="em-class-name">{children}</em>
                        ),
                      },
                      list: ({ children }: { children: React.ReactNode }) => (
                        <ul className="list-class-name">{children}</ul>
                        ),
                        listItem: ({ children }: { children: React.ReactNode }) => (
                          <li className="list-item-class-name">{children}</li>
                          ),
                        }}
                        />          )}
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
            {artikler.map((artikkel, index) => (
              <li key={artikkel.slug.current}>
                <Link href={`/blogg/${artikkel.slug.current}`}>
                <Image
                  width={410}
                  height={270}
                  className="w-full"
                  src={
                    urlFor(artikkel.ingressImage.asset._ref)
                    .width(410)
                    .height(270)
                    .url() || ""
                  }
                  alt={artikkel.ingressImage.alt}
                  priority={index < 3}
                  />
                  <h2 className="text-3xl font-bold my-2">{artikkel.title}</h2>
                  <p>{artikkel.ingress}</p>
                </Link>
              </li>
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

  const query = '*[_type == "post"]';
  const artikler = await createClient.fetch(query);
  const setup = await createClient.fetch(bloggsettingsQuery);
  const headerAndFooterData = await fetchHeaderAndFooterData();

  console.log(setup);

  return {
    props: {
      ...headerAndFooterData,
      artikler,
      setup,
      metadata: generateMetadata(setup, baseUrl),
    },
  };
}
