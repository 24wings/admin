import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EmpService, CommonService } from '../../../lib';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CardStatus } from '../../../../constant';
import { Member, Customer, CustCard } from '../../../../../share_platform/market/entity';
import { User } from '../../../../../share_platform/framework/entity';
import { CommonStatusEnum } from 'share_platform/market/enum';
enum View {
  mList,
  mCreat,
  mUpdate
}
@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
  // relationCardForm: FormGroup;
  // formErrors = {
  //   customerMobi: '',
  //   customerName: ''
  // };

  // validationMessage = {
  //   'customerMobi': {
  //     'required': '请填写手机号',
  //     'pattern': '手机号不合法',
  //   },
  //   'customerName': {
  //     'required': '请填写姓名',
  //     'minlength': '用户名长度最少为2个字符',
  //     'maxlength': '用户名长度最多为4个字符',
  //   }
  // };
  CardStatus = CardStatus;
  CommonStatusEnum = CommonStatusEnum;
  currentCustomerMobi: string;
  phoneValide: boolean = true;
  View = View;
  state = View.mList;
  isLoading: boolean = false;
  member: Member;
  memberId: number;
  customer: Customer;
  toApiCustomer: Customer = {};
  showCustomer: Customer;
  employee: User;
  cardNo: string;
  card: CustCard = {};

  constructor(public empService: EmpService, public route: ActivatedRoute, private fb: FormBuilder, public commonService: CommonService
  ) {
    this.memberId = this.route.snapshot.params.memberId
  }

  ngOnInit() {
    this.memberDetail()
    //this.buildForm();
  }

  async memberDetail() {
    let result = await this.empService.memberDetail(this.memberId);
    this.member = result.member;
    this.customer = result.member.customers.find(customer => customer.id == this.member.customerId);
    this.employee = result.employee;
  }

  getCard() {

  }

  async relationCard() {

    this.card.no = this.cardNo;
    this.showCustomer.card = this.card
    this.empService.relationCard(this.showCustomer);
  }

  async saveCustomer() {
    this.toApiCustomer.memberId = this.memberId;
    this.toApiCustomer = await this.empService.createCustomer(this.toApiCustomer);
  }

  async changeCardStatus(cardId: number, status: string) {
    this.empService.changeCardStatus(cardId, status);
  }

  modifyPayPassword() {

  }

  // buildForm(): void {
  //   this.relationCardForm = this.fb.group({
  //     customerMobi: ['', [
  //       Validators.required,
  //       '/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/'
  //     ]],
  //     customerName: ['', [
  //       Validators.required,
  //       Validators.minLength(2),
  //       Validators.maxLength(4)
  //     ]]
  //   });
  //   this.relationCardForm.valueChanges
  //     .subscribe(data => this.onValueChanged(data));

  //   this.onValueChanged();
  // }

  // onValueChanged(data?: any) {

  //   if (!this.relationCardForm) return;

  //   const form = this.relationCardForm;

  //   for (const field in this.formErrors) {
  //     this.formErrors[field] = '';
  //     const control = form.get(field);

  //     if (control && control.dirty && !control.valid) {
  //       const messages = this.validationMessage[field];
  //       for (const key in control.errors) {
  //         // 把所有验证不通过项的说明文字拼接成错误消息
  //         this.formErrors[field] += messages[key] + '\n';
  //       }
  //     }
  //   }
  //   console.log(this.formErrors);
  // }

}
