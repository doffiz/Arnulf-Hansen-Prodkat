import { GetServerSidePropsContext } from "next";
import createClient from "../lib/sanityClient";
import { Side } from "@/types";
import { generateMetadata } from "@/helpers/generateMetadata";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanityImageBuilder";
import fetchHeaderAndFooterData from "@/helpers/fetchHeaderAndFooter";
import Accordion from "@/components/accordion";
import { Products } from "@/types";
import { useState } from "react";
import { formatPrice } from "@/helpers/formatPrice";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface PageProps {
  pageData: Side;
  metadata: any;
  products: Products[];
}

async function fetchPageData(slug: string): Promise<Side> {
  const query = `*[_type == "categories" && slug.current == $slug]{
    navn,
    slug,
    hovedfoto{
      asset->{
          url,
      },
      alt
  },
  headerFoto{
    asset->{
        url,
    },
    alt
},
    beskrivelse,
    inkluderteFamilier[]->{
        name,
        code,
        updatedAt,
    }
      }[0]`;
  const params = { slug };
  const page: Side = await createClient.fetch(query, params);
  return page;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, params } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
  const headerAndFooterData = await fetchHeaderAndFooterData();
  const pageData = await fetchPageData(params?.category as string);
  console.log("REF", pageData.hovedfoto.asset._ref);
  console.log(pageData);
  let ogImageUrl = null;
  if (!pageData) {
    return {
      notFound: true,
    };
  }
  if (
    pageData &&
    pageData.hovedfoto &&
    pageData.hovedfoto.asset &&
    pageData.hovedfoto.asset.url
  ) {
    const ogImage = pageData.hovedfoto.asset.url;
    ogImageUrl = pageData.hovedfoto.asset.url;
    console.log("ogImageUrl:", ogImageUrl); // Debugging log
  } else {
    console.log("pageData.hovedfoto:", pageData?.hovedfoto); // Debugging log
  }
  const setup = {
    title: pageData.navn,
    description: pageData.description || pageData.beskrivelse || "",
    keywords: pageData.keywords || "",
    hovedfoto: pageData.hovedfoto,
  };
  const codes = pageData.inkluderteFamilier.map((familie) => familie.code);
  const productsQuery = `*[_type == "product" && family.code in $codes && defined(hovedbilde.cdnUrl) && hovedbilde.cdnUrl != ""]`;
  const productsParams = { codes: codes };
  let products: Products[] = await createClient.fetch(
    productsQuery,
    productsParams
  );

  const productNames = new Set();
  products = products.filter((product) => {
    if (productNames.has(product.name)) {
      return false;
    } else {
      productNames.add(product.name);
      return true;
    }
  });

  return {
    props: {
      ...headerAndFooterData,
      metadata: generateMetadata(setup, baseUrl),
      pageData,
      products,
    },
  };
}

export default function PostPage({ pageData, metadata, products }: PageProps) {
  const [numToShow, setNumToShow] = useState(24);
  const router = useRouter();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedFamilies, setSelectedFamilies] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('brand-asc');
  const [checkedBrands, setCheckedBrands] = useState<string[]>([]); // State for the checked brands
  const [results, setResults] = useState<Products[]>(products);


  const { query } = useRouter();

  useEffect(() => {
    let newBrands = query.brand ? Array.isArray(query.brand) ? query.brand : [query.brand] : [];
    setCheckedBrands(newBrands);
    console.log("newBrands", newBrands);
    console.log("sortedBrands", sortedBrands);
  }, [query]); // Run this effect whenever the query parameters change
  useEffect(() => {
    if (!router.isReady) return;
  
    let brands: string[] = [];
    if (Array.isArray(router.query.brand)) {
      brands = router.query.brand;
    } else if (typeof router.query.brand === "string") {
      brands = [router.query.brand];
    }
  
    let families: string[] = [];
    if (Array.isArray(router.query.family)) {
      families = router.query.family;
    } else if (typeof router.query.family === "string") {
      families = [router.query.family];
    }
    let sortOrder: string = 'brand-asc';
    if (typeof router.query.sortOrder === "string") {
      sortOrder = router.query.sortOrder;
    }

  let newSortOrder = router.query.sortOrder || 'brand-asc';
  setSortOrder(newSortOrder as string);
  
    let filtered = products.filter(product =>
      (brands.length === 0 || (product.brand && brands.includes(product.brand.name))) &&
      (families.length === 0 || (product.family && families.includes(product.family.name)))
    );
  
    let newSortedResults = [...filtered];
  
    switch (sortOrder) {
      case 'brand-asc':
        newSortedResults.sort((a, b) => a.brand.name.localeCompare(b.brand.name));
        break;
      case 'brand-desc':
        newSortedResults.sort((a, b) => b.brand.name.localeCompare(a.brand.name));
        break;
      case 'product-asc':
        newSortedResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'bestsellers':
        newSortedResults.sort((a, b) => (b.isBestseller ? 1 : -1));
        break;
    }
  
    setResults(newSortedResults);
  }, [router.query, sortOrder]);

  const sortResults = (results: Products[]) => {
    let sortedResults = [...results];
  
    switch (sortOrder) {
      case 'brand-asc':
        sortedResults.sort((a, b) => {
          if (a.brand && b.brand) {
            return a.brand.name.localeCompare(b.brand.name);
          }
          return 0;
        });
        break;
      case 'brand-desc':
        sortedResults.sort((a, b) => {
          if (a.brand && b.brand) {
            return b.brand.name.localeCompare(a.brand.name);
          }
          return 0;
        });
        break;
      case 'product-asc':
        sortedResults.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'bestsellers':
        sortedResults.sort((a, b) => (b.isBestseller ? 1 : -1));
        break;
    }
  
    return sortedResults;
  };

  const handleBrandClick = (brandName: string) => {
    setSelectedBrands((prevBrands) => {
      let newBrands: string[];
      if (prevBrands.includes(brandName)) {
        newBrands = prevBrands.filter((brand) => brand !== brandName);
      } else {
        newBrands = [...prevBrands, brandName];
      }
  
      router.push({
        pathname: router.pathname,
        query: { ...router.query, brand: newBrands },
      });
  
      let newResults = products.filter(
        (product) =>
          (newBrands.length === 0 || (product.brand && newBrands.includes(product.brand.name))) &&
          (selectedFamilies.length === 0 || (product.family && selectedFamilies.includes(product.family.name)))
      );
  
      newResults = sortResults(newResults); // Sort the results after filtering
      setResults(newResults);
  
      return newBrands;
    });
  };

  const brandCounts = products.reduce<Record<string, number>>(
    (counts, product: Products) => {
      if (
        product.brand &&
        product.brand.name &&
        (selectedFamilies.length === 0 || (product.family && selectedFamilies.includes(product.family.name)))
      ) {
        if (!counts[product.brand.name]) {
          counts[product.brand.name] = 0;
        }
        counts[product.brand.name]++;
      }
      return counts;
    },
    {}
  );

  const sortedBrands = Object.entries(brandCounts).sort((a, b) => b[1] - a[1]);

  const handleSortChange = (newSortOrder: string) => {
    // Update the sortOrder state
    setSortOrder(newSortOrder);

    // Update the URL with the new sort order
    router.push({
      pathname: router.pathname,
      query: { ...router.query, sortOrder: newSortOrder },
    });
  };
  const handleShowMore = () => {
    setNumToShow(numToShow + 16);
  };

  const familyCounts = products.reduce<Record<string, number>>(
    (counts, product: Products) => {
      if (
        product.family &&
        product.family.name &&
        (selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand.name)))
      ) {
        if (!counts[product.family.name]) {
          counts[product.family.name] = 0;
        }
        counts[product.family.name]++;
      }
      return counts;
    },
    {}
  );
  const sortedFamilies = Object.entries(familyCounts).sort((a, b) => b[1] - a[1]);


const handleFamilyClick = (familyName: string) => {
  setSelectedFamilies((prevFamilies) => {
    let newFamilies;
    if (prevFamilies.includes(familyName)) {
      newFamilies = prevFamilies.filter((family) => family !== familyName);
    } else {
      newFamilies = [...prevFamilies, familyName];
    }

    router.replace({
      pathname: router.pathname,
      query: { ...router.query, family: newFamilies },
    });

    return newFamilies;
  });
};

  console.log("products", products);
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
      <main className="min-h-screen text-black bg-slate-50">
        {/* <Breadcrumb data={pageData} /> */}
        <section
          className={`max-w-[1300px] py-12 gap-6 flex flex-col md:flex-row mx-auto px-4 md:px-2 py-4`}
        >
          <aside className="basis-1/5">
            <Accordion title="MERKE" open={true}>
              <ul>
                {sortedBrands.map(([brandName, count]) => (
                  <li
                    className="cursor-pointer flex items-center gap-2"
                    key={brandName}
                    onClick={() => handleBrandClick(brandName)}
                  >
                    <input
                      className="h-4 w-4 accent-[#842426]"
                      type="checkbox"
                      checked={checkedBrands.includes(brandName)}
                      onChange={() => handleBrandClick(brandName)}
                    />
                    {brandName} ({count})
                  </li>
                ))}
              </ul>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedBrands([]);

                  const { brand, ...query } = router.query;
                  router.replace({
                    pathname: router.pathname,
                    query: query,
                  });
                }}
              >
                Fjern alle filtre
              </a>
            </Accordion>
            <Accordion title="PRODUKTFAMILIE" open={true}>
              <ul>
                {sortedFamilies.map(([familyName, count]) => (
                  <li
                    className="cursor-pointer flex items-center gap-2"
                    key={familyName}
                    onClick={() => handleFamilyClick(familyName)}
                  >
                    <input
                      className="h-4 w-4 accent-[#842426]"
                      type="checkbox"
                      checked={selectedFamilies.includes(familyName)}
                      onChange={() => handleFamilyClick(familyName)}
                    />
                    {familyName} ({count})
                  </li>
                ))}
              </ul>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedFamilies([]);

                  const { family, ...query } = router.query;
                  router.replace({
                    pathname: router.pathname,
                    query: query,
                  });
                }}
              >
                Fjern alle filtre
              </a>
            </Accordion>
            {/* <Accordion title="LOKASJON" open={true}>
              <ul>
                <li className="cursor-pointer flex items-center gap-2">
                  <input className="h-4 w-4 accent-[#842426]" type="checkbox" />
                  Bodø
                </li>
                <li className="cursor-pointer flex items-center gap-2">
                  <input className="h-4 w-4 accent-[#842426]" type="checkbox" />
                  Vågaholmen
                </li>
                <li className="cursor-pointer flex items-center gap-2">
                  <input className="h-4 w-4 accent-[#842426]" type="checkbox" />
                  Ikke spesifisert/begge
                </li>
              </ul>
            </Accordion> */}
          </aside>
          <div className="basis-4/5 flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div>

            <h1 className="text-5xl font-bold py-4">{pageData.navn}</h1>
            {pageData.beskrivelse && (
              <p className="text-xl my-4">{pageData.beskrivelse}</p>
              )}
              </div>
              <select value={sortOrder} className="px-4 py-2 border-2 border-slate-400" onChange={(e) => handleSortChange(e.target.value)}>
        <option value="brand-asc">Merke (A-Å)</option>
        <option value="brand-desc">Merke (Å-A)</option>
        <option value="product-asc">Produkt (A-Å)</option>
        <option value="product-desc">Produkt (Å-A)</option>
        <option value="bestsellers">Bestselgere</option>
      </select>
            </div>
            {results && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {results
                    .slice(0, numToShow)
                    .map((product, index) => (
                      <motion.div
                        key={product.sku}
                        className="group bg-slate-100 hover:bg-slate-200 p-4 rounded-lg relative"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={`/${pageData.slug.current}/${product.sku}`}>
                          {product.newProduct && product.isBestseller === false && (
                            <div className="absolute top-0 right-0 bg-slate-500 group-hover:bg-slate-600 rounded-tr-xl text-white font-bold text-sm w-1/2 text-center px-4 py-1">
                              NYHET
                            </div>
                          )}
                              {product.isBestseller && (
                            <div className="absolute top-0 right-0 bg-slate-500 group-hover:bg-slate-600 rounded-tr-xl text-white font-bold text-sm w-1/2 text-center px-4 py-1">
                              BESTSELGER
                            </div>
                          )}
                               {product.isLocatedInStore && product.isLocatedInStore == "Bodø" && (
                            <div className="absolute top-0 right-0 bg-slate-500 group-hover:bg-slate-600 rounded-tr-xl text-white font-bold text-sm w-1/2 text-center px-4 py-1">
                              Bodø
                            </div>
                          )}
                                {product.isLocatedInStore && product.isLocatedInStore == "Vågaholmen" && (
                            <div className="absolute top-0 right-0 bg-slate-500 group-hover:bg-slate-600 rounded-tr-xl text-white font-bold text-sm w-1/2 text-center px-4 py-1">
                              Vågaholmen
                            </div>
                          )}
                          <Image
                            className="object-contain mix-blend-darken w-full h-56"
                            src={product.hovedbilde.cdnUrl || ""}
                            alt={product.hovedbilde.alt}
                            width={200}
                            height={200}
                          />
                          {product.brand.name && (
                            <p className="text-slate-900 text-sm">
                              {product.brand.name}
                            </p>
                          )}
                          <h2 className="text-slate-900 text-xl">
                            {product.name}
                          </h2>
                          {product.toPriceIncVat !== 0 && (
                            <div className="flex gap-2 items-end">
                              <strong className="font-black text-2xl">
                                {formatPrice(product.fromPriceIncVat)},-
                              </strong>
                            </div>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                </div>
                <p className="text-center my-4">
                  Viser {Math.min(numToShow, results.length)} produkter
                  av totalt {results.length} produkter
                </p>
                {numToShow < results.length && (
                  <div className="text-center">
                    <button
                      className="bg-black px-4 py-2 text-white"
                      onClick={handleShowMore}
                    >
                      Vis flere produkter
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
