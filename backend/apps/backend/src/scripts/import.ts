import { MedusaContainer } from "@medusajs/framework";
import { createProductsWorkflow, deleteProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ProductStatus, ContainerRegistrationKeys } from "@medusajs/framework/utils";
import fs from "fs";
import path from "path";

export default async function importComponents({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Fetching default sales channel and shipping profile...");
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id"],
  });
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });

  const defaultSalesChannel = salesChannels[0];
  const shippingProfile = shippingProfiles[0];

  logger.info("Clearing existing products...");
  const { data: existingProducts } = await query.graph({ entity: "product", fields: ["id"] });
  if (existingProducts.length > 0) {
    await deleteProductsWorkflow(container).run({ input: { ids: existingProducts.map((p: any) => p.id) } });
    logger.info(`Deleted ${existingProducts.length} existing products.`);
  }

  logger.info("Reading products.json...");
  // Using process.cwd() which will be backend/apps/backend
  const jsonPath = path.resolve(process.cwd(), "../../../src/data/products.json");
  const productsRaw = fs.readFileSync(jsonPath, "utf-8");
  const productsData = JSON.parse(productsRaw);

  const productsToCreate = productsData.map((p: any) => ({
    title: p.name,
    handle: p.part_number.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
    description: `Category: ${p.category} | Manufacturer: ${p.manufacturer}`,
    status: ProductStatus.PUBLISHED,
    shipping_profile_id: shippingProfile.id,
    sales_channels: [{ id: defaultSalesChannel.id }],
    options: [{ title: "Default Variant", values: ["Default"] }],
    metadata: {
      category: p.category,
      manufacturer: p.manufacturer,
      package_type: p.package_type,
      value_rating: p.value_rating,
      tolerance: p.tolerance,
      pack_qty: p.pack_qty,
      stock_qty: p.stock_qty,
      stock_status: p.stock_status,
      image_file: p.image_file,
      datasheet_url: p.datasheet_url,
    },
    variants: [
      {
        title: p.part_number,
        sku: p.part_number,
        options: { "Default Variant": "Default" },
        prices: [
          {
            amount: Math.round(parseFloat(p.price_gbp) * 100),
            currency_code: "gbp",
          },
        ],
      },
    ],
  }));

  logger.info(`Starting import of ${productsToCreate.length} products...`);
  
  // We can process in batches to avoid overwhelming the database
  const batchSize = 10;
  for (let i = 0; i < productsToCreate.length; i += batchSize) {
    const batch = productsToCreate.slice(i, i + batchSize);
    await createProductsWorkflow(container).run({
      input: { products: batch },
    });
    logger.info(`Imported ${i + batch.length} / ${productsToCreate.length}`);
  }

  logger.info("Import complete!");
}
