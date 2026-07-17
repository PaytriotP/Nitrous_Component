import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({
    env_db: process.env.DATABASE_URL,
    env_redis: process.env.REDIS_URL,
    node_env: process.env.NODE_ENV,
  })
}
