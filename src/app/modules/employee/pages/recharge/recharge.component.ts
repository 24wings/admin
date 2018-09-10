import { Component, OnInit } from '@angular/core';
import { EmpService, CommonService } from '../../../lib';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BusinessType } from '../../../../constant';
import { NzMessageService } from 'ng-zorro-antd';
import { Member, RechargeWithDraw, Account } from '../../../../../share_platform/market/entity';

@Component({
  selector: 'app-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.css']
})
export class RechargeComponent implements OnInit {
  selectedValue: string = "CASH";
  rechargeForm: FormGroup;
  cardNo: string;
  member: Member;
  account: Account
  rechargeWithDraw: RechargeWithDraw = {};
  constructor(public empService: EmpService, private fb: FormBuilder, private common: CommonService, private nzMessage: NzMessageService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  async memberDetail() {
    let result = await this.empService.findMemberByCardNo(this.cardNo);
    this.member = result.member;
    let memberCustomer = this.member.customers.find(customer => customer.memberId == this.member.id)
    this.member.mobi = memberCustomer.mobi
    this.account = result.account
  }

  memberRecharge = async ($event, value) => {
    $event.preventDefault();
    if (!this.member) {
      this.nzMessage.info("请先查询会员信息！");
    }
    this.rechargeWithDraw.businessType = "RECHARGE";
    this.rechargeWithDraw.cardNo = this.cardNo;
    let key = "rechargeBillNo";
    let result = await this.common.getOrderNo(key);
    this.rechargeWithDraw.billNo = result.orderNo;
    this.rechargeWithDraw.payType = this.selectedValue
    this.rechargeWithDraw.mktId = this.member.mktId
    this.rechargeWithDraw.memberId = this.member.id
    console.log(this.rechargeWithDraw);
    let rechargeResult = await this.empService.memberRecharge(this.rechargeWithDraw);
    if (rechargeResult) this.nzMessage.success("充值成功！")
  }

  resetForm() {
    this.rechargeForm.reset();
  }

  showBalance(value: number) {
    if (typeof value == 'string') {
      value = parseFloat(value);
    }
    if (value < 1) {
      this.nzMessage.info("充值金额小于1");
    }
    this.rechargeForm.get("afterAmout").setValue((this.account.balAmt + value).toFixed(2));
  }

  buildForm(): void {
    this.rechargeForm = this.fb.group({
      type: [''],
      amount: ['', [Validators.required]],
      afterAmout: [''],
      remark: ['']
    });
  }
}
