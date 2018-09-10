import { Component, OnInit } from '@angular/core';
import { EmpService, CommonService } from '../../../lib';
import { Member, Customer } from 'share_platform/market/entity';
import { QueryParameter, PageParameter } from '../../../../../share_platform/framework/util';
import { MemberTypeEnum } from 'share_platform/market/enum';

import { NzMessageService } from 'ng-zorro-antd';
enum View {
  mList,
  mCreat,
  mUpdate
}
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {
  queryFields: IMetadataField[] = [{
    fieldName: 'createTime',
    fieldType: 'datetime', isShow: true, alias: '创建时间', isQuery: true, isUpdate: false, recno: 1
  }]
  memberType: MemberTypeEnum = MemberTypeEnum.COMPANY;
  selectedMemberType = MemberTypeEnum.PERSONAL
  View = View;
  state = View.mList;
  size = 'default';
  confirme: string;
  dateRange: Date[] = [new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 3), new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 1)];
  page: number = 1;
  pageSize: number = 10;
  count: number;
  status: string;
  memberName: string;
  phoneValide: boolean = true;
  member: Member = {
    mobi: "",
  };
  members: Member[] = [];
  queryMembers: IQueryMember = {
    mktId: 0,
    page: this.page,
    pageSize: this.pageSize
  };
  customerExist: boolean;
  // queryParameter: QueryParameter = {}
  customer: Customer = {};
  query($event) {
    console.log($event)
  }

  constructor(
    public commonService: CommonService, public empService: EmpService, public message: NzMessageService
  ) {
    //console.log(message)
    //this.commonService.getQueryParameter([{ mktId: 1, menu: 2, a: 3 }, { mes: "2312", b: 221 }])
  }
  okCreatmember() {

  }
  handleCancel() {
    this.state = View.mList
  }
  ngOnInit() {
    this.initFindAll();
  }

  async initFindAll() {
    let result = await this.empService.findAllMember(this.page - 1, this.pageSize)
    this.members = result.rows
    let currentCustomer;
    for (let member of this.members) {
      currentCustomer = member.customers.find(customer => customer.memberId == member.id)
      if (currentCustomer) {
        member.mobi = currentCustomer.mobi
      }
    }
    this.count = result.count
  }

  async likeSearch() {
    let queryParameter: QueryParameter = this.commonService.getQueryParameter({ createTime: { $gt: this.dateRange[0], $lt: this.dateRange[1] }, status: this.status, name: this.memberName });
    // console.log(QueryParameter)
    let result = await this.empService.findLike(queryParameter);
    this.members = result.rows
    this.count = result.count
  }



  async checkMobile() {
    this.customer = await this.empService.findByMobi(this.member.mobi);
    if (this.customer) {
      this.member.name = this.customer.name
      this.message.info("手机号已注册App！")
    } else {
      this.member.name = "";
      this.customerExist = false;
      this.message.info("手机号未注册App！")
    }

  }
  async saveMember() {
    if (this.confirme != this.member.payPassword) {

    }
    this.empService.memberCreate(this.member);
  }

  onChange(result: Date[]): void {

    this.dateRange = result;
    console.log(this.dateRange);
  }
}
