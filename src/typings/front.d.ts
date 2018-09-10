// interface 

interface FieldQueryOption {
  field: string;
  value: any;
  compare: string;
  joinStr?: string;
}
interface ActionButton {
  text: string;
  action?: string;
  objectCode: string;
  firstLoad: true;
  searchbar: false;
}
interface SingleConfig {
  objectCode: string;
  orderStr?: string;
  initQuery?: FieldQueryOption[];
  jionStr?: "and" | "or"
  isDel: boolean;
  isUpdate: boolean;
}

interface RelationConfig {
  objectCode: string,
  searchbar?: boolean,
  buttons?: ActionButton[]

}

interface ViewConfig {
  /**页面名字 */
  pageName?: string;
  /** 
   * 视图类型
   * 1.单查询
   * 2.父子关系查询
   * 3.树形结构
   */
  viewType: "single" | "relation" | "tree";
  /**父视图 */
  singleConfig?: SingleConfig;
  relationConfig?: RelationConfig;
  treeConfig?: {};

}

interface IMetaGroups {
  groupName?: string;
  metaObjects?: IMetaObject[]
}


interface IQueryMember {
  startdate?: string;
  enddate?: string;
  status?: string;
  memberName?: string;
  mktId: number;
  page: number;
  pageSize: number;
}
interface Date {
  /**
   *
   * 日期格式化为字符串
   *
   * y 年
   *
   * M 月
   *
   * D 日
   *
   * H 时
   *
   * m 分
   *
   * 秒 s
   * */
  format: (reg: string) => string;
}
