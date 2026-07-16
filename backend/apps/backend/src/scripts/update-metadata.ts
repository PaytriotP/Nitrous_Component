import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import fs from "fs";
import { parse } from "csv-parse/sync";

export default async function updateMetadata({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  // 1. Read original rich CSV data
  const csvRaw = fs.readFileSync("d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-50.csv", "utf-8");
  const originalProducts = parse(csvRaw, { columns: true, skip_empty_lines: true });

  // Create a map by part_number (handle)
  const metaMap: Record<string, any> = {};
  const priceMap: Record<string, number> = {};
  for (const p of originalProducts) {
    const handle = p.part_number.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    
    // Check if JPG exists, otherwise fallback to SVG
    let imgPath = `images/components/${handle}.jpg`;
    if (!fs.existsSync(`d:/Paytriot/Project/Nitrous/frontend/public/${imgPath}`)) {
      imgPath = `images/${handle}.svg`;
    }

    metaMap[handle] = {
      category: p.category,
      manufacturer: p.manufacturer,
      package_type: p.package_type,
      value_rating: p.value_rating,
      tolerance: p.tolerance,
      pack_qty: p.pack_qty,
      stock_qty: p.stock_qty,
      stock_status: parseInt(p.stock_qty) > 0 ? "IN_STOCK" : "DEPLETED",
      datasheet_url: p.datasheet_url,
      image_file: imgPath
    };
    
    // Store price in cents
    priceMap[handle] = Math.round(parseFloat(p.price_gbp) * 100);
  }

  // 2. Fetch all products from Medusa (including variants)
  logger.info("Fetching existing products...");
  const { data: dbProducts } = await query.graph({ entity: "product", fields: ["id", "handle", "variants.*"] });

  if (dbProducts.length === 0) {
    logger.warn("No products found in DB to update.");
    return;
  }

  logger.info(`Found ${dbProducts.length} products. Updating metadata and prices...`);

  const productUpdates = [];
  const variantUpdates = [];

  for (const prod of dbProducts) {
    const meta = metaMap[prod.handle];
    if (meta) {
      productUpdates.push({ id: prod.id, metadata: meta });
    }
    
    const priceCents = priceMap[prod.handle];
    if (priceCents && prod.variants && prod.variants.length > 0) {
      // Create price update for the first variant
      variantUpdates.push({
        id: prod.variants[0].id,
        prices: [
          {
            currency_code: "gbp",
            amount: priceCents
          }
        ]
      });
    }
  }

  // 4. Run update workflows
  logger.info(`Updating ${productUpdates.length} product metadata...`);
  await updateProductsWorkflow(container).run({ input: { products: productUpdates } });

  logger.info(`Updating ${variantUpdates.length} variant prices...`);
  const { updateProductVariantsWorkflow } = require("@medusajs/medusa/core-flows");
  await updateProductVariantsWorkflow(container).run({ input: { update_product_variants: variantUpdates } });

  logger.info("Successfully updated all product metadata!");
}
