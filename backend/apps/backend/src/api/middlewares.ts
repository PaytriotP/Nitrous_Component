import { defineMiddlewares } from "@medusajs/medusa";
import cors from "cors";

// Simple in-memory cache for L3
const productCache = new Map<string, { data: string, expiry: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export default defineMiddlewares({
  routes: [
    {
      matcher: "/paytriot/*",
      middlewares: [
        cors({
          origin: "*",
        }),
      ],
    },
    {
      matcher: "/uploads/*",
      middlewares: [
        cors({
          origin: "*",
        }),
      ],
    },
    {
      matcher: "/store/products",
      middlewares: [
        (req: any, res: any, next: any) => {
          // L1 Cache Control (Edge/Browser)
          res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
          
          if (req.query.limit !== undefined) {
            const limit = parseInt(req.query.limit as string, 10);
            if (isNaN(limit) || limit < 0) {
              return res.status(400).json({
                type: 'invalid_data',
                message: 'limit must be a positive number'
              });
            }
          }
          
          // L3 Memory Cache
          const cacheKey = req.originalUrl;
          const cached = productCache.get(cacheKey);
          
          if (cached && cached.expiry > Date.now()) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader("X-Cache", "HIT");
            return res.send(cached.data);
          }

          const originalSend = res.send;
          res.send = function (body: any) {
            if (res.statusCode === 200 && typeof body === 'string') {
              productCache.set(cacheKey, {
                data: body,
                expiry: Date.now() + CACHE_TTL
              });
              res.setHeader("X-Cache", "MISS");
            }
            return originalSend.call(this, body);
          };
          
          next();
        }
      ],
    },
  ],
});
