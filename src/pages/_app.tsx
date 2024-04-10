// _app.tsx
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HeaderAndFooterDataProvider } from "@/components/layout";
import { Layout } from "@/components/layout";
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Add all icons to the library so you can use it in your page
library.add(fas);

export default function App({ Component, pageProps }: AppProps) {
  return (
    <HeaderAndFooterDataProvider>
    <Layout>
        <Component {...pageProps} />
    </Layout>
</HeaderAndFooterDataProvider>
  );
}

