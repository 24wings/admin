import { Component, OnInit, ViewChild } from '@angular/core';
import { PriceUnitEnum, PayTypeEnum, CreateWayEnum, CommonStatusEnum, PriceWayEnum } from 'share_platform/market/enum';
import { Product, ProdCatalog, Order, Member, Account, Customer, OrderDetail, TransArea } from '../../../../../share_platform/market/entity';
import { EmpService, CommonService, StorageService } from '../../../lib';
import { NzMessageService } from 'ng-zorro-antd';
import { EntityEnum } from '../../../../entity.enum';
import { QueryObject } from '../../../../share_platform/framework/util';
enum View {
  ListParams = 1,
  OrderPay
}
@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.css']
})
export class ExchangeComponent implements OnInit {
  show: boolean = false;
  EntityEnum = EntityEnum
  PriceUnitEnum = PriceUnitEnum
  PriceWayEnum = PriceWayEnum
  View = View
  state = View.ListParams
  selectedValue = PriceWayEnum.WEIGHT
  priceUnitSelectedValue = PriceUnitEnum.KG
  cardNo: string;
  prodCatCode: string;
  product: Product = {
  }
  txns: TransArea[] = []
  orderNo: string;
  order: Order = {}
  products: Product[] = []
  prodCatalog: ProdCatalog = {}
  buyerMember: Member = {}
  sellerMember: Member = {}
  buyerCustomer: Customer
  account: Account = {}
  editCache = {};
  amount: number = 0;
  totalWeight: number = 0;
  selectedTransAreaId: number;
  subtractMoney: number;
  orderDetail: OrderDetail = {}
  orderDetails: OrderDetail[] = []
  flag = false;
  isConfirmLoading = false;
  @ViewChild("quantityInput") quantityInput: { nativeElement: HTMLInputElement }
  @ViewChild("pcsWgtInput") pcsWgtInput: { nativeElement: HTMLInputElement }
  @ViewChild("catCodeInput") catCodeInput: { nativeElement: HTMLInputElement }
  @ViewChild("weightInput") weightInput: { nativeElement: HTMLInputElement }

  constructor(public empService: EmpService,
    public nzMessage: NzMessageService,
    public common: CommonService,
    public storage: StorageService) {
    this.selectedTransAreaId = this.storage.getLocalValue("currentTransAreaId");
    console.log(this.selectedTransAreaId)
  }
  presetQueryObject: QueryObject = {}

  ngOnInit() {
    this.updateEditCache();
    this.queryTransAreaList();
  }

  handleOk(): void {
    this.isConfirmLoading = true;
    this.orderPay()
  }

  handleCancel(): void {
    this.state = View.ListParams;
  }
  pcsWgtInputNext() {
    this.pcsWgtInput.nativeElement.focus()
  }


  async findByCardNo() {
    let result = await this.empService.findMemberByCardNo(this.cardNo);
    if (result) {
      this.buyerMember = result.member
      this.buyerCustomer = this.buyerMember.customers.find(customer => customer.card.no == this.cardNo)
      this.account = result.account
      this.subtractMoney = Number((this.account.balAmt - this.amount).toFixed(2))
      //this.order.orderNo = await this.getOrderNo()
    } else {
      this.nzMessage.error('未找到会员信息！');
    }
  }
  searchMember() {
    this.presetQueryObject = { mktId: this.storage.employee.mktId, no: { $like: this.order.sellerMemNo } };
    this.show = true;
  }

  async queryTransAreaList() {
    let result = await this.empService.txnAreaList()
    if (result) {
      this.txns = result.rows
    }
  }
  selectMember(members: Member[]) {
    if (members.length == 1) {
      this.sellerMember = members[0]
    }

    this.show = false
  }

  saveEdit(catCode: string): void {
    const index = this.products.findIndex(item => item.catCode === catCode);
    this.products[index] = this.editCache[catCode].data;
    this.products[index].amout = this.products[index].pcsWgt * this.products[index].price
    this.editCache[catCode].edit = false;

  }

  cancelEdit(catCode: number): void {
    this.editCache[catCode].edit = false;
  }

  deleteRow(i: number): void {
    const dataSet = this.orderDetails.filter(d => d.prodCatId !== i);
    this.products = dataSet;
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  updateEditCache(): void {
    this.amount = 0;
    this.totalWeight = 0;
    if (this.orderDetails) {
      this.orderDetails.forEach(item => {
        if (!this.editCache[item.prodCatId]) {
          this.editCache[item.prodCatId] = {
            edit: false,
            data: item
          };
        }
        this.amount += item.amount
        this.totalWeight += item.weight;
      });
    }
    this.amount = Number(this.amount.toFixed(2))
  }

  addGoods() {

    this.orderDetail.priceWay = this.selectedValue
    this.orderDetail.priceUnit = this.priceUnitSelectedValue
    if (this.selectedValue == 'PIECE') {
      this.orderDetail.weight = this.orderDetail.pcsWgt
      this.orderDetail.amount = this.orderDetail.price * this.orderDetail.qty
    } else {
      this.orderDetail.qty = 1
      this.orderDetail.amount = this.orderDetail.price * this.orderDetail.weight
    }
    // this.products.push(this.product);
    this.orderDetails = [...this.orderDetails, this.orderDetail]
    this.orderDetail = {}
    this.updateEditCache();
    this.prodCatCode = "";
    this.catCodeInput.nativeElement.focus();
  }

  async queryProdCatalog() {
    let result = await this.empService.findByCatCode(this.prodCatCode);
    if (result.prodCatalog) {
      let prodCatalog: ProdCatalog = result.prodCatalog
      this.orderDetail.prodCatName = prodCatalog.catName
      this.orderDetail.prodCatId = prodCatalog.id
    } else {
      this.catCodeInput.nativeElement.focus();
      this.nzMessage.info("未查询到品类信息！");
    }
  }

  async getOrderNo() {
    let result = await this.common.getOrderNo("orderNoCreateKey");
    if (result) {
      return result.orderNo
    }

  }

  nextInputFocus() {
    if (this.selectedValue == PriceWayEnum.PIECE) {
      this.quantityInput.nativeElement.focus();
    } else {
      this.weightInput.nativeElement.focus();
    }
  }

  async orderPay() {
    if (!this.orderPayCheck()) {
      return;
    }
    let result = await this.empService.orderPay(this.order);
    if (result) {
      this.orderInfoClear();
      this.state = View.ListParams;
      this.isConfirmLoading = false;
      this.nzMessage.info(result.msg);

    }
  }

  async orderCreate() {
    this.isConfirmLoading = true;
    this.order.sellerMemNo = this.sellerMember.no
    this.order.cardNo = this.cardNo
    this.order.mktId = this.storage.employee.mktId
    this.order.transAreaId = this.selectedTransAreaId
    this.order.totalWeight = this.totalWeight
    this.order.buyerCustId = this.buyerCustomer.id
    this.order.buyerMemId = this.buyerMember.id
    this.order.apAmt = this.amount
    this.order.payType = PayTypeEnum.FS_IC
    this.order.createWay = CreateWayEnum.WEB
    this.order.orderDetails = this.orderDetails
    if (!this.oderCreateCheck()) {
      return;
    }
    let result = await this.empService.orderCreate(this.order);
    if (result) {
      this.order = result.order
      this.isConfirmLoading = false
      this.state = View.OrderPay
    }

  }
  orderPayCheck() {
    this.flag = false;
    if (this.amount <= 0) {
      this.nzMessage.info("订单金额小于或等于0！");
      return this.flag;
    }
    if (!this.order.payPassword) {
      this.nzMessage.info("支付密码为空！");
      return this.flag;
    }
    if (!this.order.orderNo) {
      this.nzMessage.info("订单号为空！");
      return this.flag;
    }
    this.flag = true;
    return this.flag;
  }

  oderCreateCheck() {
    this.flag = false;
    if (this.amount <= 0) {
      this.nzMessage.info("订单金额小于或等于0！");
      return this.flag;
    }
    // if (!this.orderNo) {
    //   this.nzMessage.info("订单号不能为空！");
    //   return this.flag;
    // }
    if (this.buyerMember.status != CommonStatusEnum.ENABLE) {
      this.nzMessage.info("买家会员状态异常！");
      return this.flag;
    }
    if (this.subtractMoney < 0) {
      this.nzMessage.info("买家余额不足！");
      return this.flag;
    }
    if (!this.order.transAreaId) {
      this.nzMessage.info("请选择交易区！");
      return this.flag;
    }
    if (!this.order.sellerMemNo) {
      this.nzMessage.info("卖家会员编号为空！");
      return this.flag;
    }
    if (this.order.orderDetails.length == 0) {
      this.nzMessage.info("商品明细为空");
    }
    this.flag = true;
    return this.flag;

  }
  orderInfoClear() {
    this.order = {}
    this.orderDetail = {}
    this.orderDetails = []
    this.account = {}
    this.buyerMember = {}
    this.cardNo = ""
    this.editCache = {}
    this.amount = 0
    this.prodCatalog = {}
    this.product = {}
    this.products = []
  }

  async queryByOrderNoInfo() {
    let result = await this.empService.findOrderByOrderNo(this.orderNo);
    if (result) {
      this.order = result.order
      this.order.orderDetails.forEach(item => {
        this.product = {}
        this.product.ProdCatId = item.prodCatId
        this.product.name = item.prodCatName
        this.product.pcsWgt = item.pcsWgt
      });
    }
  }

  resetPayInfo() {

  }

}
