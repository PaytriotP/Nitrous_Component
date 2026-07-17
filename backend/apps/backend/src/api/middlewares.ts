import { defineMiddlewares } from "@medusajs/medusa";
import cors from "cors";

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
          if (req.query.limit !== undefined) {
            const limit = parseInt(req.query.limit as string, 10);
            if (isNaN(limit) || limit < 0) {
              return res.status(400).json({
                type: 'invalid_data',
                message: 'limit must be a positive number'
              });
            }
          }
          next();
        }
      ],
    },
  ],
});
