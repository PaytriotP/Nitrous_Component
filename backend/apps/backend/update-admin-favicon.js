const fs = require('fs');
const path = require('path');

const indexHtmlPath = path.join(__dirname, '.medusa/server/public/admin/index.html');
const faviconDestPath = path.join(__dirname, '.medusa/server/public/admin/favicon.svg');
const faviconSourcePath = path.join(__dirname, '../../../frontend/public/favicon.svg');

if (fs.existsSync(indexHtmlPath)) {
  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  html = html.replace(
    '<link rel="icon" href="data:," data-placeholder-favicon />',
    '<link rel="icon" type="image/svg+xml" href="/app/favicon.svg" />'
  );
  fs.writeFileSync(indexHtmlPath, html, 'utf8');
  console.log('Updated admin index.html with new favicon.');
} else {
  console.log('Admin index.html not found, skipping favicon update.');
}

if (fs.existsSync(faviconSourcePath)) {
  fs.copyFileSync(faviconSourcePath, faviconDestPath);
  console.log('Copied favicon.svg to admin directory.');
} else {
  console.log('Source favicon.svg not found.');
}

const targetAdminDir = path.join(__dirname, 'public/admin');
const sourceAdminDir = path.join(__dirname, '.medusa/server/public/admin');
if (fs.existsSync(sourceAdminDir)) {
  fs.cpSync(sourceAdminDir, targetAdminDir, { recursive: true });
  console.log('Copied admin build to public/admin');
}
