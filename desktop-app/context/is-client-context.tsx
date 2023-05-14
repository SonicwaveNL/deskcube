import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';

type isClientContextType = {
    isClient: boolean;
}

const isClientContextDefault: isClientContextType = {
    isClient: false,
}

const IsClientContext = createContext<isClientContextType>(isClientContextDefault);

export const useIsClient = () => {
    return useContext(IsClientContext);
}

type IsClientProviderProps = {
    children: ReactNode;
}

export const IsClientProvider = ({ children }: IsClientProviderProps) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => setIsClient(true), []);

    const value = { isClient };

    return (
        <IsClientContext.Provider value={value}>
            { children }
        </IsClientContext.Provider>
    )
}