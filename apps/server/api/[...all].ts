// Forward all /api/* requests to the Express app, preserving the /api prefix
export default async function handler(req: any, res: any) {
  const allowedOrigins = [
    'https://gosafe-booking-tour.vercel.app',
    'https://www.gosafe-booking-tour.vercel.app',
    'https://server666.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000'
  ];
  const origin = req.headers?.origin as string | undefined;
  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : 'https://gosafe-booking-tour.vercel.app';

  // Determine requested method/headers for preflight echoing
  const requestedMethod = (req.headers['access-control-request-method'] as string) || 'GET, POST, PUT, DELETE, OPTIONS';
  const requestedHeaders = (req.headers['access-control-request-headers'] as string) || 'Content-Type, Authorization, X-Requested-With, Accept, Origin';

  // Set CORS headers early so they apply to all responses
  res.setHeader('Access-Control-Allow-Origin', allowOrigin);
  res.setHeader('Vary', 'Origin');
  // Always include a full method list to satisfy strict clients/CDNs
  res.setHeader('Access-Control-Allow-Methods', `${requestedMethod}, GET, POST, PUT, DELETE, OPTIONS`);
  res.setHeader('Access-Control-Allow-Headers', requestedHeaders);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS' || req.method === 'HEAD') {
    // Respond quickly to preflight/HEAD without touching the Express app
    res.statusCode = 204; // No Content is ideal for preflight
    res.setHeader('Content-Length', '0');
    try {
      res.end();
    } catch (_) {
      // ignore
    }
    return;
  }

  // Lazy-load the Express app AFTER handling preflight so CORS always responds
  // This avoids import-time failures (e.g., missing env vars) from breaking OPTIONS
  try {
    const app = (await import('../src/index')).default as any;

    if (req.url && !req.url.startsWith('/api/')) {
      req.url = `/api${req.url}`;
    }
    // @ts-ignore Express app is a compatible handler (req, res)
    return app(req, res);
  } catch (error: any) {
    console.error('Failed to load Express app:', error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: false,
        error: 'Server initialization failed',
        message: error?.message || 'Unknown error'
      }));
    }
    return;
  }
}

