// Cloudflare Worker to serve static assets from dist folder
export default {
  async fetch(request, env) {
    // Get the pathname from the request
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Serve index.html for root or paths without extensions (SPA routing)
    if (pathname === '/' || !pathname.includes('.')) {
      pathname = '/index.html';
    }

    try {
      // Try to get the asset
      const response = await env.ASSETS.fetch(new URL(pathname, request.url));
      return response;
    } catch (e) {
      // If asset not found, serve index.html (for SPA routing)
      return env.ASSETS.fetch(new URL('/index.html', request.url));
    }
  },
};
