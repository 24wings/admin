import { UserStatusEnum, MarketStatusEnum, ParamsTypeEnum, ParamsIsLocalEnum, UserLogTypeEnum } from "../enum";


/**
 * 默认市场的全局参数
 */
export class DefaultMarketGolbalParam {
    paramId: number;
    key: string;
    defaultValue: string;
    /**注释*/
    comment: string;
}

/**
 * queryTemplate
 * 元数据
 */
export class MetaField {
    id?: number;
    objectCode?: string;
    isQuery?: boolean;
    isShow?: boolean;
    isUpdate?: boolean;
    placeholder?: string;
    config?: string;
    fieldType?: string;
    fieldName?: string;
    recno?: number;
    alias?: string;
    presetValue?: string;
    displayWidth?: number;
    metaObject?: MetaObject
}
export class MetaObject {
    metaId?: number;
    objectCode?: string;
    objectName?: string;
    tableName?: string;
    isSingle?: string;
    isCelledit?: boolean;
    isShowNum?: boolean;
    isFirstLoad?: boolean;
    filter?: string;
    querySql?: string;
    defaultOrder?: string;
    bizIntercept?: string;
    config?: string;
    groupName?: string;
    pkKey?: string;
    parentKey?: string;
    metaFields?: MetaField[];
}
/**
 * rbac
 *  
 * 开发者
 */

export class Developer {
    devId?: number;
    devUserName?: string;
    passwordHash?: string;
    createTime?: Date;
    updateTime?: Date;

}
/**
 * Market市场
 */
export class Market {
    mktId?: number;
    mktName?: string;
    telephone?: string;
    province?: string;
    city?: string;
    area?: string;
    lat?: number;
    lng?: number;
    status?: MarketStatusEnum;
    licenseUrl?: string;
    legalPeson?: string;
    legalPhone?: string;
    menuIds?: string;
    createBy?: number;
    auditorBy?: number;
    auditorTime?: Date;
    auditorStatus?: number;
    auditorDesc?: string;
}

/**
 * Menu 菜单
 */
export class Menu {
    menuId?: number;


    text?: string;

    i18n?: string;

    parentId?: number;

    link?: string;

    externalink?: string;

    target?: string;

    icon?: string;

    badge?: number;

    badge_dot?: boolean;

    badge_status?: string;

    hide?: boolean;

    hideInBreadcrumb?: boolean;
    acl?: string;

    shortcut?: number;

    shortcut_root?: number;

    reuse?: number;

    menuType?: number;

    creatorId?: number;

    config?: string;

    menuCode?: string;
    roles?: Role[];
}
/**
 * 组织
 * 
 */
export class Org {
    orgId?: number;

    orgName?: string;
    parentId?: number;

    marketId?: number;
    createBy?: number;

    createName?: string;
    createTime?: Date; users?: User[];

}
export class Role {
    roleId?: number;

    roleName?: string;

    roleCode?: string;

    createTime?: Date;

    updateTime?: Date;
    createBy?: number;

    createName?: string;

    remark?: string;

    menuIds?: string | number[];

    marketId?: number;
    userIds?: string;
    users?: User[];
    menus?: Menu[]
}
/**
 * 员工表
 */
export class User {
    id?: number;
    name?: string;
    userName?: string;
    password?: string;
    pwdEncrypted?: boolean;
    createTime?: Date;
    updateTime?: Date;
    status?: MarketStatusEnum;
    orgId?: number;
    creatorName?: string;
    marketId?: number;
    creatorId?: number;
    roleIds?: string;
    roles?: Role[];
    org?: Org;
}
export class Params {
    id?: number;

    paramName?: string;
    paramKey?: string;

    paramValue?: string;
    type?: ParamsTypeEnum;

    mktId?: number;

    addition?: string;

    defaultValue?: string;

    isLocal?: ParamsIsLocalEnum;
    /**参数备注 */
    remark?: string;
}
export class UserLog {
    id?: number;

    level?: number;//日志等级

    logType?: UserLogTypeEnum;//日志类型

    title?: string;//日志摘要

    content?: string;//日志内容
    entity?: string;//操作实体名称
    entityJson?: string;//操作实体内容

    createTime?: Date;//创建时间

    creatorId?: number;

    creator?: string;//操作员姓名
    mktId?: number;//市场id,为空时是平台级日志

}
export class UserNotify {
    id?: number;
    mktId?: number;//市场id,为空时是平台级消息
    userId?: string;//发送给用户Id,为空时不限制用户
    roleId?: string;//发送给角色Id,,为空时不限制角色

    notifyType?: string;//消息类型

    level?: number;//消息级别

    title?: string;//消息摘要

    content?: string;//消息内容
    addition?: string;//附加内容

    createTime?: Date;//创建时间

    creatorId?: number;//创建人Id

    creator?: string;
}
