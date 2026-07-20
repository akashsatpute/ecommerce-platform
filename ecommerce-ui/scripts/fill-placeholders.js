const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesBaseDir = path.join(__dirname, '..', 'public', 'assets', 'products', 'images');

// Categories and files that still need images
const neededFiles = {
  'air-conditioners': ['daikin', 'carrier', 'whirlpool-ac'],
  'microwaves': ['whirlpool-mw', 'godrej-mw', 'haier-mw'],
  'washing-machines': ['whirlpool-wash', 'ifb-wash', 'panasonic-wash'],
  'bags': ['office-messenger', 'gym-bag'],
  'running-shoes': ['reebok-run', 'newbalance-run'],
  'tablets': ['moto-tab', 'nokia-tab'],
  'kids-clothing': ['shirt-pack', 'jogger-set'],
  'womens-clothing': ['denim-jacket-w']
};

// Use placeholder.com with unique colors for each product
function getPlaceholderUrl(name) {
  const colors = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'];
  const hash = name.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const color = colors[Math.abs(hash) % colors.length];
  return `https://via.placeholder.com/500x500/${color}/FFFFFF?text=${encodeURIComponent(name.substring(0, 15))}`;
}

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { timeout: 15000 }, (response) => {
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => resolve(false));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', () => { 
      fs.unlink(dest, () => resolve(false));
    }).on('timeout', function() {
      this.destroy();
      fs.unlink(dest, () => resolve(false));
    });
  });
}

async function main() {
  let total = 0;
  
  for (const [category, names] of Object.entries(neededFiles)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) continue;

    console.log(`\n📦 ${category}...`);
    
    for (const name of names) {
      const dest = path.join(dir, `${name}.jpg`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        console.log(`  ⏭ ${name}.jpg (exists)`);
        total++;
        continue;
      }
      
      const url = getPlaceholderUrl(name);
      const ok = await downloadFile(url, dest);
      if (ok) { 
        console.log(`  ✅ ${name}.jpg (placeholder)`); 
        total++; 
      }
      else { 
        console.log(`  ❌ ${name}.jpg`); 
      }
    }
  }

  console.log(`\n🎉 Created ${total} placeholder images!`);
}

main().catch(console.error);