/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: ['./styles'],
  },
  output: 'export',  // ключевая настройка
  images: {
    unoptimized: true,  // если используешь next/image
  },
}

module.exports = nextConfig