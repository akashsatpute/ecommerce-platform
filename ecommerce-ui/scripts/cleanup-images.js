const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesBaseDir = path.join(__dirname, '..', 'public', 'assets', 'products', 'images');
const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');

// Only keep these files for each category - one unique image per brand/name
const expectedFiles = {
  'mobiles': ['samsung-galaxy','iphone-16','oneplus-nord','redmi-note','motorola-edge','realme-narzo','vivo-v-series','oppo-reno','google-pixel','nothing-phone'],
  'laptops': ['macbook-air','dell-inspiron','hp-pavilion','lenovo-ideapad','asus-vivobook','acer-aspire','msi-gaming','samsung-book','microsoft-surface','lg-gram'],
  'tablets': ['ipad-air','galaxy-tab','lenovo-tab','oneplus-pad','xiaomi-pad','realme-pad','honor-pad','moto-tab','nokia-tab','kids-tab'],
  'headphones': ['sony-nc','jbl-tune','boat-rockerz','sennheiser','skullcandy','bose-qc','zebronics','audiotechnica','philips','marshall'],
  'earbuds': ['airpods-pro','samsung-buds','oneplus-buds','boat-airdopes','noise-buds','realme-buds','jbl-wave','oppo-enco','sony-wf','boult-audio'],
  'air-conditioners': ['voltas','lg-ac','samsung-ac','daikin','bluestar','carrier','hitachi','panasonic-ac','whirlpool-ac','lloyd-ac'],
  'refrigerators': ['lg-fridge','samsung-fridge','whirlpool-fridge','godrej-fridge','haier-fridge','bosch-fridge','panasonic-fridge','voltas-fridge','hisense-fridge','liebherr'],
  'washing-machines': ['lg-wash','samsung-wash','whirlpool-wash','bosch-wash','ifb-wash','panasonic-wash','godrej-wash','haier-wash','croma-wash','lloyd-wash'],
  'microwaves': ['samsung-mw','lg-mw','ifb-mw','panasonic-mw','bajaj-mw','whirlpool-mw','morphy-mw','godrej-mw','haier-mw','croma-mw'],
  'kitchen-appliances': ['mixer-grinder','air-fryer','coffee-maker','induction-cooktop','electric-kettle','toaster','food-processor','hand-blender','rice-cooker','juicer'],
  'bags': ['laptop-backpack','travel-duffel','tote-bag','sling-bag','office-messenger','school-backpack','gym-bag','handbag','cabin-trolley','wallet-combo'],
  'casual-shoes': ['canvas-sneakers','white-low-tops','slip-on-sneakers','leather-casuals','high-top-sneakers','retro-trainers','everyday-loafers','street-sneakers','comfort-walkers','chunky-sneakers'],
  'formal-shoes': ['oxford-formal','derby-leather','monk-strap','brogue-shoes','slip-on-formal','black-office','tan-formal','patent-leather','comfort-dress','wedding-formal'],
  'running-shoes': ['nike-run','adidas-run','puma-run','asics-run','reebok-run','skechers-run','newbalance-run','campus-run','bata-run','hrx-run'],
  'sports-shoes': ['training-shoes','football-studs','basketball-shoes','badminton-shoes','tennis-shoes','cricket-shoes','gym-trainers','walking-sports','trail-shoes','crossfit-shoes'],
  'sandals': ['comfort-sandals','leather-sandals','outdoor-sandals','flip-flops','slide-sandals','ethnic-sandals','walking-sandals','beach-sandals','kids-sandals','cushion-sandals'],
  'mens-clothing': ['oxford-shirt','slim-jeans','polo-tshirt','denim-jacket','chino-pants','linen-shirt','casual-blazer','hoodie','cargo-pants','formal-shirt'],
  'womens-clothing': ['printed-kurti','summer-dress','denim-jacket-w','cotton-top','wide-leg-jeans','ethnic-set','casual-shirt-w','long-skirt','blazer-dress','party-top'],
  'kids-clothing': ['tshirt-set','denim-dungaree','cotton-frock','shirt-pack','jogger-set','winter-hoodie','printed-shorts','party-dress','track-suit','ethnic-kurta'],
  'watches': ['classic-leather','smart-fitness','chronograph','rose-gold','digital-sports','minimal-dial','diver-watch','metal-strap','kids-smart-watch','luxury-analog']
};

// Fallback URLs for failed downloads
const fallbackUrls = {
  'tablets': {
    'moto-tab': 'https://images.pexels.com/photos/163122/pexels-photo-163122.jpeg?auto=compress&cs=tinysrgb&w=500',
    'nokia-tab': 'https://images.pexels.com/photos/161154/pexels-photo-161154.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  'earbuds': {
    'airpods-pro': 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=500',
    'jbl-wave': 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  'bags': {
    'school-backpack': 'https://images.pexels.com/photos/2078268/pexels-photo-2078268.jpeg?auto=compress&cs=tinysrgb&w=500',
    'gym-bag': 'https://images.pexels.com/photos/54274/pexels-photo-54274.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  'formal-shoes': {
    'black-office': 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=500',
    'tan-formal': 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500'
  },
  'running-shoes': {
    'puma-run': 'https://images.pexels.com/photos/1599005/pexels-photo-1599005.jpeg?auto=compress&cs=tinysrgb&w=500',
    'asics-run': 'https://images.pexels.com/photos/1463006/pexels-photo-1463006.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  'mens-clothing': {
    'denim-jacket': 'https://images.pexels.com/photos/1040174/pexels-photo-1040174.jpeg?auto=compress&cs=tinysrgb&w=500',
    'chino-pants': 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  'womens-clothing': {
    'denim-jacket-w': 'https://images.pexels.com/photos/570965/pexels-photo-570965.jpeg?auto=compress&cs=tinysrgb&w=500',
    'cotton-top': 'https://images.pexels.com/photos/570966/pexels-photo-570966.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  'kids-clothing': {
    'shirt-pack': 'https://images.pexels.com/photos/6962827/pexels-photo-6962827.jpeg?auto=compress&cs=tinysrgb&w=500',
    'jogger-set': 'https://images.pexels.com/photos/6962828/pexels-photo-6962828.jpeg?auto=compress&cs=tinysrgb&w=500'
  },
  'watches': {
    'chronograph': 'https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg?auto=compress&cs=tinysrgb&w=500',
    'rose-gold': 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500'
  }
};

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { timeout: 10000 }, (response) => {
      if (response.statusCode !== 200) {
        file.close(); fs.unlink(dest, () => resolve(false));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', () => { fs.unlink(dest, () => resolve(false)); });
  });
}

async function main() {
  // Step 1: Clean up each category - remove files not in expected list
  console.log('🧹 Cleaning up old/duplicate files...');
  for (const [category, names] of Object.entries(expectedFiles)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir, { recursive: true }); continue; }
    
    const currentFiles = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
    const expectedSet = new Set(names.map(n => `${n}.jpg`));
    let removed = 0;
    
    for (const f of currentFiles) {
      if (!expectedSet.has(f)) {
        fs.unlinkSync(path.join(dir, f));
        removed++;
      }
    }
    if (removed > 0) console.log(`  🗑 ${category}: removed ${removed} old files`);
  }

  // Step 2: Check which files are missing and download them
  console.log('\n📥 Downloading missing files...');
  const allFallbacks = {};
  for (const [cat, urls] of Object.entries(fallbackUrls)) {
    Object.assign(allFallbacks[cat] || (allFallbacks[cat] = {}), urls);
  }
  // Also add common fallbacks for all categories
  const commonFallback = 'https://via.placeholder.com/500x500/3b82f6/ffffff?text=';
  
  let downloaded = 0;
  for (const [category, names] of Object.entries(expectedFiles)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    for (const name of names) {
      const dest = path.join(dir, `${name}.jpg`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) continue;
      
      // Try specific fallback, or create a colored placeholder
      let url = allFallbacks[category]?.[name];
      if (!url) {
        const displayName = name.replace(/-/g, '+').substring(0, 20);
        url = `${commonFallback}${displayName}`;
      }
      
      const ok = await downloadFile(url, dest);
      if (ok) { console.log(`  ✅ ${category}/${name}.jpg`); downloaded++; }
      else { console.log(`  ❌ ${category}/${name}.jpg`); }
    }
  }

  // Step 3: Update all JSON files with correct paths
  console.log('\n📝 Updating JSON files...');
  for (const [category, names] of Object.entries(expectedFiles)) {
    const filePath = path.join(productsDir, `${category}.json`);
    if (!fs.existsSync(filePath)) continue;
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    data.forEach((product, index) => {
      product.image = `/assets/products/images/${category}/${names[index % names.length]}.jpg`;
    });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    console.log(`  ✅ ${category}.json`);
  }

  console.log(`\n🎉 All done! Downloaded ${downloaded} missing files.`);
}

main().catch(console.error);