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
        v2_dev: true,
        v2_errorBoundary: true,
        v2_headers: true,
        v2_meta: true,
        v2_normalizeFormMethod: true,
        v2_routeConvention: true,
    },
};