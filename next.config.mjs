/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'assets.lummi.ai',
            },
        ],
    },
};

export default nextConfig;
