import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { EmpService, CommonService } from '../../../lib';
import { NzMessageService } from 'ng-zorro-antd';
import { BusinessType } from '../../../../constant';
import { Member, RechargeWithDraw, Account } from '../../../../../share_platform/market/entity';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {

  selectedValue: string = "cash";
  withdrawForm: FormGroup;
  cardNo: string;
  member: Member;
  account: Account;
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

  memberWithdraw = async ($event, value) => {
    $event.preventDefault();
    if (!this.member) {
      this.nzMessage.info("请先查询会员信息！");
    }
    this.rechargeWithDraw.businessType = "WITHDRAW";
    this.rechargeWithDraw.cardNo = this.cardNo;
    this.rechargeWithDraw.amount = value.amount;
    this.rechargeWithDraw.payPassword = value.payPassword;
    let key = BusinessType.WithDraw + new Date().format("yyyyMMdd");
    let result = await this.common.getOrderNo(key);
    this.rechargeWithDraw.billNo = result.orderNo;
    let rechargeResult = await this.empService.memeberWithDraw(this.rechargeWithDraw);
    if (rechargeResult) this.nzMessage.success("提现成功！");
    this.resetForm();
  }

  resetForm() {
    this.withdrawForm.reset();
  }

  showBalance(value: number) {
    if (value < 1) {
      this.nzMessage.info("提现金额小于1");
      return;
    }
    this.withdrawForm.get("afterAmout").setValue(this.account.availAmt - value);
  }

  afterAmoutValidator = (control: FormControl): { [s: string]: boolean } => {
    if (control.value < 0) {
      return { confirm: true, error: true };
    }
  }

  buildForm(): void {
    this.withdrawForm = this.fb.group({
      amount: ['', [Validators.required]],
      payPassword: ['', [Validators.required]],
      afterAmout: ['', [this.afterAmoutValidator]],
      remark: ['']
    });
  }

}
