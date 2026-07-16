const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

// Read products
const productsRaw = fs.readFileSync('d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-50.csv', 'utf8');
const products = parse(productsRaw, { columns: true, skip_empty_lines: true });

// Read images
const imagesRaw = fs.readFileSync('c:/Users/User/Downloads/nitrous_component_images.csv', 'utf8');
const images = parse(imagesRaw, { columns: true, skip_empty_lines: true });

const imageMap = {};
images.forEach(img => {
  let url = img.image_source_url;
  if (url && url.includes('/wiki/File:')) {
    const filename = url.split('/wiki/File:')[1];
    url = `https://commons.wikimedia.org/wiki/Special:FilePath/${filename}`;
  } else if (!url || url.includes('GAP')) {
    url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Electronic_components.jpg/800px-Electronic_components.jpg'; // Generic fallback
  }
  imageMap[img.part_number] = url;
});

// Build Medusa standard CSV
const outRecords = products.map(p => {
  return {
    "Product Handle": p.part_number.toLowerCase().replace(/[^a-z0-9_-]/g, "-"),
    "Product Title": p.name,
    "Product Description": `Category: ${p.category} | Manufacturer: ${p.manufacturer}`,
    "Product Status": "published",
    "Product Thumbnail": imageMap[p.part_number] || 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Electronic_components.jpg/800px-Electronic_components.jpg',
    "Product Collection": p.category,
    "Product Type": p.category,
    "Product Tags": `${p.manufacturer}, ${p.package_type}`,
    "Variant Title": "Default",
    "Variant SKU": p.part_number,
    "Variant Inventory Quantity": p.stock_qty,
    "Variant Allow Backorder": "FALSE",
    "Variant Manage Inventory": "TRUE",
    "Variant Price [GBP]": p.price_gbp,
    // Add custom columns if the user explicitly wants them in the CSV (though Medusa UI might ignore them)
    "Category": p.category,
    "Manufacturer": p.manufacturer
  };
});

const outCsv = stringify(outRecords, { header: true });
fs.writeFileSync('d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-real.csv', outCsv);
console.log("CSV generated at d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-real.csv");
