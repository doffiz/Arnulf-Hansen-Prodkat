export function generateMetadata(setup: any, baseUrl: string): any {
  console.log("setup:", setup); // Debugging log
    return {
      title: setup.title || "",
      description: setup.description || setup.ingress || (setup.content && setup.content[0] && setup.content[0].children && setup.content[0].children[0] && setup.content[0].children[0].text) || "",      
      keywords: setup.keywords || "",
      openGraph: {
        images: [(setup.hovedfoto && setup.hovedfoto.asset && setup.hovedfoto.asset.url) || (setup.logo && setup.logo.asset && setup.logo.asset.url)].filter(Boolean),
        url: baseUrl,    
    },
    };
  }