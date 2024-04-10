import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Header from './header';
import Footer from './footer';

import fetchHeaderAndFooterData from '@/helpers/fetchHeaderAndFooter';

interface HeaderAndFooterData {
    menu: any;
    footer: any;
    headersetup: any; 
}

const HeaderAndFooterDataContext = createContext<HeaderAndFooterData | null>(null);

export function HeaderAndFooterDataProvider({ children }: { children: ReactNode }) {
    const [headerAndFooterData, setHeaderAndFooterData] = useState<HeaderAndFooterData | null>(null);
    useEffect(() => {
        fetchHeaderAndFooterData().then(data => setHeaderAndFooterData(data));
    }, []);

    return (
        <HeaderAndFooterDataContext.Provider value={headerAndFooterData}>
            {children}
        </HeaderAndFooterDataContext.Provider>
    );
}

export function useHeaderAndFooterData() {
    return useContext(HeaderAndFooterDataContext);
}

export function Layout({ children }: { children: ReactNode }) {
    const headerAndFooterData = useHeaderAndFooterData();
  
    if (!headerAndFooterData) {
        return null;  // Or a loading spinner, etc.
    }

    return (
        <>
            <Header menu={headerAndFooterData.menu} setup={headerAndFooterData.headersetup} />
                {children}
            <Footer footer={headerAndFooterData.footer} />
        </>
    );
}