import createClient from "../lib/sanityClient";
import { setupQuery, footerQuery } from "@/queries";

async function fetchHeaderAndFooterData() {
    const nav = await createClient.fetch(setupQuery);
    const footer = await createClient.fetch(footerQuery);
    return { menu: nav.menu[0], headersetup: nav.setup[0], footer: footer[0] };
}

export default fetchHeaderAndFooterData;