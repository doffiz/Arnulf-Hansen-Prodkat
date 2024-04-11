import { GetServerSidePropsContext } from "next";
import React, { useState } from "react";
import { useRouter } from "next/router";
import createClient from "@/lib/sanityClient";
import { Produkt } from "@/types";
import { generateMetadata } from "@/helpers/generateMetadata";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanityImageBuilder";
import fetchHeaderAndFooterData from "@/helpers/fetchHeaderAndFooter";
import ImageGallery from "@/components/bildegalleri";
import { formatPrice } from "@/helpers/formatPrice";
import SpecsGrid from "@/components/spesifikasjoner";
import LangBeskrivelseComponent from "@/components/langBeskrivelse";
import BildeGalleri from "@/components/bildegrid";
import KatalogerComponent from "@/components/downloads";

interface PageProps {
  pageData: Produkt;
  metadata: any;
}

async function fetchPageData(sku: string): Promise<Produkt> {
  const query = `*[_type == "product" && sku == $sku ]{
    name,
    sku,
    isModel,
    kataloger[]{
        navn,
        url,
        filesize,
        content_type
    },
    family{
        name,
        code,
    },
    brand{
        name,
        code,
    },
    hovedbilde{
        cdnUrl,
        alt,
        caption,
        height,
        width
    },
    forsidebilde{
        cdnUrl,
        alt,
        caption,
        height,
        width
    },
    bildekarusell[]{
        cdnUrl,
        alt,
        caption,
        height,
        width
    },
    bildegalleri[]{
        cdnUrl,
        alt,
        caption,
        height,
        width
    },
    kortBeskrivelse,
    langBeskrivelse[]{
        children[]{
            text
        }
    },
    newProduct,
    leverandorUrl,
    toPriceIncVat,
    specs[]{
        label,
        value,
        group
    },
    values {
        included_propeller_size,
        shaft_length,
        weight,
        propeller_size_from,
        propeller_size_to,
        recommended_transom_height,
        power_hp,
        power_kw,
        displacement
    },
    varianter[]{
        sku,
        name,
        mainImage,
        fromPriceExVat,
        fromPriceIncVat,
        toPriceExVat,
        toPriceIncVat,
        vatRate,
        values {
            included_propeller_size,
            shaft_length,
            weight,
            propeller_size_from,
            propeller_size_to,
            recommended_transom_height,
            power_hp,
            power_kw,
            displacement
        }
    },
    seoTitle,
    seoDescription,
    seoKeywords,
      }[0]`;

  const params = { sku };
  const page: Produkt = await createClient.fetch(query, params);

  return page;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, params } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
  const headerAndFooterData = await fetchHeaderAndFooterData();
  const pageData = await fetchPageData(params?.id as string);
  console.log(pageData);
  let ogImageUrl = null;
  if (!pageData) {
    return {
      notFound: true,
    };
  }
  if (pageData && pageData.hovedbilde && pageData.hovedbilde.cdnUrl) {
    const ogImage = pageData.hovedbilde.cdnUrl;
    ogImageUrl = pageData.hovedbilde.cdnUrl;
    console.log("ogImageUrl:", ogImageUrl); // Debugging log
  } else {
    console.log("pageData.hovedbilde:", pageData?.hovedbilde); // Debugging log
  }
  const setup = {
    title: pageData.name,
    description: pageData.seoDescription || pageData.kortBeskrivelse || "",
    keywords: pageData.seoKeywords || "",
    hovedbilde: pageData.hovedbilde,
  };

  return {
    props: {
      ...headerAndFooterData,
      metadata: generateMetadata(setup, baseUrl),
      pageData,
    },
  };
}

export default function PostPage({ pageData, metadata }: PageProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    pageData.varianter && pageData.varianter.length > 0
      ? pageData.varianter[0]
      : null
  );
  console.log(pageData);
  const router = useRouter();

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
        <section
          className={
            pageData.forsidebilde && pageData.forsidebilde.cdnUrl !== ""
              ? ""
              : "sr-only"
          }
        >
          {pageData.forsidebilde && pageData.forsidebilde.cdnUrl !== "" && (
            <>
              <Image
                src={pageData.forsidebilde.cdnUrl}
                alt={pageData.forsidebilde.alt}
                width={pageData.forsidebilde.width / 2}
                height={pageData.forsidebilde.height / 2}
                className="object-cover w-full h-[60vh]"
              />
              <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-t from-black to-transparent" />
              <div className="absolute top-0 left-0 w-full h-[60vh] flex flex-col items-center justify-center">
                <h1 className="text-white font-black text-6xl">
                  {pageData.name}
                </h1>
              </div>
            </>
          )}
        </section>
        <section className="max-w-[1300px] mx-auto p-8 gap-8 py-4 flex">
          <div className="basis-1/2">
            <ImageGallery
              hovedbilde={pageData.hovedbilde}
              bildekarusell={pageData.bildekarusell}
            />
          </div>
          <div className="basis-1/2 p-8 flex flex-col gap-2">
            <p>{pageData.brand.name.toUpperCase()}</p>
            <h2 className="text-6xl font-black">{pageData.name}</h2>
            <p>{pageData.kortBeskrivelse}</p>
            <div className="p-4 bg-slate-200 rounded-xl flex flex-col gap-2">
              {pageData.varianter &&
                pageData.varianter.length > 0 &&
                selectedVariant && (
                  <p className="text-slate-700 text-sm flex flex-col gap-2">
                    VARENUMMER: {selectedVariant.sku}
                  </p>
                )}
              {(!pageData.varianter || pageData.varianter.length === 0) &&
                pageData.sku && (
                  <p className="text-slate-700 text-sm flex flex-col gap-2">
                    VARENUMMER: {pageData.sku}
                  </p>
                )}
              {pageData.varianter &&
                pageData.varianter.length > 0 &&
                pageData.family.code &&
                pageData.family.code === "baat" && (
                  <>
                    <p className="font-semibold">Motor:</p>
                  </>
                )}
              {(pageData.varianter &&
                pageData.varianter.length > 0 &&
                pageData.family.code &&
                pageData.family.code === "outboard_motor_electric") ||
                (pageData.family.code === "outboard_motor_fossil" && (
                  <>
                    <p className="font-semibold">Stammelengde:</p>
                  </>
                ))}
              <div className="flex flex-wrap gap-2">
                {pageData.varianter &&
                  pageData.varianter.map((variant, index) => (
                    <div
                      className={`w-fit p-4 rounded cursor-pointer ${
                        selectedVariant && selectedVariant.sku === variant.sku
                          ? "bg-white border-2 border-slate-950"
                          : "bg-white border-1 border-slate-400"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedVariant(variant);
                        router.push(
                          {
                            pathname: router.pathname,
                            query: { ...router.query, variant: variant.sku },
                          },
                          undefined,
                          { shallow: true }
                        );
                      }}
                    >
                      <p className="">{variant.sku}</p>
                    </div>
                  ))}
              </div>
              {((selectedVariant && selectedVariant.toPriceIncVat !== 0) ||
                pageData.toPriceIncVat !== 0) && (
                <div>
                  <p className="text-sm text-slate-700">
                    Veil. utsalgspris fra
                  </p>
                  <strong className="text-3xl mt-4 font-black">
                    {selectedVariant && selectedVariant.toPriceIncVat !== 0
                      ? formatPrice(selectedVariant.toPriceIncVat)
                      : pageData.toPriceIncVat !== 0
                      ? formatPrice(pageData.toPriceIncVat)
                      : null}
                    {",-"}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </section>
        {pageData.specs && <SpecsGrid specs={pageData.specs} />}
        {pageData.langBeskrivelse && (
          <LangBeskrivelseComponent
            langBeskrivelse={pageData.langBeskrivelse}
          />
        )}
        {pageData.bildegalleri && pageData.bildegalleri.length > 0 && (
          <BildeGalleri bildegalleri={pageData.bildegalleri} />
        )}
        {pageData.kataloger && pageData.kataloger.length > 0 && (
          <KatalogerComponent kataloger={pageData.kataloger} />
        )}
      </main>
    </>
  );
}
