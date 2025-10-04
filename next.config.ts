import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   async redirects() {
    return [
      {
        source: '/',
        destination: '/students', // Replace with your desired page path
        permanent: true, // Set to true for a permanent redirect (301), false for temporary (307)
      },
    ];
  },
};

export default nextConfig;
