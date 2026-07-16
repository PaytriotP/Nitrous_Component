import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export default async function updateGeneratedImages2({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const handlesToUpdate = [
    { handle: "res-10k-0-25w", image: "images/components/res-10k-0-25w.png" },
    { handle: "res-1k-0-25w", image: "images/components/res-1k-0-25w.png" },
    { handle: "res-220r-0-25w", image: "images/components/res-220r-0-25w.png" },
    { handle: "res-kit-600", image: "images/components/res-kit-600.png" },
    { handle: "ne555p", image: "images/components/ne555p.png" },
    { handle: "lm358p", image: "images/components/lm358p.png" },
    { handle: "atmega328p-pu", image: "images/components/atmega328p-pu.png" },
    { handle: "l293d", image: "images/components/l293d.png" },
    { handle: "pc817", image: "images/components/pc817.png" },
    { handle: "74hc595n", image: "images/components/74hc595n.png" }
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
