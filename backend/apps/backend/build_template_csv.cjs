const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

const productsRaw = fs.readFileSync('d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-products-50.csv', 'utf8');
const products = parse(productsRaw, { columns: true, skip_empty_lines: true });

const templateHeaders = [
  "Product Id","Product Handle","Product Title","Product Subtitle","Product Description","Product Status","Product Thumbnail",
  "Product Weight","Product Length","Product Width","Product Height","Product HS Code","Product Origin Country","Product MID Code",
  "Product Material","Shipping Profile Id","Product Sales Channel 1","Product Collection Id","Product Type Id","Product Tag 1",
  "Product Discountable","Product External Id","Variant Id","Variant Title","Variant SKU","Variant Barcode","Variant Allow Backorder",
  "Variant Manage Inventory","Variant Weight","Variant Length","Variant Width","Variant Height","Variant HS Code","Variant Origin Country",
  "Variant MID Code","Variant Material","Variant Price GBP","Variant Option 1 Name","Variant Option 1 Value","Product Image 1 Url","Product Image 2 Url"
];

const collectionIds = JSON.parse(fs.readFileSync('d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/collection_ids.json', 'utf8'));

const outRecords = products.map(p => {
  const handle = p.part_number.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
  const filename = `${handle}.svg`;
  const imageUrl = `https://nitrous-component.vercel.app/images/${filename}`;

  const row = {};
  templateHeaders.forEach(h => row[h] = ""); // Initialize all to empty string

  row["Product Collection Id"] = collectionIds[p.category] || "";
  row["Product Handle"] = handle;
  row["Product Title"] = p.name;
  row["Product Subtitle"] = p.category;
  row["Product Description"] = `Category: ${p.category} | Manufacturer: ${p.manufacturer}`;
  row["Product Status"] = "published";
  row["Product Thumbnail"] = imageUrl;
  
  row["Product Discountable"] = "TRUE";
  row["Variant Title"] = "Default";
  row["Variant SKU"] = p.part_number;
  row["Variant Allow Backorder"] = "FALSE";
  row["Variant Manage Inventory"] = "TRUE";
  row["Variant Price GBP"] = p.price_gbp;
  row["Variant Option 1 Name"] = "Default Variant";
  row["Variant Option 1 Value"] = "Default";
  row["Product Image 1 Url"] = imageUrl;

  return row;
});

const outCsv = stringify(outRecords, { header: true, columns: templateHeaders });
fs.writeFileSync('d:/Paytriot/Project/Nitrous/frontend/nitrous-catalogue-50/nitrous-component-template-ready.csv', outCsv);
console.log("Template-ready CSV generated!");
