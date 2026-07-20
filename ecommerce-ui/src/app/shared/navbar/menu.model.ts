export interface SubMenu {
  key: string;
  label: string;
}

export interface Menu {
  name: string;
  route: string;
  subMenus: SubMenu[];
}