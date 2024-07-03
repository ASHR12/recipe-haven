const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/ashutosh-shrivastava/image/upload/**",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        port: "",
        pathname: "/600x400/000/fff&text=**",
      },
    ],
  },
};

export default nextConfig;
