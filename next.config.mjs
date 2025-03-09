// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', 
  basePath: '/code-diff-checker', 
  images: {
    unoptimized: true, 
  },
  assetPrefix: '/code-diff-checker/', 
};

export default nextConfig;
