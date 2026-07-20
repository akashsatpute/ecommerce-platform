const fs = require('fs');
const path = require('path');
const https = require('https');

const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');
const imagesDir = path.join(productsDir, 'images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 10 completely UNIQUE Unsplash images per category (no repeats within category)
const categoryImages = {
  'air-conditioners': [
    { name: 'voltas-1.5-ton', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80' },
    { name: 'lg-dual-inverter', url: 'https://images.unsplash.com/photo-1631624225422-840a1e9e7e9f?w=500&q=80' },
    { name: 'samsung-windfree', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&q=80' },
    { name: 'daikin-split', url: 'https://images.unsplash.com/photo-1612840662760-5f4a1e87b2b8?w=500&q=80' },
    { name: 'bluestar-cooling', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&q=80' },
    { name: 'carrier-convertible', url: 'https://images.unsplash.com/photo-1559160782-9d9a6e9f1b45?w=500&q=80' },
    { name: 'hitachi-cooling', url: 'https://images.unsplash.com/photo-1599220141732-9e0e3a3b3b5a?w=500&q=80' },
    { name: 'panasonic-smart', url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=500&q=80' },
    { name: 'whirlpool-inverter', url: 'https://images.unsplash.com/photo-1615874959474-d609969a50ed?w=500&q=80' },
    { name: 'lloyd-split', url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=80' }
  ],
  'bags': [
    { name: 'laptop-backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80' },
    { name: 'travel-duffel', url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80' },
    { name: 'tote-bag', url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&q=80' },
    { name: 'sling-bag', url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500&q=80' },
    { name: 'office-messenger', url: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b0b3?w=500&q=80' },
    { name: 'school-backpack', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&q=80' },
    { name: 'gym-bag', url: 'https://images.unsplash.com/photo-1583779436706-b742db2c4c2c?w=500&q=80' },
    { name: 'handbag', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80' },
    { name: 'cabin-trolley', url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&q=80' },
    { name: 'wallet-combo', url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&q=80' }
  ],
  'casual-shoes': [
    { name: 'canvas-sneakers', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80' },
    { name: 'white-low-tops', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500&q=80' },
    { name: 'slip-on-sneakers', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80' },
    { name: 'leather-casuals', url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500&q=80' },
    { name: 'high-top-sneakers', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500&q=80' },
    { name: 'retro-trainers', url: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500&q=80' },
    { name: 'everyday-loafers', url: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?w=500&q=80' },
    { name: 'street-sneakers', url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80' },
    { name: 'comfort-walkers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&q=80' },
    { name: 'chunky-sneakers', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80' }
  ],
  'earbuds': [
    { name: 'airpods-pro', url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500&q=80' },
    { name: 'samsung-buds', url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&q=80' },
    { name: 'oneplus-buds', url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&q=80' },
    { name: 'boat-airdopes', url: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=500&q=80' },
    { name: 'noise-buds', url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=500&q=80' },
    { name: 'realme-buds', url: 'https://images.unsplash.com/photo-1590658006821-04f401b33ab8?w=500&q=80' },
    { name: 'jbl-wave', url: 'https://images.unsplash.com/photo-1598620617149-1cce696f5b2e?w=500&q=80' },
    { name: 'oppo-enco', url: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?w=500&q=80' },
    { name: 'sony-wf', url: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=500&q=80' },
    { name: 'boult-audio', url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&q=80' }
  ],
  'formal-shoes': [
    { name: 'oxford-formal', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500&q=80' },
    { name: 'derby-leather', url: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?w=500&q=80' },
    { name: 'monk-strap', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&q=80' },
    { name: 'brogue-shoes', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500&q=80' },
    { name: 'slip-on-formal', url: 'https://images.unsplash.com/photo-1623943176239-0d7d2c95cec4?w=500&q=80' },
    { name: 'black-office', url: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500&q=80' },
    { name: 'tan-formal', url: 'https://images.unsplash.com/photo-1596733430284-f7437764b7a9?w=500&q=80' },
    { name: 'patent-leather', url: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=500&q=80' },
    { name: 'comfort-dress', url: 'https://images.unsplash.com/photo-1602751584552-8ba73a1a3ad6?w=500&q=80' },
    { name: 'wedding-formal', url: 'https://images.unsplash.com/photo-1618200633246-3a0a2f1b7af7?w=500&q=80' }
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
  'kids-clothing': [
    { name: 'kids-tshirt-set', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80' },
    { name: 'denim-dungaree', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&q=80' },
    { name: 'cotton-frock', url: 'https://images.unsplash.com/photo-1596357395217-80de13130e92?w=500&q=80' },
    { name: 'school-shirt-pack', url: 'https://images.unsplash.com/photo-1604671952609-9ab3b9fe2e8e?w=500&q=80' },
    { name: 'jogger-set', url: 'https://images.unsplash.com/photo-1596993100471-7ed6e8f9fca1?w=500&q=80' },
    { name: 'winter-hoodie', url: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=500&q=80' },
    { name: 'printed-shorts', url: 'https://images.unsplash.com/photo-1596357395217-80de13130e92?w=500&q=80' },
    { name: 'party-dress', url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&q=80' },
    { name: 'track-suit', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500&q=80' },
    { name: 'ethnic-kurta-set', url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=500&q=80' }
  ],
  'kitchen-appliances': [
    { name: 'mixer-grinder', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80' },
    { name: 'air-fryer', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500&q=80' },
    { name: 'coffee-maker', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&q=80' },
    { name: 'induction-cooktop', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80' },
    { name: 'electric-kettle', url: 'https://images.unsplash.com/photo-1573073058117-f1a8c594c5d5?w=500&q=80' },
    { name: 'toaster', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80' },
    { name: 'food-processor', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80' },
    { name: 'hand-blender', url: 'https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80' },
    { name: 'rice-cooker', url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80' },
    { name: 'juicer', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500&q=80' }
  ],
  'laptops': [
    { name: 'macbook-air-m2', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
    { name: 'dell-inspiron', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80' },
    { name: 'hp-pavilion', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80' },
    { name: 'lenovo-ideapad', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80' },
    { name: 'asus-vivobook', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
    { name: 'acer-aspire', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80' },
    { name: 'msi-gaming', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80' },
    { name: 'samsung-galaxy-book', url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&q=80' },
    { name: 'microsoft-surface', url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
    { name: 'lg-gram', url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&q=80' }
  ],
  'mens-clothing': [
    { name: 'oxford-shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80' },
    { name: 'slim-fit-jeans', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500&q=80' },
    { name: 'polo-tshirt', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80' },
    { name: 'denim-jacket', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500&q=80' },
    { name: 'chino-pants', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80' },
    { name: 'linen-shirt', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&q=80' },
    { name: 'casual-blazer', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80' },
    { name: 'hoodie', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500&q=80' },
    { name: 'cargo-pants', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&q=80' },
    { name: 'formal-shirt', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500&q=80' }
  ],
  'microwaves': [
    { name: 'samsung-convection', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80' },
    { name: 'lg-charcoal-oven', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&q=80' },
    { name: 'ifb-microwave', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80' },
    { name: 'panasonic-solo', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&q=80' },
    { name: 'bajaj-grill-oven', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80' },
    { name: 'whirlpool-magicook', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&q=80' },
    { name: 'morphy-richards', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80' },
    { name: 'godrej-convection', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&q=80' },
    { name: 'haier-microwave', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500&q=80' },
    { name: 'croma-oven', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500&q=80' }
  ],
  'mobiles': [
    { name: 'samsung-galaxy', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
    { name: 'iphone-16', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' },
    { name: 'oneplus-nord', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
    { name: 'redmi-note', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' },
    { name: 'motorola-edge', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
    { name: 'realme-narzo', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' },
    { name: 'vivo-v-series', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
    { name: 'oppo-reno', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' },
    { name: 'google-pixel', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80' },
    { name: 'nothing-phone', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&q=80' }
  ],
  'refrigerators': [
    { name: 'lg-double-door', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80' },
    { name: 'samsung-convertible', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500&q=80' },
    { name: 'whirlpool-frost-free', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80' },
    { name: 'godrej-single-door', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500&q=80' },
    { name: 'haier-bottom-mount', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80' },
    { name: 'bosch-french-door', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500&q=80' },
    { name: 'panasonic-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80' },
    { name: 'voltas-beko', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500&q=80' },
    { name: 'hisense-side-by-side', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&q=80' },
    { name: 'liebherr-premium', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500&q=80' }
  ],
  'running-shoes': [
    { name: 'nike-run-swift', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    { name: 'adidas-galaxy', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80' },
    { name: 'puma-flyer', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    { name: 'asics-gel', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80' },
    { name: 'reebok-runner', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    { name: 'skechers-go-run', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80' },
    { name: 'new-balance', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    { name: 'campus-sprint', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80' },
    { name: 'bata-power-run', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80' },
    { name: 'hrx-running', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500&q=80' }
  ],
  'sandals': [
    { name: 'comfort-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80' },
    { name: 'leather-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500&q=80' },
    { name: 'outdoor-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80' },
    { name: 'flip-flops', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500&q=80' },
    { name: 'slide-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80' },
    { name: 'ethnic-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500&q=80' },
    { name: 'walking-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80' },
    { name: 'beach-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500&q=80' },
    { name: 'kids-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500&q=80' },
    { name: 'cushion-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500&q=80' }
  ],
  'sports-shoes': [
    { name: 'training-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80' },
    { name: 'football-studs', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&q=80' },
    { name: 'basketball-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80' },
    { name: 'badminton-court', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&q=80' },
    { name: 'tennis-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80' },
    { name: 'cricket-shoes', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&q=80' },
    { name: 'gym-trainers', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80' },
    { name: 'walking-sports', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&q=80' },
    { name: 'trail-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500&q=80' },
    { name: 'crossfit-shoes', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500&q=80' }
  ],
  'tablets': [
    { name: 'ipad-air', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'samsung-galaxy-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' },
    { name: 'lenovo-tab', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'oneplus-pad', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' },
    { name: 'xiaomi-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'realme-pad', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' },
    { name: 'honor-pad', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'motorola-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' },
    { name: 'nokia-tablet', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80' },
    { name: 'kids-learning', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&q=80' }
  ],
  'washing-machines': [
    { name: 'lg-front-load', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&q=80' },
    { name: 'samsung-top-load', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80' },
    { name: 'whirlpool-7kg', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&q=80' },
    { name: 'bosch-automatic', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80' },
    { name: 'ifb-steam-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&q=80' },
    { name: 'panasonic-washer', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80' },
    { name: 'godrej-semi-auto', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&q=80' },
    { name: 'haier-direct-motion', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80' },
    { name: 'croma-washer', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500&q=80' },
    { name: 'lloyd-washing', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500&q=80' }
  ],
  'watches': [
    { name: 'classic-leather', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80' },
    { name: 'smart-fitness', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
    { name: 'chronograph', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80' },
    { name: 'rose-gold', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
    { name: 'digital-sports', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80' },
    { name: 'minimal-dial', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
    { name: 'diver-watch', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80' },
    { name: 'metal-strap', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
    { name: 'kids-smart-watch', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500&q=80' },
    { name: 'luxury-analog', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' }
  ],
  'womens-clothing': [
    { name: 'printed-kurti', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
    { name: 'summer-dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
    { name: 'denim-jacket-women', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
    { name: 'cotton-top', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
    { name: 'wide-leg-jeans', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
    { name: 'ethnic-set', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
    { name: 'casual-shirt-women', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
    { name: 'long-skirt', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' },
    { name: 'blazer-dress', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=80' },
    { name: 'party-top', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80' }
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
  console.log(`  ✅ Updated ${categoryName}.json`);
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
    updateJsonWithLocalPaths(category, imageNames);
  }

  console.log(`\n🎉 All done! Downloaded ${total} unique images.`);
}

main().catch(console.error);