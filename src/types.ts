export interface TextChild {
    _key: string;
    _type: string;
    marks: string[];
    text: string;
  }
  
  export interface TextBlock {
    _key: string;
    _type: string;
    children: TextChild[];
    markDefs: any[];
    style: string;
  }

  export interface BlockNode {
    style: string;
    children: { text: string }[];
  }
  
 export interface ImageNode {
    image: { asset: { _ref: string } };
  }

  export type Artikkel = {
    title: string;
    description: string;
    keywords: string;
    content: TextBlock[];
    slug: {
      current: string;
    };
    ingress: string;
    ingressImageShow: boolean;
    showAuthor: boolean;
    relatedPersons: any[];
    showRelatedPersons: boolean;
    author: {
      name: string;
      description: string;
      image: {
        _ref: string;
        alt: string;
      };
    }
    ingressImage: {
      asset: {
        _ref: string;
      };
      alt: string;
    };
  };

  export type Ansatt = {
    name: string;
    description: string;
    _id: string;
    email: string;
    phone: string;
    image: {
      asset: {
        _ref: string;
      };
      alt: string;
    };
  };
  export type Produkt = {
    name: string;
    sku: string;
    isModel: boolean;
    kataloger: {
      navn: string;
      url: string;
      filesize: number;
      content_type: string;
    }[];
    family: {
      name: string;
      code: string;
    };
    brand: {
      name: string;
      code: string;
    };
    hovedbilde: {
      cdnUrl: string;
      alt: string;
      caption: string;
      height: number;
      width: number;
    };
    forsidebilde: {
      cdnUrl: string;
      alt: string;
      caption: string;
      height: number;
      width: number;
    };
    bildekarusell: {
      cdnUrl: string;
      alt: string;
      caption: string;
      height: number;
      width: number;
    }[];
    bildegalleri: {
      cdnUrl: string;
      alt: string;
      caption: string;
      height: number;
      width: number;
    }[];
    kortBeskrivelse: string;
    langBeskrivelse: {
      children: {
        text: string;
      }[];
    }[];
    newProduct: boolean;
    leverandorUrl: string;
    toPriceIncVat: number;
    specs: Spec[];
    values: {
      included_propeller_size: string;
      shaft_length: string;
      weight: string;
      propeller_size_from: string;
      propeller_size_to: string;
      recommended_transom_height: string;
      power_hp: string;
      power_kw: string;
      displacement: string;
    };
    varianter: {
      sku: string;
      name: string;
      mainImage: string;
      fromPriceExVat: number;
      fromPriceIncVat: number;
      toPriceExVat: number;
      toPriceIncVat: number;
      vatRate: number;
      variantAttribute1: {
        code: string;
        name: string;
      }
      variantAttribute2: {
        code: string;
        name: string;
      }
      variantOption1: {
        code: string;
        name: string;
      }
      variantOption2: {
        code: string;
        name: string;
      }
      values: {
        included_propeller_size: string;
        shaft_length: string;
        weight: string;
        propeller_size_from: string;
        propeller_size_to: string;
        recommended_transom_height: string;
      };
    }[];
    seoTitle: string;
    seoDescription: string;
    seoKeywords: string;
  };

  export type Side = {
    navn: string;
    slug: {
      current: string;
    };
    hovedfoto: {
      asset: {
        url: string;
        _ref: string;
      };
      alt: string;
    };
    beskrivelse: string;
    description: string;
    keywords: string;
    inkluderteFamilier: any[];
  };
  
  export type Products = {
    name: string;
    slug: {
      current: string;
    }
    sku: string;
    hovedbilde: {
      cdnUrl: string;
      alt: string;
      caption: string;
      height: number;
      width: number;
    };
    kortBeskrivelse: string;
    newProduct: boolean;
    isBestseller: boolean;
    toPriceIncVat: number;
    fromPriceIncVat: number;
    brand: {
      name: string;
      code: string;
    }
    family: {
      name: string;
      code: string;
    }
  };

export type ContactInput = {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  _key: string;
};    


export type ContactType = {
  title: string;
  ingress: string;
  content: TextBlock[];
  felt: ContactInput[];
  isReverse: boolean;
};

  export type ContactProps = {
    contact: ContactType;
  };

  export type Category = {
    navn: string;
    slug: {
      current: string;
    };
    hovedfoto: {
        alt: string;
        asset: {
            url: string;
        };
    };
    beskrivelse: string;
    inkluderteFamilier: Array<{ code: string }>;
  }

export type Spec = {
  group: string;
  label: string;
  value: string[];
};

export type SpecsGridProps = {
  specs: Spec[];
};
export interface Asset {
  _id: string;
  url: string;
}

 export interface Image {
  asset: Asset;
  alt: string;
}

 export interface PageReference {
  title: string;
  slug: {
    current: string;
  };
}

 export interface Page {
  title: string;
  slug: {
    current: string;
  };
  ingress: string;
  content: TextBlock[];
  ingressImage: Image;
  showTitleAndIngress: boolean;
  pageBuilder: any[];
  showIngressImage: boolean;
  parent: PageReference;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoImage: Image;
}