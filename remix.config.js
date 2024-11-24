/** @type {import('@remix-run/dev').AppConfig} */
export default {
    ignoredRouteFiles: ["**/.*"],
    serverConditions: ["worker"],
    serverDependenciesToBundle: "all",
    serverMainFields: ["browser", "module", "main"],
    serverMinify: true,
    serverModuleFormat: "esm",
    serverPlatform: "neutral",
    tailwind: true,
    future: {
        // Only include future flags that are still relevant
        v3_fetcherPersist: true,
        v3_lazyRouteDiscovery: true,
        v3_relativeSplatPath: true,
        v3_singleFetch: true,
        v3_throwAbortReason: true
    },
};