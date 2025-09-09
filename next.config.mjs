/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        qualities: [90],
        remotePatterns: [
            {
                hostname: 'assets.lummi.ai',
            },
            {
                hostname: 'images.unsplash.com',
            }
        ],
    },
};

export default nextConfig;
