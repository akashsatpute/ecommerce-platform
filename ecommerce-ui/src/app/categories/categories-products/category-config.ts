import { CategoryConfig } from './product-section.model';

export const categoryConfigs: Record<string, CategoryConfig> = {
  'mobiles-laptops': {
    title: 'Mobiles & Laptops',
    types: [
      { key: 'mobiles', label: 'Mobiles', file: '/assets/products/mobiles.json' },
      { key: 'laptops', label: 'Laptops', file: '/assets/products/laptops.json' },
      { key: 'tablets', label: 'Tablets', file: '/assets/products/tablets.json' },
      { key: 'headphones', label: 'Headphones', file: '/assets/products/headphones.json' },
      { key: 'earbuds', label: 'Earbuds', file: '/assets/products/earbuds.json' }
    ]
  },
  fashion: {
    title: 'Fashion',
    types: [
      { key: 'mens-clothing', label: 'Men', file: '/assets/products/mens-clothing.json' },
      { key: 'womens-clothing', label: 'Women', file: '/assets/products/womens-clothing.json' },
      { key: 'kids-clothing', label: 'Kids', file: '/assets/products/kids-clothing.json' },
      { key: 'watches', label: 'Watches', file: '/assets/products/watches.json' },
      { key: 'bags', label: 'Bags', file: '/assets/products/bags.json' }
    ]
  },
  appliances: {
    title: 'Appliances',
    types: [
      { key: 'air-conditioners', label: 'Air Conditioners', file: '/assets/products/air-conditioners.json' },
      { key: 'refrigerators', label: 'Refrigerators', file: '/assets/products/refrigerators.json' },
      { key: 'washing-machines', label: 'Washing Machines', file: '/assets/products/washing-machines.json' },
      { key: 'microwaves', label: 'Microwaves', file: '/assets/products/microwaves.json' },
      { key: 'kitchen-appliances', label: 'Kitchen Appliances', file: '/assets/products/kitchen-appliances.json' }
    ]
  },
  shoes: {
    title: 'Shoes',
    types: [
      { key: 'running-shoes', label: 'Running Shoes', file: '/assets/products/running-shoes.json' },
      { key: 'casual-shoes', label: 'Casual Shoes', file: '/assets/products/casual-shoes.json' },
      { key: 'formal-shoes', label: 'Formal Shoes', file: '/assets/products/formal-shoes.json' },
      { key: 'sports-shoes', label: 'Sports Shoes', file: '/assets/products/sports-shoes.json' },
      { key: 'sandals', label: 'Sandals', file: '/assets/products/sandals.json' }
    ]
  }
};
