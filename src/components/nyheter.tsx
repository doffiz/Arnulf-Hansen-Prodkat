import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Article {
  title: string;
  slug: {
    current: string;
  };
  ingress: string;
  ingressImage: {
    asset: {
      url: string;
    };
    alt: string;
  };
  readTime: number;
}

// ... (imports)

interface ArticlesProps {
  articles: Article[];
  title: string;
}

const Nyheter: React.FC<ArticlesProps> = ({ articles, title }) => {
  return (
    <section className="bg-white py-4">
      <h2 className="text-black text-center text-5xl pb-12 font-bold">{title}</h2>
      <div className="mx-auto max-w-[1600px] text-black flex flex-col items-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, index) => (
            <Link href={`/blogg/${article.slug.current}`} key={index} passHref>
              <div>
                <div className="relative h-[300px]">
                  <Image className="object-cover"
                    src={article.ingressImage.asset.url}
                    alt={article.ingressImage.alt}
                    layout="fill"
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33.3vw"
                  />
                </div>
                <h2 className="text-3xl my-2 font-semibold">{article.title}</h2>
                <p>{article.ingress}</p>
              </div>
            </Link>
          ))}
        </div>
        <Link href="/blogg">
          <p className="text-blue-800 p-6 underline block hover:underline">
            Gå til bloggarkiv
          </p>
        </Link>
      </div>
    </section>
  );
};

export default Nyheter;
