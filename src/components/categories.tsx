import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";


interface CategoriesProps {
    categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
    return (
        <div className="max-w-[1300px] px-[20px] xl:px-0 w-full mx-auto">
        <h1 className="sr-only text-white bg-black">Kategorier</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-12">
            {categories.map((category) => (
                <div key={category.slug.current} className="group">
                    <Link href={`/${category.slug.current}`}>
                            <Image
                                className="object-cover w-full h-96 bg-white opacity-100 group-hover:opacity-90"
                                src={category.hovedfoto.asset.url}
                                alt={category.hovedfoto.alt}
                                width={500}
                                height={500}
                                />
                            <div className="bg-slate-200 p-6 flex items-center gap-4">
                            <h2 className="text-2xl group-hover:ml-2 transition-all duration-300 text-slate-900 font-black">{category.navn}</h2>
                            <div className="group-hover:-rotate-90 transition-all duration-300 ">
                            <FontAwesomeIcon color="black" size="lg" icon={faArrowRight} />
                            </div>
                                                        </div>
                    </Link>
                </div>
            ))}
        </div>
            </div>
    );
};

export default Categories;

