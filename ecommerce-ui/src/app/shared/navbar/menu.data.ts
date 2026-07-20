import { categoryConfigs } from '../../categories/categories-products/category-config';
import { Menu } from './menu.model';

export const MENUS: Menu[] = [

  {
    name: 'Home',
    route: '/home',
    subMenus: []
  },

  ...Object.entries(categoryConfigs).map(([categoryKey, category]) => ({

    name: category.title,

    route: `/category/${categoryKey}`,

    subMenus: category.types.map(type => ({
      key: type.key,
      label: type.label
    }))

  }))

];