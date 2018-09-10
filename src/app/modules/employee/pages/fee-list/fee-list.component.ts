import { Component, OnInit } from '@angular/core';
import { EmpService, StorageService } from '../../../lib';
import { PayFeeList, PayFeeRecord, Feelist, Customer } from 'share_platform/market/entity';
import { PayFeeRecordEnum } from 'share_platform/framework/enum';
import { RecPaySubject, Member } from '../../../../share_platform/market/entity';

enum View {
  FeeAll = 1,
  FeeAdd,
  FeeUpdate,
  PreFee
}

@Component({
  selector: 'app-fee-list',
  templateUrl: './fee-list.component.html',
  styles: []
})
export class FeeListComponent implements OnInit {
  View = View;
  phone: string = '13419597065';
  subjectId: number;
  preFeelist: Feelist[] = [];
  optionSubjects: RecPaySubject[] = [];
  count: number = 10;

  state = View.FeeAll;
  newFeeMobi: string = "";
  newFeel: Feelist = {
    title: "费用名称",

  };
  newFeeMember: Member;
  newPayFeeRecord: PayFeeRecord = {
    shouldChargeMoney: 0,
    realChargeMoney: 0,
    title: '',
    status: PayFeeRecordEnum.Active

  };
  selectedValue = { label: '', value: 0 }
  public nzOptions = null;
  member: IMember;
  startdate: Date = null; // new Date();
  dateRange = []; // [ new Date(), addDays(new Date(), 3) ];
  finshdate: Date = null
  feeLists: Feelist[] = []
  page: number = 1
  pageSize: number = 10
  feeList: Feelist;
  /** ngModel value */
  public values: any[] = null

  constructor(
    public emp: EmpService,
    public sto: StorageService,
  ) {
  }
  async ngOnInit() {
    // this.FeeAllList()
    this.getSubject()

  }

  // 获取科目
  async getSubject() {

    this.optionSubjects = await this.emp.feeSubject()
    console.log(this.optionSubjects)
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }


  // 新增收费
  async AddFee() {
    this.state = View.FeeAll;
    // this.member = await this.emp.feeMobe(this.newFeel.mobi)
    if (this.newFeeMember) {
      this.newFeel.memberId = this.newFeeMember.id
      this.newFeel.startDate = this.startdate;
      this.newFeel.endDate = this.finshdate;
      let now = new Date();
      if (now.getTime() > this.finshdate.getTime()) {
        this.newFeel.status = 'finish';
      } else if (now.getTime() > this.startdate.getTime() && now.getTime() < this.finshdate.getTime()) {
        this.newFeel.status = 'active';
      } else {
        this.newFeel.status = 'unactive';
      }
      let result = await this.emp.feelistCreat(this.newFeel);
      debugger;
      this.state = View.FeeAll;
    }
    await this.FeeAllList()

  }
  // 选中更新
  async edit(data) {
    this.feeList = data;
    // this.selectedValue = this.feeList.subjectId
  }

  async UpdateFee() {
    let result = await this.emp.feelistUpdate(this.feeList)
    this.state = View.FeeAll;
    await this.FeeAllList()

  }
  // 删除
  async FeeDelete(data: Feelist) {
    await this.emp.feelistDelate(data.id);
    await this.FeeAllList()
  }
  //收费列表
  async FeeAllList() {
    let result = await this.emp.feelistAll(0, 10);
    this.feeLists = result.paging.rows;

  }
  handleCancel() {
    this.state = View.FeeAll
  }





  allChecked = false;
  disabledButton = true;
  checkedNumber = 0;
  displayData: Array<{ name: string; age: number; address: string; checked: boolean }> = [];
  operating = false;
  indeterminate = false;

  currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean }>): void {
    this.displayData = $event;
  }

  getCustomer(member: Member): Customer {
    return member.customers.find(customer => customer.memberId == member.id) as any;
  }
  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.checked === true);
    const allUnChecked = this.displayData.every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
    this.disabledButton = !this.feeLists.some(value => value.checked);
    this.checkedNumber = this.feeLists.filter(value => value.checked).length;
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => data.checked = value);
    this.refreshStatus();
  }
  async queryMemberByPhone() {
    this.newFeeMember = null;
    let result = await this.emp.queryMemberByPhone(this.newFeeMobi);
    if (result) {
      this.newFeeMember = result.member;
    }
  }
  /**
   * 预收费 
   * 1. 费用列表
  */
  async preFee() {
    // this.newPayFeeRecord. = this.feeLists.filter(fee => fee.checked).map(fee => {
    //   return { feeListId: fee.feeListId, shouldChargeMoney: fee.shouldChargeMoney, title: fee.feeListName, payFeeUserId: fee.payFeeMemberId }
    // });
    // this.newPayFeeRecord.shouldChargeMoney = 0;
    // this.newPayFeeRecord.payfeeLists.forEach(fee => this.newPayFeeRecord.shouldChargeMoney += fee.shouldChargeMoney);
    this.state = this.View.PreFee;
  }
  payFeeRemove(payfee: PayFeeList) {
    // this.newPayFeeRecord.payfeeLists.splice(this.newPayFeeRecord.payfeeLists.indexOf(payfee), 1);
    // this.newPayFeeRecord.shouldChargeMoney = 0;
    // this.newPayFeeRecord.payfeeLists.forEach(fee => this.newPayFeeRecord.shouldChargeMoney += fee.shouldChargeMoney);

  }
  async  payFeeRecordCreate() {
    this.newPayFeeRecord.subjectId = this.subjectId;
    this.newPayFeeRecord.createTime = new Date();
    // let emp = await this.emp.payFeeRecordCreate(this.newPayFeeRecord);
    // if (emp) {
    //   await this.emp.feelistStatusUpdate(this.newPayFeeRecord.payfeeLists.map(payFee => payFee.feeListId), 'process');

    // }
    await this.FeeAllList();


  }

}
