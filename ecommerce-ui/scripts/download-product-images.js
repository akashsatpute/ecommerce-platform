const fs = require('fs');
const path = require('path');
const https = require('https');

const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');
const imagesDir = path.join(productsDir, 'images');

// Ensure images directory exists
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Each category has 10 unique product images mapped to brand names
const categoryImages = {
  'air-conditioners': [
    { name: 'voltas-ac', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=500&q=80' },
    { name: 'lg-dual-inverter-ac', url: 'https://images.unsplash.com/photo-1631624225422-840a1e9e7e9f?auto=format&fit=crop&w=500&q=80' },
    { name: 'samsung-windfree-ac', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=500&q=80' },
    { name: 'daikin-split-ac', url: 'https://images.unsplash.com/photo-1612840662760-5f4a1e87b2b8?auto=format&fit=crop&w=500&q=80' },
    { name: 'bluestar-ac', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80' },
    { name: 'carrier-ac', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=500&q=80' },
    { name: 'hitachi-ac', url: 'https://images.unsplash.com/photo-1631624225422-840a1e9e7e9f?auto=format&fit=crop&w=500&q=80' },
    { name: 'panasonic-ac', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?auto=format&fit=crop&w=500&q=80' },
    { name: 'whirlpool-ac', url: 'https://images.unsplash.com/photo-1612840662760-5f4a1e87b2b8?auto=format&fit=crop&w=500&q=80' },
    { name: 'lloyd-ac', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=500&q=80' }
  ],
  'bags': [
    { name: 'laptop-backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
    { name: 'travel-duffel', url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=500&q=80' },
    { name: 'tote-bag', url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=500&q=80' },
    { name: 'sling-bag', url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=500&q=80' },
    { name: 'office-messenger', url: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b0b3?auto=format&fit=crop&w=500&q=80' },
    { name: 'school-backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80' },
    { name: 'gym-bag', url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=500&q=80' },
    { name: 'handbag', url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=500&q=80' },
    { name: 'cabin-trolley', url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=500&q=80' },
    { name: 'wallet-combo', url: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b0b3?auto=format&fit=crop&w=500&q=80' }
  ],
  'casual-shoes': [
    { name: 'canvas-sneakers', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80' },
    { name: 'white-low-tops', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=500&q=80' },
    { name: 'slip-on-sneakers', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80' },
    { name: 'leather-casuals', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80' },
    { name: 'high-top-sneakers', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=500&q=80' },
    { name: 'retro-trainers', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80' },
    { name: 'everyday-loafers', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80' },
    { name: 'street-sneakers', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=500&q=80' },
    { name: 'comfort-walkers', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80' },
    { name: 'chunky-sneakers', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80' }
  ],
  'earbuds': [
    { name: 'airpods-pro', url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=500&q=80' },
    { name: 'samsung-buds', url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=80' },
    { name: 'oneplus-buds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=500&q=80' },
    { name: 'boat-airdopes', url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=80' },
    { name: 'noise-buds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=500&q=80' },
    { name: 'realme-buds', url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=80' },
    { name: 'jbl-wave-buds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=500&q=80' },
    { name: 'oppo-enco', url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=80' },
    { name: 'sony-wf-buds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?auto=format&fit=crop&w=500&q=80' },
    { name: 'boult-audio', url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=500&q=80' }
  ],
  'formal-shoes': [
    { name: 'oxford-formal', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80' },
    { name: 'derby-leather', url: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?auto=format&fit=crop&w=500&q=80' },
    { name: 'monk-strap', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80' },
    { name: 'brogue-shoes', url: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?auto=format&fit=crop&w=500&q=80' },
    { name: 'slip-on-formal', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80' },
    { name: 'black-office', url: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?auto=format&fit=crop&w=500&q=80' },
    { name: 'tan-formal', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80' },
    { name: 'patent-leather', url: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?auto=format&fit=crop&w=500&q=80' },
    { name: 'comfort-dress', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=500&q=80' },
    { name: 'wedding-formal', url: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?auto=format&fit=crop&w=500&q=80' }
  ],
  'headphones': [
    { name: 'sony-noise-cancelling', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
    { name: 'jbl-tune', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80' },
    { name: 'boat-rockerz', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
    { name: 'sennheiser-hd', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80' },
    { name: 'skullcandy-crusher', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
    { name: 'bose-qc', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80' },
    { name: 'zebronics-studio', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
    { name: 'audiotechnica', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80' },
    { name: 'philips-wireless', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80' },
    { name: 'marshall-major', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=80' }
  ],
  'kids-clothing': [
    { name: 'kids-tshirt-set', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80' },
    { name: 'denim-dungaree', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80' },
    { name: 'cotton-frock', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80' },
    { name: 'school-shirt-pack', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80' },
    { name: 'jogger-set', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80' },
    { name: 'winter-hoodie', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80' },
    { name: 'printed-shorts', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80' },
    { name: 'party-dress', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80' },
    { name: 'track-suit', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=500&q=80' },
    { name: 'ethnic-kurta-set', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=500&q=80' }
  ],
  'kitchen-appliances': [
    { name: 'mixer-grinder', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80' },
    { name: 'air-fryer', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=500&q=80' },
    { name: 'coffee-maker', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80' },
    { name: 'induction-cooktop', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80' },
    { name: 'electric-kettle', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=500&q=80' },
    { name: 'toaster', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80' },
    { name: 'food-processor', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80' },
    { name: 'hand-blender', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?auto=format&fit=crop&w=500&q=80' },
    { name: 'rice-cooker', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=500&q=80' },
    { name: 'juicer', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=500&q=80' }
  ],
  'laptops': [
    { name: 'macbook-air-m2', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80' },
    { name: 'dell-inspiron', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=500&q=80' },
    { name: 'hp-pavilion', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80' },
    { name: 'lenovo-ideapad', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=500&q=80' },
    { name: 'asus-vivobook', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80' },
    { name: 'acer-aspire', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=500&q=80' },
    { name: 'msi-gaming', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80' },
    { name: 'samsung-galaxy-book', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=500&q=80' },
    { name: 'microsoft-surface', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=500&q=80' },
    { name: 'lg-gram', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=500&q=80' }
  ],
  'mens-clothing': [
    { name: 'oxford-shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80' },
    { name: 'slim-fit-jeans', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'polo-tshirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80' },
    { name: 'denim-jacket', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'chino-pants', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80' },
    { name: 'linen-shirt', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'casual-blazer', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80' },
    { name: 'hoodie', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'cargo-pants', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80' },
    { name: 'formal-shirt', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?auto=format&fit=crop&w=500&q=80' }
  ],
  'microwaves': [
    { name: 'samsung-convection', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80' },
    { name: 'lg-charcoal-oven', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80' },
    { name: 'ifb-microwave', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80' },
    { name: 'panasonic-solo', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80' },
    { name: 'bajaj-grill-oven', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80' },
    { name: 'whirlpool-magicook', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80' },
    { name: 'morphy-richards', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80' },
    { name: 'godrej-convection', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80' },
    { name: 'haier-microwave', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?auto=format&fit=crop&w=500&q=80' },
    { name: 'croma-oven', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?auto=format&fit=crop&w=500&q=80' }
  ],
  'mobiles': [
    { name: 'samsung-galaxy', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' },
    { name: 'iphone-16', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'oneplus-nord', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' },
    { name: 'redmi-note-pro', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'motorola-edge', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' },
    { name: 'realme-narzo', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'vivo-v-series', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' },
    { name: 'oppo-reno', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80' },
    { name: 'google-pixel', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80' },
    { name: 'nothing-phone', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=500&q=80' }
  ],
  'refrigerators': [
    { name: 'lg-double-door', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80' },
    { name: 'samsung-convertible', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'whirlpool-frost-free', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80' },
    { name: 'godrej-single-door', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'haier-bottom-mount', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80' },
    { name: 'bosch-french-door', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'panasonic-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80' },
    { name: 'voltas-beko', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'hisense-side-by-side', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=500&q=80' },
    { name: 'liebherr-premium', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?auto=format&fit=crop&w=500&q=80' }
  ],
  'running-shoes': [
    { name: 'nike-run-swift', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { name: 'adidas-galaxy', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80' },
    { name: 'puma-flyer', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { name: 'asics-gel-run', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80' },
    { name: 'reebok-runner', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { name: 'skechers-go-run', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80' },
    { name: 'new-balance-foam', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { name: 'campus-sprint', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80' },
    { name: 'bata-power-run', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80' },
    { name: 'hrx-running', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80' }
  ],
  'sandals': [
    { name: 'comfort-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=500&q=80' },
    { name: 'leather-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=500&q=80' },
    { name: 'outdoor-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=500&q=80' },
    { name: 'flip-flops', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=500&q=80' },
    { name: 'slide-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=500&q=80' },
    { name: 'ethnic-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=500&q=80' },
    { name: 'walking-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=500&q=80' },
    { name: 'beach-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=500&q=80' },
    { name: 'kids-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=500&q=80' },
    { name: 'cushion-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?auto=format&fit=crop&w=500&q=80' }
  ],
  'sports-shoes': [
    { name: 'training-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80' },
    { name: 'football-studs', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80' },
    { name: 'basketball-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80' },
    { name: 'badminton-court', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80' },
    { name: 'tennis-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80' },
    { name: 'cricket-shoes', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80' },
    { name: 'gym-trainers', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80' },
    { name: 'walking-sports', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80' },
    { name: 'trail-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=500&q=80' },
    { name: 'crossfit-shoes', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=500&q=80' }
  ],
  'tablets': [
    { name: 'ipad-air', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'samsung-galaxy-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=80' },
    { name: 'lenovo-tab-plus', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'oneplus-pad', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=80' },
    { name: 'xiaomi-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'realme-pad', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=80' },
    { name: 'honor-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'motorola-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=80' },
    { name: 'nokia-tablet', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=500&q=80' },
    { name: 'kids-learning-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=500&q=80' }
  ],
  'washing-machines': [
    { name: 'lg-front-load', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=500&q=80' },
    { name: 'samsung-top-load', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=500&q=80' },
    { name: 'whirlpool-7kg', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=500&q=80' },
    { name: 'bosch-automatic', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=500&q=80' },
    { name: 'ifb-steam-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=500&q=80' },
    { name: 'panasonic-washer', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=500&q=80' },
    { name: 'godrej-semi-auto', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=500&q=80' },
    { name: 'haier-direct-motion', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=500&q=80' },
    { name: 'croma-washer', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?auto=format&fit=crop&w=500&q=80' },
    { name: 'lloyd-washing', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=500&q=80' }
  ],
  'watches': [
    { name: 'classic-leather', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80' },
    { name: 'smart-fitness', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
    { name: 'chronograph', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80' },
    { name: 'rose-gold', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
    { name: 'digital-sports', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80' },
    { name: 'minimal-dial', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
    { name: 'diver-watch', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80' },
    { name: 'metal-strap', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' },
    { name: 'kids-smart-watch', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=500&q=80' },
    { name: 'luxury-analog', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80' }
  ],
  'womens-clothing': [
    { name: 'printed-kurti', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80' },
    { name: 'summer-dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80' },
    { name: 'denim-jacket-women', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80' },
    { name: 'cotton-top', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80' },
    { name: 'wide-leg-jeans', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80' },
    { name: 'ethnic-set', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80' },
    { name: 'casual-shirt-women', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80' },
    { name: 'long-skirt', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80' },
    { name: 'blazer-dress', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80' },
    { name: 'party-top', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80' }
  ]
};

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function updateJsonWithLocalPaths(categoryName, imageNames) {
  const filePath = path.join(productsDir, `${categoryName}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  data.forEach((product, index) => {
    const baseName = imageNames[index % imageNames.length];
    product.image = `/assets/products/images/${categoryName}/${baseName}.jpg`;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log(`  ✅ Updated ${categoryName}.json with local paths`);
}

async function main() {
  const entries = Object.entries(categoryImages);
  let total = 0;

  for (const [category, images] of entries) {
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
        await downloadImage(img.url, dest);
        console.log(`  ✅ ${fileName}`);
        total++;
      } catch (err) {
        console.error(`  ❌ Failed to download ${fileName}: ${err.message}`);
      }
    });

    await Promise.all(downloadPromises);
    
    // Update the JSON file with local paths
    updateJsonWithLocalPaths(category, imageNames);
  }

  console.log(`\n🎉 All done! Downloaded ${total} images total.`);
}

main().catch(console.error);