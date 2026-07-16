import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function updateGeneratedImages({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const handlesToUpdate = [
    { handle: "conn-hdr-40", image: "images/components/conn-hdr-40.png" },
    { handle: "conn-idc-10", image: "images/components/conn-idc-10.png" },
    { handle: "mod-oled-096", image: "images/components/mod-oled-096.png" }
  ];

  logger.info("Fetching existing products...");
  const { data: dbProducts } = await query.graph({ entity: "product", fields: ["id", "handle", "metadata"] });

  const productUpdates = [];

  for (const item of handlesToUpdate) {
    const prod = dbProducts.find((p: any) => p.handle === item.handle);
    if (prod) {
      productUpdates.push({
        id: prod.id,
        metadata: {
          ...prod.metadata,
          image_file: item.image
        }
      });
    }
  }

  if (productUpdates.length > 0) {
    logger.info(`Updating ${productUpdates.length} product images...`);
    await updateProductsWorkflow(container).run({ input: { products: productUpdates } });
    logger.info("Successfully updated product images!");
  } else {
    logger.warn("No matching products found.");
  }
}
