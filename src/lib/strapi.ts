const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || "https://superb-ants-9c3577cf0d.strapiapp.com";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface FetchOptions {
    method?: string;
    headers?: HeadersInit;
    body?: string;
    cache?: RequestCache;
    next?: {
        revalidate?: number;
        tags?: string[];
    };
}

export async function fetchStrapi(
    endpoint: string,
    query?: Record<string, any>,
    options: FetchOptions = {}
) {
    try {
        let queryString = "";
        if (query) {
            const buildQueryString = (obj: any, prefix = ""): string => {
                return Object.keys(obj)
                    .map((key) => {
                        const value = obj[key];
                        const fullKey = prefix ? `${prefix}[${key}]` : key;

                        if (value !== null && typeof value === "object" && !Array.isArray(value)) {
                            return buildQueryString(value, fullKey);
                        } else if (Array.isArray(value)) {
                            return value
                                .map((val, i) => `${encodeURIComponent(`${fullKey}[${i}]`)}=${encodeURIComponent(val)}`)
                                .join("&");
                        } else {
                            return `${encodeURIComponent(fullKey)}=${encodeURIComponent(value)}`;
                        }
                    })
                    .filter(p => p !== "")
                    .join("&");
            };
            queryString = buildQueryString(query);
        }
        
        const finalUrl = queryString ? `${STRAPI_URL}/api/${endpoint}?${queryString}` : `${STRAPI_URL}/api/${endpoint}`;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...(STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}),
        };

        const response = await fetch(finalUrl, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            let errorText = response.statusText;
            try {
                const rawText = await response.text();
                try {
                    const errorBody = JSON.parse(rawText);
                    if (errorBody.error && errorBody.error.message) {
                        errorText = errorBody.error.message;
                    } else {
                        errorText = JSON.stringify(errorBody);
                    }
                } catch (e) {
                    errorText = rawText;
                }
            } catch (e) {
                // ignore
            }
            // Avoid spamming the console for expected 404s on unconfigured single types
            if (options.method && options.method !== "GET") {
                console.error(`Strapi Error [${response.status}] for ${options.method} ${endpoint}: ${errorText}`);
            } else if (response.status !== 404 || (!endpoint.includes("global") && !endpoint.includes("homepage"))) {
                console.error(`Strapi Error [${response.status}] for GET ${endpoint}: ${errorText}`);
            }
            throw new Error(`Strapi Request failed for ${endpoint}: ${errorText.substring(0, 150)}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Strapi fetch error:", error);
        throw error;
    }
}

export function getStrapiMedia(url: string | null) {
    if (url == null) return null;

    // Return the full URL if it's absolute
    if (url.startsWith("http") || url.startsWith("//")) {
        return url;
    }

    // Otherwise prepend the URL
    return `${STRAPI_URL}${url}`;
}
