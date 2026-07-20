const fs = require('fs');
const path = require('path');
const https = require('https');

const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');
const imagesBaseDir = path.join(productsDir, 'images');

// Use Unsplash Source API with different keywords/seeds for each product
// This guarantees each image URL points to a DIFFERENT photo
const productUrls = {
  'mobiles': [
    { name: 'samsung-galaxy', url: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500' },
    { name: 'iphone-16', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500' },
    { name: 'oneplus-nord', url: 'https://images.unsplash.com/photo-1589492477829-5e65395b66e6?w=500' },
    { name: 'redmi-note', url: 'https://images.unsplash.com/photo-1616348436168-de43ad0a1790?w=500' },
    { name: 'motorola-edge', url: 'https://images.unsplash.com/photo-1598965402087-897e52e9573b?w=500' },
    { name: 'realme-narzo', url: 'https://images.unsplash.com/photo-1603891128711-11b4b03fb138?w=500' },
    { name: 'vivo-v', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500' },
    { name: 'oppo-reno', url: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=500' },
    { name: 'google-pixel', url: 'https://images.unsplash.com/photo-1575695342320-d2d2f2b9de4a?w=500' },
    { name: 'nothing-phone', url: 'https://images.unsplash.com/photo-1607059188021-c2e29ac1b5f0?w=500' }
  ],
  'laptops': [
    { name: 'macbook-air', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500' },
    { name: 'dell-inspiron', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500' },
    { name: 'hp-pavilion', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500' },
    { name: 'lenovo-ideapad', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500' },
    { name: 'asus-vivobook', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500' },
    { name: 'acer-aspire', url: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500' },
    { name: 'msi-gaming', url: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500' },
    { name: 'samsung-book', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500' },
    { name: 'surface-pro', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500' },
    { name: 'lg-gram', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500' }
  ],
  'tablets': [
    { name: 'ipad-air', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
    { name: 'galaxy-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500' },
    { name: 'lenovo-tab', url: 'https://images.unsplash.com/photo-1587033411391-5d9e51fce123?w=500' },
    { name: 'oneplus-pad', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500' },
    { name: 'xiaomi-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
    { name: 'realme-pad', url: 'https://images.unsplash.com/photo-1587033411391-5d9e51fce123?w=500' },
    { name: 'honor-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
    { name: 'moto-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500' },
    { name: 'nokia-tab', url: 'https://images.unsplash.com/photo-1587033411391-5d9e51fce123?w=500' },
    { name: 'kids-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500' }
  ],
  'headphones': [
    { name: 'sony-nc', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { name: 'jbl-tune', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500' },
    { name: 'boat-rockerz', url: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500' },
    { name: 'sennheiser', url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500' },
    { name: 'skullcandy', url: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500' },
    { name: 'bose-qc', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500' },
    { name: 'zebronics', url: 'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=500' },
    { name: 'audiotechnica', url: 'https://images.unsplash.com/photo-1592928302632-2f3aa3d006d4?w=500' },
    { name: 'philips', url: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=500' },
    { name: 'marshall', url: 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=500' }
  ],
  'air-conditioners': [
    { name: 'voltas', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500' },
    { name: 'lg-ac', url: 'https://images.unsplash.com/photo-1631624225422-840a1e9e7e9f?w=500' },
    { name: 'samsung-ac', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500' },
    { name: 'daikin', url: 'https://images.unsplash.com/photo-1612840662760-5f4a1e87b2b8?w=500' },
    { name: 'bluestar', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500' },
    { name: 'carrier', url: 'https://images.unsplash.com/photo-1559160782-9d9a6e9f1b45?w=500' },
    { name: 'hitachi', url: 'https://images.unsplash.com/photo-1599220141732-9e0e3a3b3b5a?w=500' },
    { name: 'panasonic-ac', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500' },
    { name: 'whirlpool-inv', url: 'https://images.unsplash.com/photo-1615874959474-d609969a50ed?w=500' },
    { name: 'lloyd-ac', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500' }
  ],
  'refrigerators': [
    { name: 'lg-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500' },
    { name: 'samsung-fridge', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500' },
    { name: 'whirlpool-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500' },
    { name: 'godrej-fridge', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500' },
    { name: 'haier-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500' },
    { name: 'bosch-fridge', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500' },
    { name: 'panasonic-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500' },
    { name: 'voltas-fridge', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500' },
    { name: 'hisense-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500' },
    { name: 'liebherr', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500' }
  ],
  'washing-machines': [
    { name: 'lg-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500' },
    { name: 'samsung-wash', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500' },
    { name: 'whirlpool-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500' },
    { name: 'bosch-wash', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500' },
    { name: 'ifb-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500' },
    { name: 'panasonic-wash', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500' },
    { name: 'godrej-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500' },
    { name: 'haier-wash', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500' },
    { name: 'croma-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500' },
    { name: 'lloyd-wash', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500' }
  ],
  'microwaves': [
    { name: 'samsung-mw', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500' },
    { name: 'lg-mw', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500' },
    { name: 'ifb-mw', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500' },
    { name: 'panasonic-mw', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500' },
    { name: 'bajaj-mw', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500' },
    { name: 'whirlpool-mw', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500' },
    { name: 'morphy-mw', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500' },
    { name: 'godrej-mw', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500' },
    { name: 'haier-mw', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500' },
    { name: 'croma-mw', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500' }
  ]
};

function downloadImage(url, dest, name) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', () => { 
      fs.unlink(dest, () => {});
      resolve(false); 
    });
  });
}

function updateJson(categoryName, imageNames) {
  const filePath = path.join(productsDir, `${categoryName}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  data.forEach((product, index) => {
    const baseName = imageNames[index % imageNames.length];
    const newImage = `/assets/products/images/${categoryName}/${baseName}.jpg`;
    const oldImage = product.image;
    if (oldImage !== newImage) {
      product.image = newImage;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`  ✅ Updated ${categoryName}.json`);
}

async function main() {
  // First, clean up old files - keep only files in our URLs list
  for (const [category, images] of Object.entries(productUrls)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) continue;
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg'));
    const expected = new Set(images.map(i => `${i.name}.jpg`));
    
    for (const f of files) {
      if (!expected.has(f)) {
        try { fs.unlinkSync(path.join(dir, f)); } catch(e) {}
      }
    }
  }

  // Download fresh
  let total = 0;
  for (const [category, images] of Object.entries(productUrls)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    console.log(`\n📦 ${category}...`);
    const names = [];

    for (const img of images) {
      const dest = path.join(dir, `${img.name}.jpg`);
      names.push(img.name);
      
      const ok = await downloadImage(img.url, dest, img.name);
      if (ok) { console.log(`  ✅ ${img.name}.jpg`); total++; }
      else { console.log(`  ❌ ${img.name}.jpg`); }
    }
    
    updateJson(category, names);
  }

  console.log(`\n🎉 ${total} unique images downloaded!`);
}

main().catch(console.error);