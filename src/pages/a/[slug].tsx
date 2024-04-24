 // @ts-nocheck
 import { GetServerSidePropsContext } from "next";
 import React, { useState } from "react";
 import { useRouter } from "next/router";
 import { useEffect } from "react";
 import createClient from "@/lib/sanityClient";
 import { Page } from "@/types";
 import { generateMetadata } from "@/helpers/generateMetadata";
 import Head from "next/head";
 import Image from "next/image";
 import Link from "next/link";
 import { urlFor } from "@/lib/sanityImageBuilder";
 import fetchHeaderAndFooterData from "@/helpers/fetchHeaderAndFooter";
  import  CustomPortableText  from "@/helpers/CustomPortableText";
  import Hero from "@/components/hero";
  import Annenhver from "@/components/annenhver";
  import Contact from "@/components/contact";

 
 interface PageProps {
   pageData: Page;
   metadata: any;
 }
 


async function fetchPageData(slug: string): Promise<Produkt> {
    const query = `*[_type == "page" && slug.current == $slug]{
        title,
        slug,
        ingress,
        ingressImage{
            asset->{
                _id,
                url
            },
            alt
        },
        showTitleAndIngress,
        showIngressImage,
        content,
        parent->{
            title,
            slug
        },
        seoTitle,
        pageBuilder,
        seoDescription,
        seoKeywords,
        seoImage{
            asset->{
                _id,
                url
            },
            alt
        }
    }[0]`;

    const params = { slug };
    const page: Page = await createClient.fetch(query, params);

    return page;
}
 
 export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { req, params } = context;
    const protocol = req.headers["x-forwarded-proto"] || "http";
    const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
    const headerAndFooterData = await fetchHeaderAndFooterData();
    
    const slug = Array.isArray(params?.slug) ? params.slug[1] : params?.slug;
    
    const pageData = await fetchPageData(slug as string);
    console.log("PG:", pageData);
   let ogImageUrl = null;

   if (pageData.ingressImage) {
      ogImageUrl = pageData.ingressImage.asset.url;
    } else {
      ogImageUrl = "";
    }

   const setup = {
     title: pageData.title,
     description: pageData.seoDescription || pageData.ingress || "",
     keywords: pageData.seoKeywords || [],
     hovedbilde: ogImageUrl,
   };
 
   if (!pageData) {
    return {
      notFound: true,
    };
  }



   return {
     props: {
       ...headerAndFooterData,
       metadata: generateMetadata(setup, baseUrl),
       pageData,
     },
   };
 }
 
 export default function PostPage({ pageData, metadata }: PageProps) {
   
     const router = useRouter();
        console.log("PG:", pageData);
      
 
   return (
     <>
       <Head>
         <title>{metadata.title} | Arnulf Hansen</title>
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
       <main className="min-h-screen text-black bg-slate-50 relative">
       <section className={`max-w-[1300px] mx-auto px-4 py-24 ${!pageData.showTitleAndIngress ? 'sr-only' : ''}`}>
        <div className={`${pageData.showIngressImage ? 'flex gap-8' : ''}`}>
          <div className={`${pageData.showIngressImage ? 'basis-1/2' : ''} flex flex-col gap-4`}>
          <h1 className={`text-5xl font-bold py-2 `}>{pageData.title}</h1>
          {pageData.ingress && (
            <strong className="text-xl">{pageData.ingress}</strong>
            )}
            <CustomPortableText content={pageData.content} />
            </div>
            {pageData.ingressImage && pageData.showIngressImage && (
              <Image
                className="basis-1/2"
                alt={pageData.ingressImage.alt}
                src={pageData.ingressImage.asset.url}
                width={900}
                height={900}
              />
            )}
          </div>
  
          </section>
          {pageData.pageBuilder && pageData.pageBuilder.map((block: any, index: number) => {
          if (block._type === "hero") {
            const imageUrl = urlFor(block.bannerfoto.asset._ref).width(1600).height(900).url();
            return (
              <Hero
                key={index}
                image={imageUrl}
                title={block.overskrift}
                ingress={block.ingresstekst}
              />
            );
          }
          if (block._type === "annenhveropplistning") {
            return (
              <Annenhver
                key={index}
                annenhver={block}
                isReverse={index % 2 === 0}
              />
            );
          }
          if (block._type === "contact") {
            return (
              <Contact key={index} contact={block} />
            )
          }
        })}
       </main>
     </>
   );
 }
 