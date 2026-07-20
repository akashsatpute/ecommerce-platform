const fs = require('fs');
const path = require('path');
const https = require('https');

const imagesBaseDir = path.join(__dirname, '..', 'public', 'assets', 'products', 'images');

const missingFiles = {
  'air-conditioners': [
    { name: 'lg-ac', url: 'https://images.pexels.com/photos/6264117/pexels-photo-6264117.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'daikin', url: 'https://images.pexels.com/photos/3900398/pexels-photo-3900398.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'carrier', url: 'https://images.pexels.com/photos/205691/pexels-photo-205691.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'hitachi', url: 'https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'whirlpool-ac', url: 'https://images.pexels.com/photos/3900398/pexels-photo-3900398.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'refrigerators': [
    { name: 'samsung-fridge', url: 'https://images.pexels.com/photos/6197124/pexels-photo-6197124.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'washing-machines': [
    { name: 'whirlpool-wash', url: 'https://images.pexels.com/photos/6195138/pexels-photo-6195138.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'ifb-wash', url: 'https://images.pexels.com/photos/6195140/pexels-photo-6195140.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'panasonic-wash', url: 'https://images.pexels.com/photos/6195139/pexels-photo-6195139.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'microwaves': [
    { name: 'bajaj-mw', url: 'https://images.pexels.com/photos/5519768/pexels-photo-5519768.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'whirlpool-mw', url: 'https://images.pexels.com/photos/5519769/pexels-photo-5519769.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'godrej-mw', url: 'https://images.pexels.com/photos/5519770/pexels-photo-5519770.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'haier-mw', url: 'https://images.pexels.com/photos/6402840/pexels-photo-6402840.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'bags': [
    { name: 'office-messenger', url: 'https://images.pexels.com/photos/1606503153255-59d8b2e4b0b3?w=500' },
    { name: 'gym-bag', url: 'https://images.pexels.com/photos/54274/pexels-photo-54274.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'formal-shoes': [
    { name: 'derby-leather', url: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'slip-on-formal', url: 'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'running-shoes': [
    { name: 'reebok-run', url: 'https://images.pexels.com/photos/973498/pexels-photo-973498.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'newbalance-run', url: 'https://images.pexels.com/photos/1463007/pexels-photo-1463007.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'womens-clothing': [
    { name: 'denim-jacket-w', url: 'https://images.pexels.com/photos/570965/pexels-photo-570965.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'kids-clothing': [
    { name: 'shirt-pack', url: 'https://images.pexels.com/photos/6962827/pexels-photo-6962827.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'jogger-set', url: 'https://images.pexels.com/photos/6962828/pexels-photo-6962828.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'tablets': [
    { name: 'moto-tab', url: 'https://images.pexels.com/photos/163122/pexels-photo-163122.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'nokia-tab', url: 'https://images.pexels.com/photos/161154/pexels-photo-161154.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ]
};

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
  
  for (const [category, images] of Object.entries(missingFiles)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) continue;

    console.log(`\n📦 ${category}...`);
    
    for (const img of images) {
      const dest = path.join(dir, `${img.name}.jpg`);
      if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        console.log(`  ⏭ ${img.name}.jpg (exists)`);
        total++;
        continue;
      }
      
      const ok = await downloadFile(img.url, dest);
      if (ok) { 
        console.log(`  ✅ ${img.name}.jpg`); 
        total++; 
      }
      else { 
        console.log(`  ❌ ${img.name}.jpg - ${img.url}`); 
      }
    }
  }

  console.log(`\n🎉 Downloaded ${total} missing files!`);
}

main().catch(console.error);