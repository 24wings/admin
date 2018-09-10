import { Injectable } from '@angular/core';
import { MyHttpService } from './http.service';
import { StorageService } from './storage.service';
import { Order, RechargeWithDraw, TransFeeRule } from 'share_platform/market/entity';
import { Member, Customer, Feelist } from 'share_platform/market/entity';
import { CommonService } from './common.service';
import { QueryParameter, PageParameter } from '../../../../share_platform/framework/util';
import { User, Params } from '../../../../share_platform/framework/entity';
import { OrderStatusEnum } from 'share_platform/market/enum';
// import { RecursiveTemplateAstVisitor } from '@angular/compiler';



@Injectable()
export class EmpService {

    api = {
        queryMemberByPhone: '/api/employee/queryMemberByPhone',
        login: '/employee/login',//员工登录
        orgCreate: "/api/org/create",//创建组织
        orgUpdate: "/api/org/update",//更新组织
        orgDelete: "/api/org/delete",//删除组织
        orgDetail: "/api/org/detail",//组织详情
        orgList: "/api/org/list",//组织列表
        roleCreate: '/api/role/create',
        roleUpdate: '/api/role/update',
        roleDelete: '/api/role/delete',
        roleList: '/api/role/list',
        employeeCreate: '/api/employee/create',
        employeeUpdate: "/api/employee/update",
        employeeDelete: "/api/employee/delete",
        employeeList: "/api/employee/list",
        employeeDetail: "/api/employee/detail",
        employeeDisable: "/api/employee/disable",
        employeeActive: '/api/employee/active',
        marketDetail: '/api/market/detail',
        marketMenus: '/api/market/menus',
        listParams: '/api/param/list',
        paramsCreate: '/api/param/create',
        paramsDelete: '/api/param/delete',
        paramUpdate: '/api/param/update',
        modifyPassword: "/api/modify-password",
        employeeBatAdd: "/employee/role/bat-add-employee",//角色赋权给一批员工
        employeeBatLess: "/api/employee/role/bat-less",//员工批量删除角色
        feeListStatusUpdate: '/api/feelist/status/update',
        payFeeRecordQuery: '/api/feelist/payFeeeRecord/query',
        payFeeRecordDetail: '/api/feelist/payFeeRecord/detail',
        payFeeRecordFinish: '/api/feelist/payFeeRecord/finish',
        payFeeListQuery: '/api/feelist/payFeeList/query',

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
        /**
             * method post 
             * body:{mktId,page,pageSize}
             */
        txnAreaList: '/api/txnArea/list',
        txnAreaDelete: '/api/txnArea/delete',
        txnAreaUpdate: '/api/txnArea/update',
        txnAreaCreate: '/api/txnArea/create',
        txnAreaDetail: '/api/txnArea/detail',
        categoryCreate: '/api/category/create',
        categoryList: '/api/category/list',
        categoryUpdate: '/api/category/update',
        categoryDelete: '/api/category/delete',//商品种类
        findByCatCode: '/api/category/detail',
        categoryInternalList: '/api/category/internal-list',//获取所有国际级商品列表

        listInternalSujects: '/api/subject/internal-list', //市场收支科目

        subjectCustomCreate: '/api/subject/custom-create',

        subjectCustomList: '/api/subject/custom-subjects',
        subjectUpdate: '/api/subject/custom-update',
        memberCreate: '/api/member/create',
        findAllMember: '/api/member/page',
        findLike: '/api/member/like',
        memberDetail: '/api/member/detail',
        customerMobileCheck: '/api/customer/findByMobi',
        createCustomer: '/api/customer/create',
        relationCard: '/api/customer/relationCard',
        changeCardStatus: '/api/customer/changeCardStatus',
        findMemberByCardNo: '/api/customer/findByCardNo',
        memberRecharge: '/api/reWithDr/recharge',
        memberWithDraw: '/api/reWithDr/withDraw',

        // 费用清单--新增--修改--删除--列表
        feelistCreat: "/api/feelist/creat",
        feelistUpdate: "/api/feelist/update",
        feelistDelate: "/api/feelist/delete",
        feelistAll: "/api/feelist/list",
        feeMobe: "/api/feelist/mob",//根据手机号查找id

        //订单
        orderCreateAndPay: "/api/order/createAndPay",
        orderCreate: "/api/order/orderCreate",
        orderPay: "/api/order/orderPay",
        findOrderByOrderNo: "/api/order/getOrderInfo",
        orderRefund: "/api/order/refund",
        //费率表查询
        queryTransFeeRuleList: "/api/transFeeRule/list",
        createTransFeeRule: "/api/transFeeRule/create",
        updateTransFeeRule: "/api/transFeeRule/ableAndDisable"
    }

    queryMemberByPhone(phone: string) {
        return this.http.Get(this.api.queryMemberByPhone, { params: { phone, mktId: this.storage.employee.mktId } })
    }
    async updateTransFeeRule(id: number, status: boolean) {
        return await this.http.Get(this.api.updateTransFeeRule, { params: { id, status } })
    }

    async orderRefund(orderNo: string, status: OrderStatusEnum) {
        return await this.http.Get(this.api.orderRefund, { params: { orderNo, status } });
    }

    async findOrderByOrderNo(orderNo: string) {
        return await this.http.Get(this.api.findOrderByOrderNo, { params: { orderNo } });
    }
    async queryTransFeeRuleList(pageParameter?: PageParameter, mktId?: number) {
        if (mktId) {
            mktId = this.storage.employee.mktId
        }
        let queryParameter: QueryParameter = this.comonn.getQueryParameter({ mktId: mktId })
        if (pageParameter) {
            queryParameter.pageParameter = pageParameter
        }
        return await this.http.Post(this.api.queryTransFeeRuleList, queryParameter)
    }
    async createTransFeeRule(transFeeRule: TransFeeRule) {
        transFeeRule.mktId = this.storage.employee.mktId
        return await this.http.Post(this.api.createTransFeeRule, transFeeRule);
    }
    // async orderCreateAndPay(order: Order) {
    //     return await this.http.Post(this.api.orderCreateAndPay, order)
    // }
    async orderCreate(order: Order) {
        return await this.http.Post(this.api.orderCreate, order)
    }
    async orderPay(order: Order) {
        return await this.http.Post(this.api.orderPay, order)
    }

    async findByCatCode(catCode: string, mktId?: number) {
        if (!mktId) {
            mktId = this.storage.employee.mktId
        }
        return await this.http.Get(this.api.findByCatCode, { params: { catCode, mktId } })

    }
    async findAllMember(pageIndex: number, pageSize: number, mktId?: number): Promise<{ rows: Member[], count: number }> {
        if (!mktId) {
            mktId = this.storage.employee.mktId
        }
        let queryParameter: QueryParameter = this.comonn.getQueryParameter({ mktId: mktId });
        queryParameter.pageParameter = { pageIndex: pageIndex, pageSize: pageSize }
        let result = await this.http.Post(this.api.findAllMember, queryParameter)
        if (result) {
            return result.paging
        } else {
            return this.http.createMessage('error', '数据为空') as any;
        }
    }
    async memeberWithDraw(rechargeWithDraw: RechargeWithDraw) {
        rechargeWithDraw.mktId = this.storage.employee.mktId
        return await this.http.Post(this.api.memberWithDraw, rechargeWithDraw);
    }
    async memberRecharge(rechargeWithDraw: RechargeWithDraw) {
        rechargeWithDraw.mktId = this.storage.employee.mktId
        return await this.http.Post(this.api.memberRecharge, rechargeWithDraw);
    }
    async findMemberByCardNo(cardNo: string) {
        return await this.http.Get(this.api.findMemberByCardNo, { params: { cardNo } });
    }
    async changeCardStatus(cardId: number, status: string) {
        return await this.http.Get(this.api.changeCardStatus, { params: { cardId, status } });
    }
    async relationCard(customer: Customer) {
        return await this.http.Post(this.api.relationCard, customer);
    }
    async createCustomer(customer: Customer) {
        customer.mktId = this.storage.employee.mktId
        return await this.http.Post(this.api.createCustomer, customer);
    }
    async memberDetail(memberId: number): Promise<{ member: Member, employee: User }> {
        return await this.http.Get(this.api.memberDetail, { params: { memberId } })
    }
    async findLike(queryParameter: QueryParameter): Promise<{ rows: Member[], count: number }> {
        let result = await this.http.Post(this.api.findLike, queryParameter)
        return result.paging
    }



    async findByMobi(mobi: string) {
        let mktId = this.storage.employee.mktId;
        let result = await this.http.Get(this.api.customerMobileCheck, { params: { mobi, mktId } });
        if (result) {
            return result.customer;
        }
    }
    async memberCreate(member: Member) {
        let mktId = this.storage.employee.mktId;
        member.mktId = mktId;
        return this.http.Post(this.api.memberCreate, member)
    }
    async feelistAll(page: number = 0, pageSize: number = 10, mktId?: number) {
        let queryParameter: QueryParameter = this.comonn.getQueryParameter({ mktId: mktId })
        queryParameter.pageParameter = { pageIndex: page, pageSize: pageSize }
        let result = await this.http.Post(this.api.feelistAll, queryParameter)
        if (result) {
            return result
        }
    }
    async feeMobe(mobi: string, mktId?: number) {
        mktId = this.storage.employee.mktId
        let result = await this.http.Get(this.api.feeMobe, { params: { mobi, mktId } })
        if (result) {
            return result.member
        }
    }
    async feelistDelate(id: number) {
        return this.http.Get(this.api.feelistDelate, { params: { id } })
    }
    async feelistUpdate(feelist: Feelist) {
        return this.http.Post(this.api.feelistUpdate, feelist)
    }
    async feelistCreat(feelist: Feelist) {
        feelist.mktId = this.storage.employee.mktId;
        return this.http.Post(this.api.feelistCreat, feelist)
    }
    // 市场创建的收支科目列表
    async feeSubject(mktId?: number): Promise<ICategory[]> {
        let result = await this.http.Post(this.api.listInternalSujects, this.comonn.getQueryParameter({ mktId: this.storage.employee.mktId }));
        if (result) {
            return result.subjects.rows
        }


    }
    async subjectUpdate(subject: ISubject) {

        return this.http.Post(this.api.subjectUpdate, subject)
    }
    async subjectCustomList(parentId: number) {

        return this.http.Post(this.api.subjectCustomList, this.comonn.getQueryParameter({ parentId: parentId }))
    }
    async subjectCustomCreate(subject: ISubject) {
        subject.marketId = this.storage.employee.mktId

        return this.http.Post(this.api.subjectCustomCreate, subject)
    }
    async listInternalSujects(mktId?: number) {
        if (!mktId) {
            mktId = 0
        }
        return this.http.Post(this.api.listInternalSujects, this.comonn.getQueryParameter({ mktId: mktId }));
    }
    async categoryInternalList(mktId?: number): Promise<ICategory[]> {
        mktId = 0
        let result = await this.http.Post(this.api.categoryInternalList, this.comonn.getQueryParameter({ mktId: mktId }));
        if (result) {
            return result.categorys.rows;
        }
    }
    async txnDetail(txnId: number, marketId?: number) {
        marketId = this.storage.employee.mktId
        return this.http.Get(this.api.txnAreaDetail, { params: { txnId, marketId } })
    }
    async txnAreaDelete(txnId: number) {

        return this.http.Get(this.api.txnAreaDelete, { params: { txnId } })
    }
    async txnAreaUpdate(txnArea: ITxnArea) {

        return this.http.Post(this.api.txnAreaUpdate, txnArea)
    }
    async txnAreaList(pageParameter?: PageParameter, mktId?: number): Promise<{ rows: ITxnArea[], count: number }> {
        if (!mktId) {
            mktId = this.storage.employee.mktId
        }
        let queryParameter: QueryParameter = this.comonn.getQueryParameter({ mktId: mktId });
        if (!pageParameter) {
            queryParameter.pageParameter = pageParameter
        }
        let result = await this.http.Post(this.api.txnAreaList, queryParameter)
        if (result) {
            return result.paging
        } else {
            return this.http.createMessage('error', '数据为空') as any;
        }
    }
    async txnAreaCreate(txnArea: ITxnArea) {
        txnArea.mktId = this.storage.employee.mktId

        return this.http.Post(this.api.txnAreaCreate, txnArea)

    }




    async categoryUpdate(category: ICategory) {

        return this.http.Post(this.api.categoryUpdate, category)
    }
    async deleteCate(cateId: number, ) {

        return this.http.Get(this.api.categoryDelete, { params: { cateId } })
    }
    async categoryList(page: number = 0, pageSize: number = 10, mktId?: number, parentId?: number, ): Promise<{ rows: ICategory[], count: number }> {

        let result
        mktId = this.storage.employee.mktId
        let queryParameter: QueryParameter = this.comonn.getQueryParameter({ mktId: mktId })
        queryParameter.pageParameter = { pageIndex: page, pageSize: pageSize }
        if (parentId)
            result = await this.http.Post(this.api.categoryList, this.comonn.getQueryParameter({ mktId: mktId, parentId: parentId }))
        else {
            result = await this.http.Post(this.api.categoryList, queryParameter)
        }
        if (result) {
            return result.paging;

        }

    }
    async categoryCreate(category: ICategory) {

        category.mktId = this.storage.employee.mktId


        return this.http.Post(this.api.categoryCreate, category)
    }


    async roleEmployees(roleId: number, mktId: number) {
        return this.http.Post(this.api.roleEmployees, this.comonn.getQueryParameter({ roleId: roleId, mktId: mktId }))
    }
    async noRoleEmployee(marketId: number, employeeId: number, roleId: number) {
        return this.http.Get(this.api.noRoleEmployee, { params: { marketId, employeeId, roleId } })
    }
    async employeeBatLess(roleId: number, employeeIds: number[]) {
        return this.http.Post(this.api.employeeBatLess, { roleId, employeeIds })
    }
    async employeeBatAdd(roleId: number, employeeIds: number[]) {
        return this.http.Post(this.api.employeeBatAdd, { roleId, employeeIds })
    }
    async modifyPassword(epId: number, password: string) {
        return this.http.Post(this.api.modifyPassword, { epId, password })
    }
    async listLocalParams(mktId: number, page: number = 0, pageSize: number = 10) {
        mktId = this.storage.employee.mktId
        let queryParameter: QueryParameter = this.comonn.getQueryParameter({ mktId: mktId, isLocal: 1 })
        queryParameter.pageParameter = { pageIndex: page, pageSize: pageSize }
        let result = await this.http.Post(this.api.listParams, queryParameter);
        return result.paging;
    }
    async listGolbalParams(mktId: number, page: number = 0, pageSize: number = 10) {
        mktId = this.storage.employee.mktId
        let queryParameter: QueryParameter = this.comonn.getQueryParameter({ mktId: mktId, isLocal: 0 })
        queryParameter.pageParameter = { pageIndex: page, pageSize: pageSize }
        let result = await this.http.Post(this.api.listParams, { params: { isLocal: 0, mktId, page, pageSize } });
        return result.paging;
    }
    async golbalParamsCreate(param: IParam) {
        param.isLocal = 0 as any;
        return this.http.Post(this.api.paramsCreate, param)
    }
    async localParamCreate(param: IParam) {
        param.isLocal = 1 as any;
        return this.http.Post(this.api.paramsCreate, param);
    }
    async paramDelete(id: number) {
        return this.http.Get(this.api.paramsDelete, { params: { id } })
    }
    async paramUpdate(param: IParam) {
        return this.http.Post(this.api.paramUpdate, param);
    }

    async  marketMenus(mktId: number) {
        if (!mktId) {
            mktId = this.storage.employee.mktId
        }
        let result = await this.http.Get(this.api.marketMenus, { params: { mktId } });
        return result.menus;
    }
    async  marketDetail(mktId: number) {
        let result = await this.http.Get(this.api.marketDetail, { params: { mktId } });


        if (!result.market.menuIds) result.market.menuIds = [];
        if (typeof result.market.menuIds == 'string') result.market.menuIds = result.market.menuIds.split(',')
        return result.market;
    }
    async employeeDisable(epId: number) {
        return this.http.Get(this.api.employeeDisable, { params: { epId } })
    }
    async employeeActive(epId: number) {
        return this.http.Get(this.api.employeeDisable, { params: { epId } })
    }
    async  employeeDetail(epId: number) {
        let result = await this.http.Get(this.api.employeeDetail, { params: { epId } });
        // if (!result.employee.epId) result.employee.epId = [];
        // if (typeof result.employee.epId == 'string') result.employee.epId = result.employee.epId.split(',')
        return result.employee;
    }
    async  employeeList(mktId: number, orgId: number) {
        let result = await this.http.Post(this.api.employeeList, this.comonn.getQueryParameter({ mktId: mktId, orgId: orgId }))
        return result.employees.rows;
    }
    async  employeeDelete(epId: number) {
        console.log(epId);
        return this.http.Get(this.api.employeeDelete, { params: { epId } })
    }
    async  employeeUpdate(employee: IUser) {
        return this.http.Post(this.api.employeeUpdate, employee)
    }
    async  employeeCreate(employee: IUser) {
        if (Array.isArray(employee.roleIds)) employee.roleIds = employee.roleIds.join(',');
        return this.http.Post(this.api.employeeCreate, employee)
    }
    async   roleList(mktId: number) {
        let result = await this.http.Post(this.api.roleList, this.comonn.getQueryParameter({ mktId: mktId }));
        (result.roles.rows as IRole[]).forEach((role: IRole) => {
            if (typeof role.menuIds == 'string') {
                role.menuIds = (role.menuIds.split(',') as any[])
            }

        });
        return result.roles.rows;

    }
    async  roleDelete(roleId: number) {
        this.http.Get(this.api.roleDelete, { params: { roleId } })
    }

    async   roleUpdate(role: IRole) {
        if (Array.isArray(role.menuIds)) role.menuIds = role.menuIds.join(',');
        return this.http.Post(this.api.roleUpdate, role)
    }
    async  roleCreate(role: IRole) {

        if (Array.isArray(role.menuIds)) role.menuIds = role.menuIds.join(',');
        let result = await this.http.Post(this.api.roleCreate, role);
        return result.menus;
    }
    async  orgList(mktId: number, parentId: number) {
        let result = await this.http.Post(this.api.orgList, this.comonn.getQueryParameter({ mktId: mktId, parentId: parentId }));
        return result.orgs.rows;
    }
    async orgDetail(orgId: number, ) {
        let result = await this.http.Get(this.api.orgDetail, { params: { orgId, } });
        return result.org;
    }
    async orgDelete(orgId: number) {
        return this.http.Get(this.api.orgDelete, { params: { orgId } })
    }
    async  orgUpdate(org: IOrg) {
        return this.http.Post(this.api.orgUpdate, org)
    }
    async  orgCreate(org: IOrg) {
        return this.http.Post(this.api.orgCreate, org)
    }

    async EmpLogin(userName: string, password: string) {
        return this.http.Post(this.api.login, { userName, password });
    }






    constructor(public http: MyHttpService,
        public storage: StorageService,
        public comonn: CommonService
    ) {

    }

}
