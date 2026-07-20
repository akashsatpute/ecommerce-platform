const fs = require('fs');
const path = require('path');

const imagesBaseDir = path.join(__dirname, '..', 'public', 'assets', 'products', 'images');

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

async function main() {
  let total = 0;
  
  for (const [category, names] of Object.entries(neededFiles)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) continue;

    console.log(`\n📦 ${category}...`);
    
    // Get list of existing images in this category
    const existing = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
    if (existing.length === 0) {
      console.log(`  ❌ No existing images to copy from`);
      continue;
    }

    for (const name of names) {
      const dest = path.join(dir, `${name}.jpg`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        console.log(`  ⏭ ${name}.jpg (exists)`);
        total++;
        continue;
      }

      // Copy first existing image as placeholder
      const source = path.join(dir, existing[0]);
      try {
        fs.copyFileSync(source, dest);
        console.log(`  ✅ ${name}.jpg (copied from ${existing[0]})`);
        total++;
      } catch (err) {
        console.log(`  ❌ ${name}.jpg - ${err.message}`);
      }
    }
  }

  console.log(`\n🎉 Filled ${total} missing images!`);
}

main();