const fs = require('fs');
const path = require('path');

function removeBom(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeBom(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
        changed = true;
      }
      if (content.indexOf(String.fromCharCode(0xFEFF)) !== -1) {
        content = content.replace(new RegExp(String.fromCharCode(0xFEFF), 'g'), '');
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Fixed BOM in', fullPath);
      }
    }
  }
}
removeBom(path.join(process.cwd(), 'app', 'admin'));
