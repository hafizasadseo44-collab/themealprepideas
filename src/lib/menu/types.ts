export type MenuItem = {
  id: string;
  groupId: string;
  label: string;
  href: string;
  icon: string;
  sortOrder: number;
};

export type MenuGroup = {
  id: string;
  title: string;
  icon: string;
  sortOrder: number;
  items: MenuItem[];
};
