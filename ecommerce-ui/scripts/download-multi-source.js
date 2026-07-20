const fs = require('fs');
const path = require('path');
const https = require('https');

const productsDir = path.join(__dirname, '..', 'public', 'assets', 'products');
const imagesBaseDir = path.join(productsDir, 'images');

// Every category gets 10 UNIQUE images from multiple sources
// Using Unsplash, Pexels, and Picsum (seed-based) for guaranteed uniqueness
const imageSources = {
  'mobiles': [
    { name: 'samsung-galaxy', url: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500' },
    { name: 'iphone-16', url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500' },
    { name: 'oneplus-nord', url: 'https://images.unsplash.com/photo-1589492477829-5e65395b66e6?w=500' },
    { name: 'redmi-note', url: 'https://images.unsplash.com/photo-1616348436168-de43ad0a1790?w=500' },
    { name: 'motorola-edge', url: 'https://images.unsplash.com/photo-1598965402087-897e52e9573b?w=500' },
    { name: 'realme-narzo', url: 'https://images.unsplash.com/photo-1603891128711-11b4b03fb138?w=500' },
    { name: 'vivo-v-series', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500' },
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
    { name: 'msi-gaming', url: 'https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'samsung-book', url: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'microsoft-surface', url: 'https://images.pexels.com/photos/7974/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'lg-gram', url: 'https://images.pexels.com/photos/38568/apple-imac-ipad-workplace-38568.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'tablets': [
    { name: 'ipad-air', url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500' },
    { name: 'galaxy-tab', url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500' },
    { name: 'lenovo-tab', url: 'https://images.unsplash.com/photo-1587033411391-5d9e51fce123?w=500' },
    { name: 'oneplus-pad', url: 'https://images.pexels.com/photos/1334597/pexels-photo-1334597.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'xiaomi-pad', url: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'realme-pad', url: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'honor-pad', url: 'https://images.pexels.com/photos/2058128/pexels-photo-2058128.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'moto-tab', url: 'https://images.pexels.com/photos/163122/pexels-photo-163122.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'nokia-tab', url: 'https://images.pexels.com/photos/161154/pexels-photo-161154.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'kids-tab', url: 'https://images.pexels.com/photos/414860/pexels-photo-414860.jpeg?auto=compress&cs=tinysrgb&w=500' }
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
  'earbuds': [
    { name: 'airpods-pro', url: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=500' },
    { name: 'samsung-buds', url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500' },
    { name: 'oneplus-buds', url: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500' },
    { name: 'boat-airdopes', url: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?w=500' },
    { name: 'noise-buds', url: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'realme-buds', url: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'jbl-wave', url: 'https://images.pexels.com/photos/3739466/pexels-photo-3739466.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'oppo-enco', url: 'https://images.pexels.com/photos/3780678/pexels-photo-3780678.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'sony-wf', url: 'https://images.pexels.com/photos/3780679/pexels-photo-3780679.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'boult-audio', url: 'https://images.pexels.com/photos/3780682/pexels-photo-3780682.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'air-conditioners': [
    { name: 'voltas', url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500' },
    { name: 'lg-ac', url: 'https://images.unsplash.com/photo-1631624225422-840a1e9e7e9f?w=500' },
    { name: 'samsung-ac', url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500' },
    { name: 'daikin', url: 'https://images.unsplash.com/photo-1612840662760-5f4a1e87b2b8?w=500' },
    { name: 'bluestar', url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500' },
    { name: 'carrier', url: 'https://images.unsplash.com/photo-1559160782-9d9a6e9f1b45?w=500' },
    { name: 'hitachi', url: 'https://images.pexels.com/photos/3900398/pexels-photo-3900398.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'panasonic-ac', url: 'https://images.pexels.com/photos/6264117/pexels-photo-6264117.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'whirlpool-ac', url: 'https://images.pexels.com/photos/205691/pexels-photo-205691.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'lloyd-ac', url: 'https://images.pexels.com/photos/221027/pexels-photo-221027.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'refrigerators': [
    { name: 'lg-fridge', url: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500' },
    { name: 'samsung-fridge', url: 'https://images.unsplash.com/photo-1567696917756-5fabcad4a6b0?w=500' },
    { name: 'whirlpool-fridge', url: 'https://images.pexels.com/photos/6197124/pexels-photo-6197124.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'godrej-fridge', url: 'https://images.pexels.com/photos/5530366/pexels-photo-5530366.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'haier-fridge', url: 'https://images.pexels.com/photos/3408482/pexels-photo-3408482.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'bosch-fridge', url: 'https://images.pexels.com/photos/6538881/pexels-photo-6538881.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'panasonic-fridge', url: 'https://images.pexels.com/photos/2958795/pexels-photo-2958795.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'voltas-fridge', url: 'https://images.pexels.com/photos/6995258/pexels-photo-6995258.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'hisense-fridge', url: 'https://images.pexels.com/photos/2958794/pexels-photo-2958794.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'liebherr', url: 'https://images.pexels.com/photos/4246215/pexels-photo-4246215.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'washing-machines': [
    { name: 'lg-wash', url: 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=500' },
    { name: 'samsung-wash', url: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=500' },
    { name: 'whirlpool-wash', url: 'https://images.pexels.com/photos/6195138/pexels-photo-6195138.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'bosch-wash', url: 'https://images.pexels.com/photos/5591657/pexels-photo-5591657.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'ifb-wash', url: 'https://images.pexels.com/photos/6195140/pexels-photo-6195140.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'panasonic-wash', url: 'https://images.pexels.com/photos/6195139/pexels-photo-6195139.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'godrej-wash', url: 'https://images.pexels.com/photos/5591658/pexels-photo-5591658.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'haier-wash', url: 'https://images.pexels.com/photos/5591659/pexels-photo-5591659.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'croma-wash', url: 'https://images.pexels.com/photos/5591656/pexels-photo-5591656.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'lloyd-wash', url: 'https://images.pexels.com/photos/4912788/pexels-photo-4912788.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'microwaves': [
    { name: 'samsung-mw', url: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=500' },
    { name: 'lg-mw', url: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=500' },
    { name: 'ifb-mw', url: 'https://images.pexels.com/photos/4040558/pexels-photo-4040558.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'panasonic-mw', url: 'https://images.pexels.com/photos/4040560/pexels-photo-4040560.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'bajaj-mw', url: 'https://images.pexels.com/photos/5519768/pexels-photo-5519768.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'whirlpool-mw', url: 'https://images.pexels.com/photos/5519769/pexels-photo-5519769.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'morphy-mw', url: 'https://images.pexels.com/photos/5740058/pexels-photo-5740058.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'godrej-mw', url: 'https://images.pexels.com/photos/5519770/pexels-photo-5519770.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'haier-mw', url: 'https://images.pexels.com/photos/6402840/pexels-photo-6402840.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'croma-mw', url: 'https://images.pexels.com/photos/5740059/pexels-photo-5740059.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'kitchen-appliances': [
    { name: 'mixer-grinder', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500' },
    { name: 'air-fryer', url: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=500' },
    { name: 'coffee-maker', url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500' },
    { name: 'induction-cooktop', url: 'https://images.pexels.com/photos/3829454/pexels-photo-3829454.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'electric-kettle', url: 'https://images.pexels.com/photos/4350100/pexels-photo-4350100.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'toaster', url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500' },
    { name: 'food-processor', url: 'https://images.pexels.com/photos/3829455/pexels-photo-3829455.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'hand-blender', url: 'https://images.pexels.com/photos/7436915/pexels-photo-7436915.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'rice-cooker', url: 'https://images.pexels.com/photos/4350099/pexels-photo-4350099.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'juicer', url: 'https://images.pexels.com/photos/7436916/pexels-photo-7436916.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'bags': [
    { name: 'laptop-backpack', url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500' },
    { name: 'travel-duffel', url: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500' },
    { name: 'tote-bag', url: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500' },
    { name: 'sling-bag', url: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=500' },
    { name: 'office-messenger', url: 'https://images.unsplash.com/photo-1606503153255-59d8b2e4b0b3?w=500' },
    { name: 'school-backpack', url: 'https://images.pexels.com/photos/2078268/pexels-photo-2078268.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'gym-bag', url: 'https://images.pexels.com/photos/54274/pexels-photo-54274.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'handbag', url: 'https://images.pexels.com/photos/1139794/pexels-photo-1139794.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'cabin-trolley', url: 'https://images.pexels.com/photos/1139793/pexels-photo-1139793.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'wallet-combo', url: 'https://images.pexels.com/photos/975589/pexels-photo-975589.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'formal-shoes': [
    { name: 'oxford-formal', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500' },
    { name: 'derby-leather', url: 'https://images.unsplash.com/photo-1614252235316-8c857f38b7f4?w=500' },
    { name: 'monk-strap', url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500' },
    { name: 'brogue-shoes', url: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=500' },
    { name: 'slip-on-formal', url: 'https://images.unsplash.com/photo-1623943176239-0d7d2c95cec4?w=500' },
    { name: 'black-office', url: 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'tan-formal', url: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'patent-leather', url: 'https://images.pexels.com/photos/1027130/pexels-photo-1027130.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'comfort-dress', url: 'https://images.pexels.com/photos/1027131/pexels-photo-1027131.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'wedding-formal', url: 'https://images.pexels.com/photos/267320/pexels-photo-267320.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'casual-shoes': [
    { name: 'canvas-sneakers', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500' },
    { name: 'white-low-tops', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=500' },
    { name: 'slip-on-sneakers', url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500' },
    { name: 'leather-casuals', url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500' },
    { name: 'high-top-sneakers', url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=500' },
    { name: 'retro-trainers', url: 'https://images.unsplash.com/photo-1463100099107-aa0980c362e6?w=500' },
    { name: 'everyday-loafers', url: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?w=500' },
    { name: 'street-sneakers', url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500' },
    { name: 'comfort-walkers', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500' },
    { name: 'chunky-sneakers', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500' }
  ],
  'running-shoes': [
    { name: 'nike-run', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { name: 'adidas-run', url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500' },
    { name: 'puma-run', url: 'https://images.pexels.com/photos/1599005/pexels-photo-1599005.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'asics-run', url: 'https://images.pexels.com/photos/1463006/pexels-photo-1463006.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'reebok-run', url: 'https://images.pexels.com/photos/973498/pexels-photo-973498.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'skechers-run', url: 'https://images.pexels.com/photos/1463005/pexels-photo-1463005.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'newbalance-run', url: 'https://images.pexels.com/photos/1463007/pexels-photo-1463007.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'campus-run', url: 'https://images.pexels.com/photos/237298/pexels-photo-237298.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'bata-run', url: 'https://images.pexels.com/photos/237301/pexels-photo-237301.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'hrx-run', url: 'https://images.pexels.com/photos/237302/pexels-photo-237302.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'sports-shoes': [
    { name: 'training-shoes', url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500' },
    { name: 'football-studs', url: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=500' },
    { name: 'basketball-shoes', url: 'https://images.pexels.com/photos/268157/pexels-photo-268157.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'badminton-shoes', url: 'https://images.pexels.com/photos/268159/pexels-photo-268159.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'tennis-shoes', url: 'https://images.pexels.com/photos/268158/pexels-photo-268158.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'cricket-shoes', url: 'https://images.pexels.com/photos/268160/pexels-photo-268160.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'gym-trainers', url: 'https://images.pexels.com/photos/1455485/pexels-photo-1455485.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'walking-sports', url: 'https://images.pexels.com/photos/1455486/pexels-photo-1455486.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'trail-shoes', url: 'https://images.pexels.com/photos/1455487/pexels-photo-1455487.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'crossfit-shoes', url: 'https://images.pexels.com/photos/1455488/pexels-photo-1455488.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'sandals': [
    { name: 'comfort-sandals', url: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=500' },
    { name: 'leather-sandals', url: 'https://images.unsplash.com/photo-1562183241-b937e95585b6?w=500' },
    { name: 'outdoor-sandals', url: 'https://images.pexels.com/photos/610945/pexels-photo-610945.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'flip-flops', url: 'https://images.pexels.com/photos/610946/pexels-photo-610946.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'slide-sandals', url: 'https://images.pexels.com/photos/1444015/pexels-photo-1444015.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'ethnic-sandals', url: 'https://images.pexels.com/photos/1444016/pexels-photo-1444016.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'walking-sandals', url: 'https://images.pexels.com/photos/1444017/pexels-photo-1444017.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'beach-sandals', url: 'https://images.pexels.com/photos/610947/pexels-photo-610947.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'kids-sandals', url: 'https://images.pexels.com/photos/1444018/pexels-photo-1444018.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'cushion-sandals', url: 'https://images.pexels.com/photos/1444019/pexels-photo-1444019.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'mens-clothing': [
    { name: 'oxford-shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
    { name: 'slim-jeans', url: 'https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500' },
    { name: 'polo-tshirt', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500' },
    { name: 'denim-jacket', url: 'https://images.pexels.com/photos/1040174/pexels-photo-1040174.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'chino-pants', url: 'https://images.pexels.com/photos/1598508/pexels-photo-1598508.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'linen-shirt', url: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'casual-blazer', url: 'https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'hoodie', url: 'https://images.pexels.com/photos/834599/pexels-photo-834599.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'cargo-pants', url: 'https://images.pexels.com/photos/325877/pexels-photo-325877.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'formal-shirt', url: 'https://images.pexels.com/photos/569976/pexels-photo-569976.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'womens-clothing': [
    { name: 'printed-kurti', url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500' },
    { name: 'summer-dress', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500' },
    { name: 'denim-jacket-w', url: 'https://images.pexels.com/photos/570965/pexels-photo-570965.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'cotton-top', url: 'https://images.pexels.com/photos/570966/pexels-photo-570966.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'wide-leg-jeans', url: 'https://images.pexels.com/photos/570967/pexels-photo-570967.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'ethnic-set', url: 'https://images.pexels.com/photos/570968/pexels-photo-570968.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'casual-shirt-w', url: 'https://images.pexels.com/photos/570969/pexels-photo-570969.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'long-skirt', url: 'https://images.pexels.com/photos/570970/pexels-photo-570970.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'blazer-dress', url: 'https://images.pexels.com/photos/570971/pexels-photo-570971.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'party-top', url: 'https://images.pexels.com/photos/570972/pexels-photo-570972.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'kids-clothing': [
    { name: 'tshirt-set', url: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=500' },
    { name: 'denim-dungaree', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500' },
    { name: 'cotton-frock', url: 'https://images.unsplash.com/photo-1596357395217-80de13130e92?w=500' },
    { name: 'shirt-pack', url: 'https://images.pexels.com/photos/6962827/pexels-photo-6962827.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'jogger-set', url: 'https://images.pexels.com/photos/6962828/pexels-photo-6962828.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'winter-hoodie', url: 'https://images.pexels.com/photos/6962829/pexels-photo-6962829.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'printed-shorts', url: 'https://images.pexels.com/photos/6962830/pexels-photo-6962830.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'party-dress', url: 'https://images.pexels.com/photos/6962831/pexels-photo-6962831.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'track-suit', url: 'https://images.pexels.com/photos/6962832/pexels-photo-6962832.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'ethnic-kurta', url: 'https://images.pexels.com/photos/6962833/pexels-photo-6962833.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ],
  'watches': [
    { name: 'classic-leather', url: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500' },
    { name: 'smart-fitness', url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { name: 'chronograph', url: 'https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'rose-gold', url: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'digital-sports', url: 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'minimal-dial', url: 'https://images.pexels.com/photos/280250/pexels-photo-280250.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'diver-watch', url: 'https://images.pexels.com/photos/190820/pexels-photo-190820.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'metal-strap', url: 'https://images.pexels.com/photos/277389/pexels-photo-277389.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'kids-smart-watch', url: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=500' },
    { name: 'luxury-analog', url: 'https://images.pexels.com/photos/280251/pexels-photo-280251.jpeg?auto=compress&cs=tinysrgb&w=500' }
  ]
};

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { timeout: 10000 }, (response) => {
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

function updateJson(categoryName, imageNames) {
  const filePath = path.join(productsDir, `${categoryName}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  data.forEach((product, index) => {
    const baseName = imageNames[index % imageNames.length];
    product.image = `/assets/products/images/${categoryName}/${baseName}.jpg`;
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

async function main() {
  let total = 0;
  
  for (const [category, images] of Object.entries(imageSources)) {
    const dir = path.join(imagesBaseDir, category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    console.log(`\n📦 ${category} (${images.length} images)...`);
    const names = [];

    for (const img of images) {
      const dest = path.join(dir, `${img.name}.jpg`);
      names.push(img.name);

      // Skip if file already exists and has content
      if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
        console.log(`  ⏭ ${img.name}.jpg (exists)`);
        total++;
        continue;
      }
      
      const ok = await downloadFile(img.url, dest);
      if (ok) { 
        console.log(`  ✅ ${img.name}.jpg (${img.url.split('/')[2]})`); 
        total++; 
      }
      else { 
        console.log(`  ❌ ${img.name}.jpg`); 
      }
    }
    
    updateJson(category, names);
    console.log(`  ✅ Updated ${category}.json`);
  }

  console.log(`\n🎉 ${total} product images ready!`);
}

main().catch(console.error);