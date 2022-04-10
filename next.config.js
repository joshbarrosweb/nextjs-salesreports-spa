/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@4us-dev/utils']); // pass the modules you would like to see transpiled

module.exports = withTM();

/* const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig */
