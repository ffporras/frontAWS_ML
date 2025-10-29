/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // 🔹 importante para generar la carpeta /out
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
