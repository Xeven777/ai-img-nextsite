/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
