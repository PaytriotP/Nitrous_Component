import { MedusaContainer } from "@medusajs/framework";
import { createProductCollectionsWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import fs from "fs";
import path from "path";

export default async function setupCollections({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const categories = [
    "Semiconductors",
    "Passives",
    "Connectors",
    "Boards & Modules",
    "Power",
    "Tools & Consumables"
  ];

  const idMap: Record<string, string> = {};

  for (const cat of categories) {
    const handle = cat.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const { data: existing } = await query.graph({ entity: "product_collection", fields: ["id", "title"] });
    const match = existing.find((e: any) => e.title === cat);
    if (match) {
      idMap[cat] = match.id;
      logger.info(`Found existing collection: ${cat} -> ${match.id}`);
    } else {
      logger.info(`Creating collection: ${cat}...`);
      const productModule = container.resolve("product");
      const result = await productModule.createProductCollections([{ title: cat, handle }]);
      idMap[cat] = result[0].id;
      logger.info(`Created collection: ${cat} -> ${result[0].id}`);
    }
  }

  const outPath = path.resolve(process.cwd(), "../../../frontend/nitrous-catalogue-50/collection_ids.json");
  fs.writeFileSync(outPath, JSON.stringify(idMap, null, 2));
  logger.info(`Saved collection IDs to ${outPath}`);
}
