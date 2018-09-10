import { Component, OnInit } from '@angular/core';
import { Order, Member } from 'share_platform/market/entity';
import { EmpService } from '../../../lib';
import { NzMessageService } from 'ng-zorro-antd';
import { OrderStatusEnum } from 'share_platform/market/enum';

@Component({
  selector: 'app-refund',
  templateUrl: './refund.component.html',
  styleUrls: ['./refund.component.css']
})
export class RefundComponent implements OnInit {
  orderNo: string;
  refundOrder: Order = {}
  sellerMember: Member = {}
  buyerMember: Member = {}
  constructor(public empService: EmpService, public nzMessage: NzMessageService) { }

  ngOnInit() {
  }


  async queryOrder() {
    let result = await this.empService.findOrderByOrderNo(this.orderNo);
    if (result) {
      this.refundOrder = result.order
      this.sellerMember = result.sellerMember
      this.buyerMember = result.buyerMember
    }
  }

  async orderRefund() {
    let result = await this.empService.orderRefund(this.orderNo, OrderStatusEnum.REFUNDED)
    if (result) {
      this.nzMessage.info(result.msg);
    }
  }

  resetPayInfo() { }

}
