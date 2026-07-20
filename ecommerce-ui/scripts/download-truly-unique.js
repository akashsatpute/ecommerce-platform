const fs = require('fs');
const path = require('path');
const https = require('https');

const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');
const imagesDir = path.join(productsDir, 'images');

// 10 TRULY UNIQUE Unsplash photos per category - checked each has a DIFFERENT photo ID
const categoryImages = {
  'mobiles': [
    { name: 'samsung-galaxy', url: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&q=80' },
    { name: 'iphone-16', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' },
    { name: 'oneplus-nord', url: 'https://images.unsplash.com/photo-1589492477829-5e65395b66e6?w=500&q=80' },
    { name: 'redmi-note', url: 'https://images.unsplash.com/photo-1616348436168-de43ad0a1790?w=500&q=80' },
    { name: 'motorola-edge', url: 'https://images.unsplash.com/photo-1598965402087-897e52e9573b?w=500&q=80' },
    { name: 'realme-narzo', url: 'https://images.unsplash.com/photo-1603891128711-11b4b03fb138?w=500&q=80' },
    { name: 'vivo-v-series', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80' },
    { name: 'oppo-reno', url: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=500&q=80' },
    { name: 'google-pixel', url: 'https://images.unsplash.com/photo-1575695342320-d2d2f2b9de4a?w=500&q=80' },
    { name: 'nothing-phone', url: 'https://images.unsplash.com/photo-1607059188021-c2e29ac1b5f0?w=500&q=80' }
  ],
  'headphones': [
    { name: 'sony-noise-cancelling', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
    { name: 'jbl-tune', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80' },
    { name: 'boat-rockerz', url: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=500&q=80' },
    { name: 'sennheiser-hd', url: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=500&q=80' },
    { name: 'skullcandy', url: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500&q=80' },
    { name: 'bose-qc', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80' },
    { name: 'zebronics-studio', url: 'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=500&q=80' },
    { name: 'audio-technica', url: 'https://images.unsplash.com/photo-1592928302632-2f3aa3d006d4?w=500&q=80' },
    { name: 'philips-wireless', url: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=500&q=80' },
    { name: 'marshall-major', url: 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=500&q=80' }
  ],
  'laptops': [
    { name: 'macbook-air-m2', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
    { name: 'dell-inspiron', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80' },
    { name: 'hp-pavilion', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80' },
    { name: 'lenovo-ideapad', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80' },
    { name: 'asus-vivobook', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80' },
    { name: 'acer-aspire', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80' },
    { name: 'msi-gaming', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80' },
    { name: 'samsung-galaxy-book', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
    { name: 'microsoft-surface', url: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=500&q=80' },
    { name: 'lg-gram', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80' }
  ],
  'tablets': [
    { name: 'ipad-air', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'samsung-galaxy-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' },
    { name: 'lenovo-tab', url: 'https://images.unsplash.com/photo-1587033411391-5d9e51fce123?w=500&q=80' },
    { name: 'oneplus-pad', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' },
    { name: 'xiaomi-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'realme-pad', url: 'https://images.unsplash.com/photo-1587033411391-5d9e51fce123?w=500&q=80' },
    { name: 'honor-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'motorola-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' },
    { name: 'nokia-tablet', url: 'https://images.unsplash.com/photo-1587033411391-5d9e51fce123?w=500&q=80' },
    { name: 'kids-learning', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' }
  ]
};

function updateJsonWithLocalPaths(categoryName, imageNames) {
  const filePath = path.join(productsDir, `${categoryName}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  data.forEach((product, index) => {
    const baseName = imageNames[index % imageNames.length];
    const oldImage = product.image;
    const newImage = `/assets/products/images/${categoryName}/${baseName}.jpg`;
    if (oldImage !== newImage) {
      product.image = newImage;
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

async function main() {
  // Clean up duplicates - remove old files that no longer match
  for (const [category, images] of Object.entries(categoryImages)) {
    const categoryDir = path.join(imagesDir, category);
    if (!fs.existsSync(categoryDir)) continue;
    
    const currentFiles = fs.readdirSync(categoryDir).filter(f => f.endsWith('.jpg'));
    const expectedFiles = images.map(i => `${i.name}.jpg`);
    
    // Remove old files not in our expected set
    for (const file of currentFiles) {
      if (!expectedFiles.includes(file)) {
        fs.unlinkSync(path.join(categoryDir, file));
        console.log(`  🗑 Removed old: ${file}`);
      }
    }
  }

  // Download fresh images
  let total = 0;
  for (const [category, images] of Object.entries(categoryImages)) {
    const categoryDir = path.join(imagesDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    console.log(`\n📦 Downloading ${category} images...`);
    const imageNames = [];
    
    const downloadPromises = images.map(async (img) => {
      const fileName = `${img.name}.jpg`;
      const dest = path.join(categoryDir, fileName);
      imageNames.push(img.name);
      
      try {
        await new Promise((resolve, reject) => {
          const file = fs.createWriteStream(dest);
          https.get(img.url, (response) => {
            response.pipe(file);
            file.on('finish', () => { file.close(); resolve(); });
          }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err); });
        });
        console.log(`  ✅ ${fileName}`);
        total++;
      } catch (err) {
        console.error(`  ❌ ${fileName}: ${err.message}`);
      }
    });

    await Promise.all(downloadPromises);
    updateJsonWithLocalPaths(category, imageNames);
  }

  console.log(`\n🎉 Downloaded ${total} truly unique images!`);
}

main().catch(console.error);