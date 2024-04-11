export const navQuery = `{
    "menu": *[_type == "menu"]{
        navbarMenuItems[]->{
            title,
            link {
                internalLink->{
                    permalenke
                },
                externalLink
            }
        },
        menuType,
        menuColor,
        menuTextColor,
        extranav[]{
            title,
            link {
                internalLink->{
                    permalenke
                },
                externalLink
            }
        }
    }
}`;

export const setupQuery = `{
    "menu": *[_type == "menu"]{
        navbarMenuItems[]->{
            title,
            link {
                internalLink->{
                    slug,
                    
                },
                externalLink
            }
        },
        menuType,
        menuColor,
        menuTextColor,
        extranav[]->{
            title,
            link {
                internalLink->{
                    slug,
                    
                },
                externalLink
            }
        }
    },
    "setup": *[_type == "setup"]{
        logo {
            asset->{
                url
            }
        },
        favicon
    }
}`;


export const setupIndexQuery = `{
    "setup": *[_type == "setup"]{
        title,
        description,
        keywords,
        favicon,
        logo {
            asset->{
                url
            }
        }
    }
}`;



export const frontPageQuery = `*[_type == "forside"][0]{
    pageBuilder[]{
        ...,
    },
    antallNyheter,
}`;

export const shortcutArrayQuery = `*[_type == "forside"][0]{
    pageBuilder[_type == "shortcutArray"]{
        _type, 
        shortcutItems[]{
            title, 
            icon, 
            link{
                internalLink->{
                    _type,
                    _id,
                    slug,
                }, 
                externalLink
            }
        }
    }
}`;

export const footerQuery = `*[_type == "footer"]{
  columns[]{
    content[]{
      ...,
      _type == 'postImageBlock' => {
        image{
          asset->{
            url
          }
        }
      }
    }
  },
  bgColor{hex},
  textColor,
  byline,
  personvern
}`;

export const categoriesQuery = `*[_type == "categories"] | order(navn asc) {
  navn,
  slug,
  hovedfoto{
      asset->{
          url
      },
      alt
  },
  beskrivelse,
}`;
  

export const articlesQuery = `
*[_type == "post"][0...$limit]{
    title,
    slug,
    ingress,
    ingressImage{
        asset->{
            url
        },
        alt
    },
    readTime
}
`;

export const bloggsettingsQuery = `*[_type == "bloggSettings"][0]{
    title,
    ingress,
    ingressImageShow,
    ingressImage{
      asset->{
        _id,
        url
      },
      alt
    },
    content[]{
      ...,
      _type == 'postImageBlock' => {
        'asset': asset->{
          _id,
          url
        },
        alt
      }
    },
    description,
    keywords
  }`;

  export const ansattesettingsQuery = `*[_type == "ansatteSettings"][0]{
    title,
    ingress,
    ingressImageShow,
    ingressImage{
      asset->{
        _id,
        url
      },
      alt
    },
    content[]{
      ...,
      _type == 'postImageBlock' => {
        'asset': asset->{
          _id,
          url
        },
        alt
      }
    },
    description,
    keywords
  }`;