import type { NextApiRequest, NextApiResponse } from "next";
import createClient from '../../lib/sanityClient'

type Artikkel = {
    title: string;
    icon: {
      asset: {
        _ref: string;
      };
    };
    seoTitle: string;
    seoKeywords: string;
    seoSlug: {
      current: string;
    };
    seoImage: {
      asset: {
        _ref: string;
      };
    };
  };
  
  type Data = Artikkel[];
  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
  ) {
    const query = '*[_type == "artikkel"]';
    const artikler = await createClient.fetch(query);
    res.status(200).json(artikler);
  }