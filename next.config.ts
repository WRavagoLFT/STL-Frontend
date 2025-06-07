import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  async rewrites() {
    return [
      {
        source: '/email-verification',
        destination: '/auth/email-verification',
      },
      {
        source: '/forgot-password',
        destination: '/auth/forgot-password',
      },
      {
        source: '/password-reset',
        destination: '/auth/password-reset',
      },
      {
        source: '/set-password',
        destination: '/auth/set-password',
      },
      {
        source: '/users/executives',
        destination: '/Protected/users/executive',
      },
      {
        source: '/users/managers',
        destination: '/Protected/users/managers',
      },
      {
        source: '/betting-summary/:path',
        destination: '/Protected/betting-summary/:path', 
      },
      {
        source: '/bets-comparisons',
        destination: '/Protected/betting-comparisons', 
      },
      {
        source: '/draw-summary',
        destination: '/Protected/draw-summary',
      },
      {
        source: '/draw-summary/:path',
        destination: '/Protected/draw-summary/:path'
      },
      {
        source: '/winning-summary/:path',
        destination: '/Protected/winning-summary/:path',
      },
      {
        source: '/wins-comparisons',
        destination: '/Protected/winning-comparisons', 
      },
      {
        source: '/dashboard',
        destination: '/Protected/dashboard',
      },
      {
        source: '/operators',
        destination: '/Protected/operators',
      },
      {
        source: '/operators/:slug',
        destination: '/Protected/operators/:slug',
      },
      {
        source: '/operators-add',
        destination: '/Protected/operators/operators-add',
      },
      {
        source: '/draw-selected',
        destination: '/Protected/draw-selected',
      },
      {
        source: '/operators-view',
        destination: '/Protected/operators-view',
      },
      {
        source: '/retail-receipt',
        destination: '/Protected/retail-receipt',
      },
      {
        source: '/users/kabo',
        destination: '/Protected/users/kabo',
      },
      {
        source: '/users/kubrador',
        destination: '/Protected/users/kubrador',
      },
      {
        source: '/device-information',
        destination: '/Protected/device-information',
      },
      {
        source: '/device-information/device-information-add',
        destination: '/Protected/device-information/device-information-add',
      },
      {
        source: '/users/users-view/:slug',
        destination: '/Protected/users/users-view/:slug',
      },
      // error page
      {
        source: '/error404',
        destination: '/auth/error404',
      },
    ];
  },
};  

export default (nextConfig);