// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import createClient from "@/lib/sanityClient";
import { Category, Produkt } from "@/types";
import Image from "next/image";

interface SearchEngineProps {
    closeSearch: () => void;
  }

  const SearchEngine: React.FC<SearchEngineProps> = ({ closeSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Produkt[]>([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);

  
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const query = `*[_type == "categories"]{
                slug,
                "inkluderteFamilier": inkluderteFamilier[]->{
                    code
                }
            
            }`;
      const categories = await createClient.fetch(query);
      setCategories(categories);
    };
    fetchCategories();
  }, []);
  const handleLoadMore = () => {
    setDisplayCount(displayCount + 10);
  };
  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    const query = `*[
        (_type == "product" && isModel == true && (name match $term || sku match $term)) ||
        (_type == "family" && name match $term) ||
        (_type == "categories" && name match $term)
    ]{
        _type,
        name,
        code,
        sku,
        family{
            code,
            name
        },
        hovedbilde{
            cdnUrl,
            alt
        }
    }`;

    const params = { term: `${searchTerm}*` }; // add wildcard for partial matching
    const results = await createClient.fetch(query, params);
    console.log("RESULTS", results);
    setResults(results);
    console.log("setCategories", categories);
    setIsLoading(false);
};

const handleClick = (result: any) => {
    console.log("CLICK", result);
    console.log("CATEGORIES", categories);
    closeSearch();

    switch (result._type) {
        case 'product':
          
          const productCategory: Category | undefined = categories.find((category: Category) =>
          category.inkluderteFamilier.some(
            (family) => family.code === result.family.code
          )
        );
            console.log("CATEGORY", productCategory);
            if (productCategory) {
                router.push(`/${productCategory.slug.current}/${result.sku}`);
                setSearchTerm("");
            }
            break;
        case 'family':
            // Find the category that the family belongs to
            const familyCategory = categories.find((category: Category) =>
                category.inkluderteFamilier.some(
                    (family) => family.code === result.code
                )
            );

            if (familyCategory) {
                router.push({
                    pathname: `/${familyCategory.slug.current}`,
                    query: { family: result.name },
                });
            }

            setSearchTerm("");
            break;
        case 'category':
            // Navigate to category page
            router.push(`/${result.name}/`);
            setSearchTerm("");
            break;
        default:
            break;
    }
};

  return (
    <div className="max-w-[1300px] mx-auto px-8 py-8">
      <input
        className="border-2 border-gray-300 p-2 w-full text-slate-950 text-xl rounded-md"
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e);
        }}
        placeholder="Søk..."
      />
      {isLoading && <p>Laster...</p>}
      <div className="grid grid-cols-2 gap-x-2">
      {!isLoading &&
  searchTerm.length > 0 &&
  results.slice(0, displayCount).map((result: any, index: number) => {
    switch (result._type) {
      case 'product':
        return (
          <div
            className="bg-slate-50 p-4 mt-2 text-slate-950 cursor-pointer flex justify-between items-center"
            key={index}
            onClick={() => handleClick(result)}
          >
            {result.hovedbilde && result.hovedbilde.cdnUrl ? (
              <div className="basis-1/2 flex items-center">
                <Image
                  className="max-w-[100px] max-h-[100px]"
                  src={result.hovedbilde.cdnUrl}
                  alt={result.hovedbilde.alt}
                  width={100}
                  height={100}
                />
              </div>
            ) : (
              <div className="basis-1/2 flex items-center"></div>
            )}
            <div className="flex flex-col basis-1/2">
              <p className="text-sm font-bold">{result.family.name}</p>
              <strong className="text-slate-950 text-2xl">
                {result.name}
              </strong>
              <p className="text-xs">{result.sku}</p>
            </div>
          </div>
        );
      case 'family':
        // Render family result
        return (
          <div
            className="bg-slate-50 p-4 mt-2 text-slate-950 cursor-pointer flex justify-between items-center"
            key={index}
            onClick={() => handleClick(result)}
          >
            <div className="flex flex-col">
            <p className="text-sm font-bold">
                Produktfamilie
            </p>
            <strong className="text-slate-950 text-2xl">
              {result.name}
            </strong>
            </div>
          </div>
        );
      case 'category':
        // Render category result
        return (
          <div
            className="bg-slate-50 p-4 mt-2 text-slate-950 cursor-pointer flex justify-between items-center"
            key={index}
            onClick={() => handleClick(result)}
          >
            <div className="flex flex-col">
            <p className="text-sm font-bold">
                Kategori
            </p>
            <strong className="text-slate-950 text-2xl">
              {result.name}
            </strong>
            </div>
          </div>
        );
      default:
        return null;
    }
  })}
        </div>
      {results.length > displayCount && searchTerm.length > 0 && (
        <>
        <p className="text-sm">Viser {displayCount} av totalt {results.length} resultater</p>        
        <button className="bg-white text-[#842426] px-4 py-2 hover:bg-[#842426] hover:text-white border-2 border-white transition-all duration-300 ease-in-out cursor-pointer mt-2" onClick={handleLoadMore}>Vis flere søkeresultater</button>
        </>
      )}
    </div>
  );
};

export default SearchEngine;
