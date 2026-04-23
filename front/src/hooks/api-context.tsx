"use client";

import { createContext, ReactNode, useContext, useState, useMemo } from "react"
import { http } from "@/lib/http";
import { createArticleApi, type ArticleApi } from "@/lib/api/article";

interface ApiResources {
    article: ArticleApi;
}

interface ApiContext {
    resources: ApiResources;
}

const ApiContext = createContext<ApiContext | null>(null);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
    const resources = useMemo(() => ({
        article: createArticleApi(http),
    }), [http]);
    const value = useMemo<ApiContext>(() => ({ resources }), [resources]);
    return (
        <ApiContext.Provider value={value}>
            {children}
        </ApiContext.Provider>
    );
}

const useApiContext = (): ApiContext => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApiContext must be used within a ApiProvider");
    }
    return context;
}

export const useApi = (): ApiResources => {
    return useApiContext().resources;
};
