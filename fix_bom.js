const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(), 'supabase', 'migrations', '005_website_cms.sql');
let content = fs.readFileSync(p, 'utf8');
if (content.charCodeAt(0) === 0xFEFF) {
  content = content.slice(1);
  fs.writeFileSync(p, content);
  console.log('Removed BOM from 005');
}
