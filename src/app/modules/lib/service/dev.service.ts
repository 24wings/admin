import { Injectable } from '@angular/core';
import { MyHttpService } from './http.service';
import { StorageService } from './storage.service';
import { MenuType, RoleType } from '../../../constant';
import { ExcelService } from './excel.service';
import { QueryObject, PageParameter, QueryParameter } from 'share_platform/framework/util';
import { CommonService } from './common.service';
import { Menu } from '../../../../share_platform/framework/entity';
import { MetaObjectDataRq } from '../../../share_platform/market/MetaObjectDataRq';



@Injectable()
export class DevService {
    private api = {



        menuDetailByMenuCode: '/api/menu/getByMenuCode',
        metaObjectDataUpdate: '/api/metaObject/data/update',
        metaObjectDelete: '/api/metaObject/delete',
        metaObjectDataPage: '/api/metaObject/data/page',
        metaObjectList: '/api/metaObject/list',
        metaObjectDetail: '/api/metaObject/detail',
        metaObjectCreate: '/api/metaObject/create',
        metaObjectUpdate: '/api/metaObject/update',
        sqlDetail: '/api/design/field',
        employeeDisabled: '/api/employee/disabled',
        employeeActive: '/api/employee/active',
        marketDisabled: '/api/market/disabled',
        marketActive: '/api/market/active',
        devCreate: '/dev/create',
        devUpdate: '/dev/update',
        devDelete: '/dev/delete',
        devPage: '/dev/page',
        orgList: '/api/org/list',
        orgCreate: '/api/org/create',
        orgUpdate: '/api/org/update',
        orgDelete: '/api/org/delete',
        orgDetail: '/api/org/detail',
        dbList: '/api/db/list',
        dbCreate: '/api/db/create',
        dbUpdate: '/api/db/update',
        dbDelete: '/api/db/delete',
        tableList: '/api/table/list',
        tableCreate: '/api/table/create',
        tableUpdate: '/api/table/update',
        tableDelete: '/api/table/delete',
        tableDetail: "/api/table/detail",
        tableListByDbId: '/api/table/listByDbId',
        templateList: '/api/template/list',
        templateCreate: '/api/template/create',
        templateUpdate: '/api/template/update',
        templateDelete: '/api/template/delete',
        listParams: '/api/param/list',
        paramsCreate: '/api/param/create',
        paramsDelete: '/api/param/delete',
        paramUpdate: '/api/param/update',
        /**
         * 获取角色下的子角色 ?roleId&gcId
         */
        roleGcRoleChildren: '/api/role/gc-role-children',
        /**  ?employeeId  */
        groupCompanyEmployeeDetail: '/api/employee/gc-detail',
        /**
         * Post 
         * username ,password
         */
        login: '/dev/login',
        /**
         * 增加菜单
         */
        addMenu: "/api/menu/create",
        menuList: "/api/menu/list",
        menuUpdate: '/api/menu/update',
        menuDelete: '/api/menu/delete',
        menuDetail: '/api/menu/detail',
        groupCompanyCreate: '/api/group-company/create',
        groupCompanyPage: '/api/group-company/page',
        groupCompanyDelete: '/api/market/delete',
        getGoupCompanyDetail: '/api/group-company/detail',
        marketCreate: '/api/market/create',
        marketPage: '/api/market/page',
        marketDelete: '/api/market/delete',
        marketUpdate: '/api/market/update',
        marketDetail: '/api/market/detail',
        /**
         * 获取marketMenus
         */
        marketMenus: '/api/market/menus',
        /*** 集团角色列表   ?gcId */
        marketRoles: '/api/role/list',
        /*** 创建集团角色   ?gcId&roleId  body:IRole*/
        roleCreate: '/api/role/create',
        /*** 更新集团角色   ?gcId&roleId  body:IRole*/
        roleUpdate: '/api/role/update',
        /*** 删除集团角色   ?gcId&roleId */
        roleDelete: '/api/role/delete',
        /*** 集团角色的菜单列表   ?gcId&roleId */
        roleMenus: '/api/role/menus',
        /** 属于集团的角色下的员工   ?gcId&roleId  */
        groupCompanyRoleEmployees: '/api/group-company/role/employees',
        /* 集团的菜单列表  ?gcId*/
        groupCompanyMenu: "/api/group-company/menus",
        /** 创建集团员工   body:IUser */
        employeeCreate: '/api/employee/create',
        employeeUpdate: "/api/employee/update",
        /** 更新  body:IUser  */
        groupCompanyEmployeeUpdate: '/api/group-company/employee/update',
        /** 删除   ?gcId&employeeId */
        employeeDelete: "/api/employee/delete",
        /** 分页 ?gcId&page&pageSize */
        employeeList: "/api/employee/list",
        //: '/api/group-company/employee/page',
        employeeBatAdd: "/api/employee/role/bat-add",//角色赋权给一批员工
        employeeBatLess: "/api/employee/role/bat-less",//员工批量删除角色
        /**
            * 获取没有该角色的员工 
            * 
            * get ?marketId&employeeId
           */
        noRoleEmployee: '/employee/employee/no-role',

        /**
         * 列出角色下的所有员工
         * Get ?roleId&marketId
         */
        roleEmployees: '/employee/role/employees',
        // 商品种类
        categoryCreate: '/api/dev/category/create',
        categoryList: '/api/category/list',
        categoryUpdate: '/api/dev/category/update',
        categoryDelete: '/api/category/delete',
        subjectCreate: '/api/dev/subject/create',
        subjectUpdate: '/api/dev/subject/update',
        subjectDelete: '/api/subject/delete',
        subjectList: '/api/subject/custom-subjects',


    }


    async subjectUpdate(subject: ISubject) {
        return await this.http.Post(this.api.subjectUpdate, subject)

    }
    async subjectList(parentId?: number): Promise<ISubject[]> {
        let result: any;
        if (parentId) {
            result = await this.http.Get(this.api.subjectList, { params: { parentId } });
        }
        else {
            result = await this.http.Get(this.api.subjectList);
        }
        return result.subjects;
    }
    async subjectDelete(subId: number) {
        return this.http.Get(this.api.subjectDelete, { params: { subId } })
    }
    async subjectCreate(subject: ISubject) {
        subject.marketId = 0
        return this.http.Post(this.api.subjectCreate, subject)
    }
    async categoryUpdate(category: ICategory) {
        return this.http.Post(this.api.categoryUpdate, category)
    }
    async deleteCate(cateId: number) {
        return this.http.Get(this.api.categoryDelete, { params: { cateId } })
    }
    async categoryList(page: number = 0, pageSize: number = 10, parentId?: number, ): Promise<{ rows: ICategory[], count: number }> {
        let result
        if (parentId)
            result = await this.http.Get(this.api.categoryList, { params: { page, pageSize, parentId, } })
        else {
            result = await this.http.Get(this.api.categoryList, { params: { page, pageSize, } })
        }
        if (result) {
            return result.paging;
        }
    }
    async categoryCreate(category: ICategory) {

        return this.http.Post(this.api.categoryCreate, category)
    }
    async roleEmployees(roleId: number, marketId: number) {
        return this.http.Get(this.api.roleEmployees, { params: { roleId, marketId } })
    }
    async noRoleEmployee(marketId: number, employeeId: number, roleId: number) {
        return this.http.Get(this.api.noRoleEmployee, { params: { marketId, employeeId, roleId } })
    }
    async employeeBatLess(roleId: number, employeeIds: number[]) {
        return this.http.Post(this.api.employeeBatLess, { roleId, employeeIds })
    }
    async employeeBatAdd(roleId: number, employeeIds: string) {
        return this.http.Post(this.api.employeeBatAdd, { roleId, employeeIds })
    }
    async menuDetailByMenuCode(menuCode: string): Promise<IMenu> {
        let result = await this.http.Get(this.api.menuDetailByMenuCode, { params: { menuCode } });
        if (result) {
            if (typeof result.menu.config == "string") {
                result.menu.config = JSON.parse(result.menu.config)
            }
            return result.menu;
        }
    }
    async menuDetail(menuId: number): Promise<IMenu> {
        let result = await this.http.Get(this.api.menuDetail, { params: { menuId } });
        if (result) {
            return result.menu
        }
    }
    metaObjectDataUpdate(metaObject: IMetaObject, dataItem: any) {
        return this.http.Post(this.api.metaObjectDataUpdate, { metaObject, dataItem })
    }
    metaObjectUpdate(metaObject: IMetaObject, fields: IMetadataField[]) {

        fields.forEach(field => {
            typeof field.config == 'object' ? field.config = JSON.stringify(field.config) : field.config;
            field.objectCode = metaObject.objectCode
        });
        metaObject['metaFields'] = fields
        if (typeof metaObject.config == "object") {
            metaObject.config = JSON.stringify(metaObject.config)
        }


        return this.http.Post(this.api.metaObjectUpdate, metaObject);
    }
    metaObjectDelete(objectCode: string) {
        return this.http.Get(this.api.metaObjectDelete, { params: { objectCode } });
    }
    async metaObjectDataPage(objectCode, queryParameter: QueryParameter) {
        // if (queryParameter.queryAttributes) queryParameter.queryAttributes.forEach(attr => attr.key = `@${attr.key}`)
        let result = await this.http.Post(this.api.metaObjectDataPage, queryParameter, { params: { objectCode } });
        if (result) {
            return result.result
        }
    }
    async metaObjectList(): Promise<IMetaObject[]> {
        let result = await this.http.Get(this.api.metaObjectList);
        if (result) {
            return result.metaObjects;
        }
    }
    async metaObjectDetail(objectCode: string): Promise<{ metaObject: IMetaObject, fields: IMetadataField[], config: any }> {
        let result = await this.http.Get(this.api.metaObjectDetail, { params: { objectCode } })
        // debugger;
        if (result) {
            if (!result.metaObject.metaFields) {
                result.metaObject.metaFields = result.fields;
            }
            return { metaObject: result.metaObject, fields: result.metaObject.metaFields || result.fields, config: result.metaObject.config }
        }

    }
    metaObjectCreate(metaObject: IMetaObject, fields: IMetadataField[]): Promise<{ metaObject: IMetaObject }> {
        fields.forEach(field => {
            typeof field.config == 'object' ? field.config = JSON.stringify(field.config) : field.config;
            field.objectCode = metaObject.objectCode
        });
        metaObject['metaFields'] = fields
        if (typeof metaObject.config == "object") {
            metaObject.config = JSON.stringify(metaObject.config)
        }
        return this.http.Post(this.api.metaObjectCreate, metaObject);
    }

    sqlDetail(sql: string): Promise<{ fields: { type: string, field: string, data: any[] }[] }> {
        return this.http.Post(this.api.sqlDetail, { sql });
    }
    employeeDisabled(epId: number) {
        return this.http.Get(this.api.employeeDisabled, { params: { epId } });
    }
    employeeActive(epId: number) {
        return this.http.Get(this.api.employeeActive, { params: { epId } });
    }
    marketDisabled(mktId: number) {
        return this.http.Get(this.api.marketDisabled, { params: { mktId } });
    }
    marketActive(mktId: number) {
        return this.http.Get(this.api.marketActive, { params: { mktId } });
    }

    devCreate(dev: IDevelop): Promise<IDevelop> {
        return this.http.Post(this.api.devCreate, dev);
    }
    devUpdate(dev: IDevelop) {
        return this.http.Post(this.api.devUpdate, dev);
    }
    devDelete(devId: number) {
        return this.http.Get(this.api.devDelete, { params: { devId } })
    }
    async devPage(page = 0, pageSize = 10): Promise<{ rows: IDevelop[], count: number }> {
        let result = await this.http.Get(this.api.devPage, { params: { page, pageSize } });
        if (result) {
            return result.developers
        }
    }

    async paramDelete(id: number) {
        return this.http.Get(this.api.paramsDelete, { params: { id } })
    }
    async paramUpdate(param: IParam) {
        return this.http.Post(this.api.paramUpdate, param);
    }
    async golbalParamsCreate(param: IParam) {
        param.isLocal = 0 as any;
        return this.http.Post(this.api.paramsCreate, param)
    }
    async localParamCreate(param: IParam) {
        param.isLocal = 1 as any;
        return this.http.Post(this.api.paramsCreate, param);
    }
    /**
    * 获取marketMenus
    */
    async  marketMenus(mktId: number) {
        let result = await this.http.Get(this.api.marketMenus, { params: { mktId } });
        return result.menus;
    }
    async listLocalParams(mktId: number, page: number = 0, pageSize: number = 10) {
        let queryParameter: QueryParameter = this.common.getQueryParameter({ mktId: mktId })
        queryParameter.pageParameter = { pageIndex: page, pageSize: pageSize }
        let result = await this.http.Post(this.api.listParams, queryParameter);
        return result.paging;
    }
    async listGolbalParams(mktId: number, page: number = 0, pageSize: number = 10) {
        let queryParameter: QueryParameter = this.common.getQueryParameter({ mktId: mktId })
        queryParameter.pageParameter = { pageIndex: page, pageSize: pageSize }
        let result = await this.http.Post(this.api.listParams, queryParameter);
        return result.paging;
    }
    async orgDetail(orgId: number) {
        let result = await this.http.Get(this.api.orgDetail, { params: { orgId } });
        return result.org;
    }
    async orgDelete(orgId: number) {
        return this.http.Get(this.api.orgDelete, { params: { orgId } })
    }
    async  marketDetail(mktId: number) {
        let result = await this.http.Get(this.api.marketDetail, { params: { mktId } });
        if (!result.market.menuIds) result.market.menuIds = [];
        if (typeof result.market.menuIds == 'string') result.market.menuIds = result.market.menuIds.split(',')
        return result.market;
    }
    async  orgList(mktId: number, parentId: number) {
        let result = await this.http.Post(this.api.orgList, this.common.getQueryParameter({ mktId: mktId, parentId: parentId }));
        return result.orgs.rows;
    }
    async  orgCreate(org: IOrg) {
        return this.http.Post(this.api.orgCreate, org)
    }
    orgUpdate(org: IOrg) {
        return this.http.Post(this.api.orgUpdate, org)
    }
    /** 集团的员工详情 */
    groupCompanyEmployeeDetail(gcId: number, epId: number) {
        return this.http.Get(this.api.groupCompanyEmployeeDetail, { params: { gcId, epId } })
    }
    roleGcRoleChildren(roleId: number, gcId: number) {
        return this.http.Get(this.api.roleGcRoleChildren, { params: { roleId, gcId } })
    }

    templateList() {
        return this.http.Get(this.api.templateList, { params: {} })
    }
    templateCreate(template: Template) {
        return this.http.Post(this.api.templateCreate, template)
    }
    templateUpdate(template: Template) {
        return this.http.Post(this.api.templateUpdate, template)
    }
    templateDelete(templateId: number) {
        return this.http.Get(this.api.templateDelete, { params: { templateId } })
    }

    tableList() {
        return this.http.Get(this.api.tableList);
    }
    tableListByDbId(dbId: number) {
        return this.http.Get(this.api.tableListByDbId, { params: { dbId } })
    }
    tableCreate(table: DbTable) {
        if (Array.isArray(table.cols)) table.cols = JSON.stringify(table.cols) as any;
        return this.http.Post(this.api.tableCreate, table)
    }
    tableUpdate(table: DbTable) {
        if (Array.isArray(table.cols)) {
            table.cols = JSON.stringify(table.cols) as any;
        }
        return this.http.Post(this.api.tableUpdate, table);
    }
    tableDelete(tableId: number) {
        return this.http.Get(this.api.tableDelete, { params: { tableId } });
    }
    tableDetail(tableId: number) {
        return this.http.Get(this.api.tableDetail, { params: { tableId } })
    }




    dbList() {
        return this.http.Get(this.api.dbList, { params: { devId: this.storage.dev.devId } })
    }
    dbUpdate(db: IDb) {
        return this.http.Post(this.api.dbUpdate, db);

    }
    /**创建数据库 */
    dbCreate(db: IDb) {
        db.devId = this.storage.dev.devId;
        return this.http.Post(this.api.dbCreate, db);
    }
    dbDelete(dbId: number) {
        return this.http.Get(this.api.dbList, { params: { devId: this.storage.dev.devId, dbId } });
    }


    async  employeeList(mktId: number, orgId: number) {
        let result = await this.http.Post(this.api.employeeList, this.common.getQueryParameter({ mktId: mktId, orgId: orgId }))
        return result.employees.rows;
    }
    employeeDelete(epId: number) {
        console.log(epId);
        return this.http.Get(this.api.employeeDelete, { params: { epId } })
    }
    employeeUpdate(employee: IUser) {
        return this.http.Post(this.api.employeeUpdate, employee)
    }

    employeeCreate(employee: IUser) {
        if (Array.isArray(employee.roleIds)) employee.roleIds = employee.roleIds.join(',');
        return this.http.Post(this.api.employeeCreate, employee)
    }
    // marketMenu(gcId: number) {
    // return this.http.Get(this.api.groupCompanyMenu, { params: { gcId } })
    // }
    groupCompanyRoleEmployees(gcId: number, roleId: number) {
        return this.http.Get(this.api.groupCompanyRoleEmployees, { params: { gcId, roleId } })
    }
    roleMenus(gcId: number, roleId: number) {
        return this.http.Post(this.api.marketRoles, this.common.getQueryParameter({ roleId: roleId }))
    }
    async  roleCreate(role: IRole) {
        // role.roleType = RoleType.GroupCompany
        if (Array.isArray(role.menuIds)) role.menuIds = role.menuIds.join(',');
        let result = await this.http.Post(this.api.roleCreate, role);
        return result.menus;
    }
    roleUpdate(role: IRole) {
        if (Array.isArray(role.menuIds)) role.menuIds = role.menuIds.join(',');
        return this.http.Post(this.api.roleUpdate, role)
    }
    roleDelete(roleId: number) {
        this.http.Get(this.api.roleDelete, { params: { roleId } })
    }

    async   marketRoles(mktId: number) {
        let result = await this.http.Post(this.api.marketRoles, this.common.getQueryParameter({ mktId: mktId }));
        (result.roles.rows as IRole[]).forEach((role: IRole) => {
            if (typeof role.menuIds == 'string') {
                role.menuIds = (role.menuIds.split(',') as any[])
            }

        });
        return result.roles.rows;

    }
    async   newMarketRoles(mktId: number) {
        let result = await this.http.Post(this.api.marketRoles, this.common.getQueryParameter({ mktId: mktId }));
        return result.roles.rows;
    }

    marketCreate(market: IMarket) {
        return this.http.Post(this.api.marketCreate, market)
    }
    async  marketPage(page: number = 0, pageSize: number = 10) {
        let pageParameter: PageParameter = { pageIndex: page, pageSize: pageSize }
        let result = await this.http.Post(this.api.marketPage, { queryConditions: null, pageParameter: pageParameter });
        return result.markets

    }
    marketDelete(mktId: number) {
        return this.http.Get(this.api.marketDelete, { params: { mktId } });
    }
    marketUpdate(market: IMarket) {
        if (Array.isArray(market.menuIds)) market.menuIds = (market.menuIds as number[]).join(',')
        return this.http.Post(this.api.marketUpdate, market)
    }

    groupCompanyCreate(groupCompany: IGroupCompany) {
        return this.http.Post(this.api.groupCompanyCreate, groupCompany);
    }
    groupCompanyPage(page: number = 0, pageSize = 10) {
        return this.http.Get(this.api.groupCompanyPage, { params: { page, pageSize } })
    }
    groupCompanyDelete(mktId: number) {
        return this.http.Get(this.api.groupCompanyDelete, { params: { mktId } });
    }

    devLogin(userName: string, password: string) {
        return this.http.Post(this.api.login, { userName, password });
    }
    addMenu(menu: IMenu): Promise<IMenu> {
        menu.creatorId = this.storage.dev.devId;
        return this.http.Post(this.api.addMenu, menu);

    }

    getMenuList(menuType: MenuType): Promise<{ menus: { count: number, rows: IMenu[] } }> {
        return this.http.Post(this.api.menuList, this.common.getQueryParameter({ menuType: menuType }))
    }
    devMenuList(): Promise<{ menus: { count: number, rows: IMenu[] } }> {
        return this.getMenuList(MenuType.Develop)
    }

    async marketMenuList() {
        return this.getMenuList(MenuType.Market)
    }
    menuUpdate(menu: IMenu) {
        return this.http.Post(this.api.menuUpdate, menu);
    }
    menuDelete(menuId: number) {
        return this.http.Get(this.api.menuDelete, { params: { menuId } })
    }
    getGroupCompanyByGcId(gcId: number) {

        return this.http.Get(this.api.getGoupCompanyDetail, { params: { gcId } });
    }






    constructor(public http: MyHttpService, public storage: StorageService, public common: CommonService) { }

}
