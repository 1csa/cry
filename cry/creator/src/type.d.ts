type ChoicesItemTypes = 'name' | 'value';
export type ChoicesTypes = Record<ChoicesItemTypes, string>;

interface SubMenuType {
  key: string;
  icon: string;
  name: string;
}

export interface MenuType extends SubMenuType {
  subMenu?: SubMenuType[];
}
