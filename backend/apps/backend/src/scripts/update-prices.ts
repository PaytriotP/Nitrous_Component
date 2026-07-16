import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import fs from "fs";
import { parse } from "csv-parse/sync";

export default async function updatePrices({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const pricingModule = container.resolve("pricing");

  // 1. Read original rich CSV data
  const csvRaw = fs.readFileSync("d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-50.csv", "utf-8");
  const originalProducts = parse(csvRaw, { columns: true, skip_empty_lines: true });

  const priceMap: Record<string, number> = {};
  for (const p of originalProducts) {
    const handle = p.part_number.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    priceMap[handle] = parseFloat(p.price_gbp);
  }

  // 2. Fetch variants with price sets
  logger.info("Fetching variants and prices...");
  const { data: variants } = await query.graph({ entity: "variant", fields: ["id", "product.handle", "price_set.prices.id"] });

  const priceUpdates = [];

  for (const variant of variants) {
    const handle = variant.product?.handle;
    const priceCents = priceMap[handle];
    
    if (priceCents && variant.price_set?.prices?.length > 0) {
      priceUpdates.push({
        id: variant.price_set.prices[0].id,
        amount: priceCents,
      });
    }
  }

  if (priceUpdates.length === 0) {
    logger.warn("No prices found to update.");
    return;
  }

  logger.info(`Updating ${priceUpdates.length} prices directly via Pricing Module...`);
  await pricingModule.updatePrices(priceUpdates);
  
  logger.info("Successfully updated all prices!");
}
