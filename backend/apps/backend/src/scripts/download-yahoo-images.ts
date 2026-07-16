import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import fs from "fs";
import path from "path";
import axios from "axios";
import * as cheerio from "cheerio";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default async function downloadYahooImages({
  container,
}: {
  container: MedusaContainer;
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  
  const itemsToFetch = [
    { handle: "cap-100u-25v", q: "Electrolytic capacitor radial" },
    { handle: "cap-1000u-16v", q: "Aluminum electrolytic capacitor" },
    { handle: "bc547b", q: "BC547 transistor" },
    { handle: "irlz44n", q: "TO-220 mosfet" },
    { handle: "conn-hdr-f40", q: "female pin header strip" },
    { handle: "conn-jst-xh-kit", q: "JST connector kit" },
    { handle: "conn-usb-c-bob", q: "USB-C receptacle breakout" },
    { handle: "conn-term-2p", q: "PCB Terminal Block 2 pin" },
    { handle: "conn-banana-4mm", q: "Banana plug connector" },
    { handle: "conn-croc-set", q: "Crocodile clip test lead" },
    { handle: "mod-sd-card", q: "MicroSD Card module arduino" },
    { handle: "reg-ams1117-33", q: "AMS1117 regulator" },
    { handle: "psu-mb102", q: "Breadboard Power Supply mb102" },
    { handle: "tool-tweezer-esd", q: "ESD Tweezers set" }
  ];

  const outDir = path.join(process.cwd(), "../../../frontend/public/images/components");
  const productUpdates = [];

  for (const item of itemsToFetch) {
    logger.info(`Searching Yahoo Images for: ${item.q}`);
    await delay(1500);

    try {
      const searchUrl = `https://images.search.yahoo.com/search/images?p=${encodeURIComponent(item.q)}`;
      const searchRes = await axios.get(searchUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      
      const $ = cheerio.load(searchRes.data);
      const firstImage = $('img').filter((i, el) => {
          const src = $(el).attr('src') || $(el).attr('data-src');
          return src && src.includes('bing.net/th');
      }).first();
      
      let imgUrl = firstImage.attr('src') || firstImage.attr('data-src');
      
      if (imgUrl) {
        logger.info(`Downloading ${imgUrl}`);
        
        try {
            const imgRes = await axios.get(imgUrl, { responseType: 'stream', timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
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
          logger.warn(`No images found for ${item.q}`);
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

  // Also include the ones that were successfully generated but the user thinks failed because they aren't deployed!
  // We'll update the DB again just to be absolutely sure they are pointed correctly.
  const localItemsToEnsure = [
    { handle: "conn-hdr-40", image_file: "images/components/conn-hdr-40.png" },
    { handle: "conn-idc-10", image_file: "images/components/conn-idc-10.png" },
    { handle: "mod-oled-096", image_file: "images/components/mod-oled-096.png" },
    { handle: "cap-104-cer", image_file: "images/components/cap-104-cer.jpg" },
    { handle: "cap-kit-300", image_file: "images/components/cap-kit-300.jpg" }
  ];

  for (const update of localItemsToEnsure) {
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
