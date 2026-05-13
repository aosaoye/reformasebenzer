/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            }
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '500mb',
        },
    },
};

export default nextConfig;
