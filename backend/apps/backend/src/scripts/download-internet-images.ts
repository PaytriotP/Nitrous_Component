import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import fs from "fs";
import path from "path";
import axios from "axios";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function downloadInternetImages({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const itemsToFetch = [
    { handle: "cap-100u-25v", q: "Electrolytic capacitor" },
    { handle: "cap-1000u-16v", q: "Aluminum electrolytic capacitor" },
    { handle: "bc547b", q: "BC547" },
    { handle: "irlz44n", q: "TO-220 mosfet" },
    { handle: "conn-hdr-f40", q: "female pin header" },
    { handle: "conn-jst-xh-kit", q: "JST connector" },
    { handle: "conn-usb-c-bob", q: "USB-C receptacle" },
    { handle: "conn-term-2p", q: "PCB Terminal Block" },
    { handle: "conn-banana-4mm", q: "Banana plug connector" },
    { handle: "conn-croc-set", q: "Crocodile clip" },
    { handle: "mod-sd-card", q: "MicroSD Card module" },
    { handle: "reg-ams1117-33", q: "AMS1117 regulator" },
    { handle: "psu-mb102", q: "Breadboard Power Supply" },
    { handle: "tool-tweezer-esd", q: "ESD Tweezers" }
  ];

  const outDir = path.join(process.cwd(), "../../../frontend/public/images/components");
  const productUpdates = [];
  const usedUrls = new Set();

  for (const item of itemsToFetch) {
    logger.info(`Searching Wikimedia for: ${item.q}`);
    await delay(3000); // 3 second delay to avoid 429 Too Many Requests

    try {
      const res = await axios.get('https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch='+encodeURIComponent(item.q)+'&srnamespace=6&utf8=&format=json', {
          headers: { 'User-Agent': 'NitrousBot/2.0' }
      });
      
      let bestImage = null;
      if(res.data.query && res.data.query.search.length > 0){
        for (const result of res.data.query.search) {
          const title = result.title;
          if (title.match(/\.(jpg|jpeg|png)$/i)) {
            const imgUrl = 'https://commons.wikimedia.org/wiki/Special:FilePath/' + encodeURIComponent(title.replace('File:', ''));
            if (!usedUrls.has(imgUrl)) {
                bestImage = imgUrl;
                usedUrls.add(imgUrl);
                break;
            }
          }
        }
      }

      if (bestImage) {
        logger.info(`Downloading ${bestImage}`);
        await delay(2000); // Wait before downloading image
        try {
            const imgRes = await axios.get(bestImage, { responseType: 'stream', timeout: 8000, headers: { 'User-Agent': 'NitrousBot/2.0' } });
            const destPath = path.join(outDir, `${item.handle}.jpg`);
            const writer = fs.createWriteStream(destPath);
            imgRes.data.pipe(writer);
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
            logger.info(`Saved ${item.handle}.jpg`);
            
            productUpdates.push({
                handle: item.handle,
                image_file: `images/components/${item.handle}.jpg`
            });
        } catch (downloadErr) {
            logger.error(`Failed to download image for ${item.handle}`);
        }
      } else {
          logger.warn(`No unique images found for ${item.q}`);
      }
    } catch (searchErr) {
      logger.error(`Search failed for ${item.handle}: ${searchErr.message}`);
    }
  }

  logger.info("Fetching existing products to map IDs...");
  const { data: dbProducts } = await query.graph({ entity: "product", fields: ["id", "handle", "metadata"] });

  const finalUpdates = [];
  for (const update of productUpdates) {
    const prod = dbProducts.find((p: any) => p.handle === update.handle);
    if (prod) {
      finalUpdates.push({
        id: prod.id,
        metadata: {
          ...prod.metadata,
          image_file: update.image_file
        }
      });
    }
  }

  if (finalUpdates.length > 0) {
    logger.info(`Updating ${finalUpdates.length} product images in DB...`);
    await updateProductsWorkflow(container).run({ input: { products: finalUpdates } });
    logger.info("Successfully updated product images!");
  } else {
    logger.warn("No matching products found to update.");
  }
}
