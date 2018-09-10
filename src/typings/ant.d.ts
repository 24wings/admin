interface CascaderOption {
  label: string;
  value: string;
  parentId?: number;
  isLeaf?: boolean;
  children?: CascaderOption[];
}
