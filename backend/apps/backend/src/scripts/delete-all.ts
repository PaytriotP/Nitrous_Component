import { MedusaContainer } from "@medusajs/framework";
import { deleteProductsWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export default async function deleteProducts({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  logger.info("Fetching existing products...");
  const { data: existingProducts } = await query.graph({ entity: "product", fields: ["id"] });
  
  if (existingProducts.length > 0) {
    logger.info(`Deleting ${existingProducts.length} products...`);
    // Delete in batches of 10 to avoid payload limits
    const batchSize = 10;
    for (let i = 0; i < existingProducts.length; i += batchSize) {
      const batch = existingProducts.slice(i, i + batchSize).map((p: any) => p.id);
      await deleteProductsWorkflow(container).run({ input: { ids: batch } });
      logger.info(`Deleted ${i + batch.length} / ${existingProducts.length}`);
    }
    logger.info("Successfully deleted all products.");
  } else {
    logger.info("No products found to delete.");
  }
}
