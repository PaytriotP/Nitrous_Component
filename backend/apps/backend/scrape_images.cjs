const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const axios = require('axios');

const productsRaw = fs.readFileSync('d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-50.csv', 'utf8');
const products = parse(productsRaw, { columns: true, skip_empty_lines: true });

const imagesRaw = fs.readFileSync('c:/Users/User/Downloads/nitrous_component_images.csv', 'utf8');
const images = parse(imagesRaw, { columns: true, skip_empty_lines: true });

const outDir = 'd:/Paytriot/Project/Nitrous/frontend/public/images/components';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const fallbackUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Electronic_components.jpg/800px-Electronic_components.jpg';

async function downloadImage(url, dest) {
  try {
    const response = await axios({ 
      url, 
      method: 'GET', 
      responseType: 'stream',
      headers: { 'User-Agent': 'NitrousBot/1.0 (contact@nitrous.com)' }
    });
    const writer = fs.createWriteStream(dest);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  } catch (err) {
    console.error(`Failed to download ${url}: ${err.message}`);
  }
}

async function main() {
  const outRecords = [];
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const imgData = images.find(img => img.part_number === p.part_number);
    let url = imgData && imgData.image_source_url ? imgData.image_source_url : null;
    
    if (url && url.includes('/wiki/File:')) {
      const filename = url.split('/wiki/File:')[1];
      url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
    } else {
      url = fallbackUrl;
    }

    const filename = `${p.part_number.toLowerCase().replace(/[^a-z0-9_-]/g, "-")}.jpg`;
    const destPath = path.join(outDir, filename);
    
    console.log(`Downloading image for ${p.part_number}...`);
    await downloadImage(url, destPath);

    outRecords.push({
      "Product Handle": p.part_number.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
      "Product Title": p.name,
      "Product Description": `Category: ${p.category} | Manufacturer: ${p.manufacturer}`,
      "Product Status": "published",
      "Product Thumbnail": `https://nitrous-component.vercel.app/images/components/${filename}`,
      "Product Collection": p.category,
      "Product Type": p.category,
      "Product Tags": `${p.manufacturer}, ${p.package_type}`,
      "Variant Title": "Default",
      "Variant SKU": p.part_number,
      "Variant Inventory Quantity": p.stock_qty,
      "Variant Allow Backorder": "FALSE",
      "Variant Manage Inventory": "TRUE",
      "Variant Price [GBP]": p.price_gbp,
      "Category": p.category,
      "Manufacturer": p.manufacturer
    });
  }

  const outCsv = stringify(outRecords, { header: true });
  fs.writeFileSync('d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-scraped.csv', outCsv);
  console.log("Finished scraping! Saved CSV to nitrous-component-products-scraped.csv");
}

main();
