import { GetServerSidePropsContext } from "next";
import createClient from "../../lib/sanityClient";
import { Artikkel, BlockNode, ImageNode } from "@/types";
import { generateMetadata } from "@/helpers/generateMetadata";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanityImageBuilder";
import fetchHeaderAndFooterData from "@/helpers/fetchHeaderAndFooter";
import BlockContent from "@sanity/block-content-to-react";
import Breadcrumb from "@/components/breadcrumb";

interface PostPageProps {
  postData: Artikkel;
  menu: any;
  headersetup: any;
  footer: any;
  metadata: any;
}

async function fetchPostData(slug: string): Promise<Artikkel> {
  const query = `*[_type == "post" && slug.current == $slug]{
      title,
      description,
      keywords,
      content,
      slug,
      ingress,
      showRelatedPersons,
      ingressImageShow,
      showAuthor,
      "relatedPersons": relatedPersons[]->{
        name,
        description,
        "image": {
          "assetRef": image.asset._ref,
          "alt": image.alt
        }
      },      "author": author->{
        name,
        description,
        "image": {
          "_ref": image.asset._ref,
          "alt": image.alt
        }
      },
      ingressImage
    }[0]`;
  const params = { slug };
  const post: Artikkel = await createClient.fetch(query, params);
  return post;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, params } = context;
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const baseUrl = req ? `${protocol}://${req.headers.host}` : "";
  const headerAndFooterData = await fetchHeaderAndFooterData();

  const postData = await fetchPostData(params?.slug as string);

  let ogImageUrl = null;
  if (
    postData.ingressImage &&
    postData.ingressImage.asset &&
    postData.ingressImage.asset._ref
  ) {
    const ogImage = postData.ingressImage.asset._ref;
    ogImageUrl = urlFor(ogImage).width(1200).height(630).url();
    console.log("ogImageUrl:", ogImageUrl); // Debugging log
  } else {
    console.log("postData.ingressImage:", postData.ingressImage); // Debugging log
  }
  const setup = {
    title: postData.title,
    description:
      postData.description ||
      postData.ingress ||
      (postData.content[0] && postData.content[0].children[0].text) ||
      "",
    keywords: postData.keywords || "",
    ingressImage: { asset: { url: ogImageUrl } },
  };

  return {
    props: {
      ...headerAndFooterData,
      metadata: generateMetadata(setup, baseUrl),
      postData,
    },
  };
}

export default function PostPage({ postData, metadata }: PostPageProps) {
  console.log(postData);
  console.log(metadata);
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
      <main className="min-h-screen text-black bg-[#efefef]">
        <Breadcrumb data={postData} />
        <section className="max-w-[1600px] mx-auto p-4 md:p-12 flex gap-8">
          <div
            className={
              postData.showAuthor || postData.showRelatedPersons
                ? "basis-3/4"
                : "w-full"
            }
          >
            <h1 className="text-5xl font-bold my-4">{postData.title}</h1>
            {postData.ingress && (
              <p className="text-xl my-4">{postData.ingress}</p>
            )}
            {postData.ingressImage && postData.ingressImageShow && (
              <Image
                className="my-6"
                alt={postData.ingressImage.alt}
                src={urlFor(postData.ingressImage.asset._ref)
                  .width(1600)
                  .height(600)
                  .url()}
                width={1600}
                height={600}
              />
            )}
                       {postData.content && (
            <BlockContent
            blocks={postData.content}
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
                      <strong className="font-semibold">{children}</strong>
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
          </div>
          {(postData.showAuthor || postData.showRelatedPersons) && (
            <aside className="basis-1/4 flex flex-col gap-6">
              {postData.showAuthor ? (
                <div className="p-4 bg-white rounded-xl">
                  <div className="flex justify-between mb-2">
                    <h2 className="text-2xl font-bold mb-4">Om forfatteren</h2>
                    <Image
                      alt={postData.author.image.alt}
                      className="rounded-full"
                      src={urlFor(postData.author.image._ref)
                        .width(200)
                        .height(200)
                        .url()}
                      width={100}
                      height={100}
                    />
                  </div>
                  <strong>{postData.author.name}</strong>
                  <p>{postData.author.description}</p>
                </div>
              ) : null}
              {postData.relatedPersons &&
                postData.showRelatedPersons &&
                postData.relatedPersons.map((person, index) => (
                  <div key={index} className="p-4 bg-white rounded">
                    <div className="flex justify-between mb-2">
                      <h2 className="text-2xl font-bold mb-4">
                        Relatert ansatt
                      </h2>{" "}
                      <Image
                        alt={person.image.alt}
                        className="rounded-full"
                        src={urlFor(person.image.assetRef)
                          .width(200)
                          .height(200)
                          .url()}
                        width={100}
                        height={100}
                      />
                    </div>
                    <strong>{person.name}</strong>
                    <p>{person.description}</p>
                  </div>
                ))}
            </aside>
          )}
  
        </section>
      </main>
    </>
  );
}
