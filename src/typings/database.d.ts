interface IQueryParameter {
  queryConditions?: IQueryCondition[];
  pageParameter?: IPageParameter;
}

interface IQueryCondition {
  field?: string;
  compare?: string;
  value?: any;
  andOr?: string;
}

interface IPageParameter {
  pageIndex?: number;
  pageSize?: number;
  sortField?: string;
  sortByAsc?: true;
}

interface IHostWorker {
  workerId?: number;
  ip: string;
  status?: string;
  apiKey?: string;
  alias?: string;
  info?: string;
  checked?: boolean;
}
interface ILink {
  linkId?: number;
  link?: string;
  lastmod?: Date;
  creatAt?: Date;
  priority?: number;
  status?: 'unassigned' | 'queue' | 'pull' | 'parse' | 'end';
  disabled?: boolean;
  checked?: boolean;
  workerId?: number;

}

// 交易区
interface ITxnArea {
  txnId?: number;
  mktId?: number;
  txnCode?: string
  txnName?: string;
}


interface ISubject {
  subId?: number//收支项目id	int	10		修改删除
  subName?: string//收支项目名称---需判断名称是否重复	varchar	40		修改删除
  parentId?: number//父id	int	10		修改删除
  subCode?: string//科目编码---需判断名称是否重复	int	11		修改删除
  subLinkId?: number//此自定义科目对应于全局科目的id	int	20		修改删除
  marketId?: number;
  level?: number;
  value?: false;
  children?: ISubject[];
  checked?: boolean
}



interface ICategory {
  /** 分类id */
  cateId?: number;
  cateCode?: string;
  /** 分类名称 */
  cateName?: string;
  /** 数据库名称 */
  parentId?: number;
  /** 是否显示 */
  isShow?: boolean;
  orderNo?: number;
  mktId?: number;
  linkCateCode?: string;

  txnId?: number;

}
/**front end datastruct  */
interface ICategory {
  level?: number;
  children?: ICategory[];
  cateId?: number
}
interface IFieldConfig {
  /**日期格式化 */
  dateFormat?: string;
  maxsize?: number;
}
interface IMetadataField {
  objectCode?: string;//表或试图代码

  isQuery?: boolean;//	是否可查询
  isShow?: boolean;//是否可显示	
  isUpdate?: boolean;//是否可更新
  placeholder?: string;//输入提示
  config?: IFieldConfig | string | any;//拓展配置
  fieldType: string;//数据类型
  fieldName: string;//字段名
  recno?: number;//显示序号
  alias?: string;//字段别名
  presetValue?: string;//预设值
  displayWidth?: number;//显示宽度

  // 额外添加的queryConditon, 在数据库不存在
  queryCondition?: '>' | '>=' | '<=' | '=' | 'like' | 'not like';
  /**选择日期的方式 */
  datePick?: "single" | 'between';
}


interface IMetaObject {
  /** */

  /**
   * 	主键	int	11		修改删除
   */
  metaId?: number;
  /**
   *  元数据编码	varchar	100		修改删除
   */
  objectCode?: string;
  /**
   * 元数据名称	varchar	50		修改删除
   */
  objectName: string;
  /**	要更新的表	varchar	50	null	修改删除 */
  tableName?: string;

  /** 是否单选	tinyint	1	1	修改删除 */
  isSingle?: boolean;
  /**是否可行内编辑	tinyint	1	0	修改删除 */
  isCelledit: boolean;
  /**是否显示行号	tinyint	1	1	修改删除*/
  isShowNum: boolean;
  /**	是否初始加载数据	tinyint	1	1	修改删除*/
  isFirstLoad?: boolean;
  /** 初始加载过滤条件	varchar	500		修改删除
 */
  filter?: string;
  /**视图查询Sql	varchar	1000		修改删除 */
  querySql?: string;
  /**默认排序字段desc	varchar	200		修改删除 */
  defaultOrder: string;
  /**自定义拦截器	varchar	255		修改删除 */
  bizIntercept?: string;
  /**	拓展配置	varchar	800		修改删除 */
  config: any;
  /**查询分类	varchar	30		修改 */
  groupName: string;

  pkKey: string;
  parentKey?: string;
  checked?: boolean;
}

/**
 * type=1 全局参数
 * type=2 本地参数
 */
interface IParam {
  id?: number;
  paramName?: string;
  paramKey?: string;
  paramValue?: string;
  type?: number;
  mktId?: number;
  remark?: string;
  addition?: string;
  defaultValue?: string;
  /**是否本地参数 */
  isLocal?: boolean;

}
interface IOrg {
  /** 组织Id */
  orgId?: number;
  /** 组织名称 */
  orgName?: string;
  /** 上级组织Id,默认0顶级组织 */
  parentId?: number;    /** 公司Id */
  mktId?: number;
  parentName?: string;
}
interface IUser {
  id?: number;
  name?: string;
  userName?: string;
  password?: string;
  passwordHash?: string;
  createTime?: Date;
  updateTime?: Date;
  menuIds?: string;
  userType?: number;
  mktId?: number;
  orgId?: number;
  roleIds?: string | number[];
  status?: number;
  creatorId?: number;
  craetorName?: string;
  checked?: boolean

}

interface IMarket {
  mktId?: number;
  mktName?: string;
  telephone?: string;
  province?: string;
  city?: string;
  area?: string;
  lat?: number;
  lng?: number;
  status?: 1;
  licenseUrl?: string;
  legalPeson?: string;
  legalPhone?: string;
  gcId?: number;
  menuIds?: number[] | string;


}


interface IDevelop {
  devId?: number;
  devUserName?: string;
  password?: string;
  passwordHash?: string;
  createTime?: Date;
  updateTime?: Date;
  checked?: boolean;
}
interface IRole {
  roleId?: number;
  roleName?: string;
  roleType?: number;
  mktId?: number;
  createTime?: Date;
  updateTime?: Date;
  menuIds?: string | number[];
  parentId?: number;

  menus?: IMenu[];
  checked?: boolean;
  roleCode?: string;

}

interface IMenu {
  /**是否动态页面*/
  static?: boolean;
  label?: string;
  /**
   * 	文本	varchar	20		修改删除
   */
  text?: string;
  /**
   * i18n主键	varchar	10		修改删除
   */
  i18n?: string;
  /**
   * 上级菜单id	int	11		修改删除
   */
  parentId?: number;
  /**angular 路由	varchar	64		修改删除
   * 
   */
  link?: string;
  /**
   * 外部链接	varchar	64		修改删除
   */
  externalink?: string
  /**
   * 打开链接的方式	varchar	10		修改删除
   */
  target?: "_blank" | "_self" | "_parent" | "_top";
  /**
   * 	图标	varchar	20		修改删除
   */
  icon?: string;
  /**
   * 徽章	int	11		修改删除
   */
  badge?: number;
  /**
   * 是否启用徽章	tinyint	1		修改删除
   */
  badgeDot?: boolean;
  /**
   * 徽章的颜色	varchar	20		修改删除
   * 
   */
  badgeStatus?: string;
  /**是否隐藏菜单	tinyint	1		修改删除 */
  hide?: boolean;
  hideInBreadcrumb?: boolean;//	隐藏面包屑，指 `page-header` 组件的自动生成面包屑时有效	tinyint	1		修改删除
  // acl	ACL配置，若导入 `@delon/acl` 时自动有效，等同于 `ACLService.can(roleOrAbility: ACLCanType)` 参数值	varchar	10		修改删除
  shortcut?: boolean;
  shortcutRoot?: boolean;
  reuse?: boolean;
  menuId?: number;
  menuType?: number;
  creatorId?: number;
  menuCode?: string;
  config?: string | ViewConfig;
  checked?: boolean;
  children?: IMenu[];
}

interface IGroup {
  indeterminate?: boolean;
  menuId?: number;
  link?: string;
  text?: string;
  children?: IMenu[];
  checked?: boolean;
  checkdAll?: boolean;
  icon?: string;
  allChecked?: boolean;
}

interface IGroupCompany {
  gcId?: number;
  gcName?: string;
  gcMenuIds?: number[] | string;
  createTime?: Date;
}


interface IDb {

  /** 数据库Id */
  dbId?: number;

  /** 开发者Id */
  devId?: number;

  /** 数据库名称 */
  name?: string

  /** 注释 */
  comment?: string

}
interface Template {

  /** 模板Id */
  templateId?: number;

  /** 模板名称 */
  name?: string

  /** 模板描述 */
  comment?: string;
  template: string;

  /** 开发者Id */
  devId?: number;

}

interface IMember {
  /**会员id */
  id?: number;

  name?: string;

  /**手机号 */
  mobi?: string;
  isCompany?: boolean;
  legalName?: string;
  coLicImgUrl?: string;
  taxNo?: string;
  /**地址 */
  address?: string;

  phoneNo?: string;
  /**身份证 */
  idCardNo?: string;
  /**身份证照片地址 */
  idcardImageUrl?: string;

  payPassword?: string;

  pwdEncrypted?: boolean;

  createTime?: Date;

  status?: string;

  creatorId?: number;

  creator?: string;

  customerId?: number;

  mktId?: number;

  customers?: ICustomer[];
}

interface ICustomer {
  customerId?: number;
  name?: string;
  mobi?: string;
  password?: string;
  passwordHash?: string;
  avatar?: string;
  createdAt?: Date;
  status?: string;
  signupMethod?: string;
  memberId?: number;
  mktId?: number;
  card?: ICard;
  cardId?: number;
}

interface ICard {
  cardId?: number;
  cardNo?: string;
  cardType?: string;
  status?: string;
  mktId?: number;
  createdAt?: Date;
}

interface IRechargeWithDraw {
  id?: number;
  orderNo?: string;
  businessType?: string;
  operaType?: string;
  cardNo?: string;
  openingAmout?: number;
  transAmout?: number;
  balance?: number;
  tranDate?: Date;
  epId?: number;
  memberId?: number;
  payPassword?: string;
}



