import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgPageComponent } from './pages/org-page/org-page.component';
import { RouterModule } from '@angular/router';

import { LibModule } from '../lib';
import { RolePageComponent } from './pages/role-page/role-page.component';
import { EmpPageComponent } from './pages/emp-page/emp-page.component';
import { GlobalPageComponent } from './pages/global-page/global-page.component';
import { LocalPageComponent } from './pages/local-page/local-page.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { registerLocaleData } from "@angular/common";
import { ModifyPasswordPageComponent } from "./pages/modify-password-page/modify-password-page.component"
import zh from "@angular/common/locales/zh";
import { CommodityTypeComponent } from './pages/commodity-type/commodity-type.component';
import { SubjectComponent } from './pages/subject/subject.component';
import { TxnareaComponent } from './pages/txnarea/txnarea.component';
import { MemberComponent } from './pages/member/member.component';
import { FeeListComponent } from './pages/fee-list/fee-list.component';
import { MemberDetailComponent } from './pages/member-detail/member-detail.component';
import { RechargeComponent } from './pages/recharge/recharge.component';
import { WithdrawComponent } from './pages/withdraw/withdraw.component';
import { ExchangeComponent } from './pages/exchange/exchange.component';
import { SharedModule } from '@shared/shared.module';
import { MemberRealnameAuthPageComponent } from './pages/member-realname-auth-page/member-realname-auth-page.component';
import { PayFeeRecordPageComponent } from './pages/pay-fee-record-page/pay-fee-record-page.component';
import { RefundComponent } from './pages/refund/refund.component';
import { TransFeeRuleComponent } from './pages/trans-fee-rule/trans-fee-rule.component';

registerLocaleData(zh);
@NgModule({
  imports: [
    SharedModule,
    CommonModule,

    NgZorroAntdModule.forRoot(),
    FormsModule, ReactiveFormsModule,
    LibModule.forRoot(),

    RouterModule.forChild([

      { path: "emp", component: EmpPageComponent, data: { title: '员工管理' } },
      { path: "role", component: RolePageComponent, data: { title: '角色管理' } },
      { path: "org", component: OrgPageComponent, data: { title: '组织管理' } },
      { path: "local", component: LocalPageComponent, data: { title: '本地参数管理' } },
      { path: "global", component: GlobalPageComponent, data: { title: '全局参数管理' }, },
      { path: "modify-password", component: ModifyPasswordPageComponent, data: { title: "修改密码" }, },

      { path: "subject", component: SubjectComponent, data: { title: "市场固定收支科目" } },

      { path: "txnarea", component: TxnareaComponent, data: { title: "交易区管理" } },
      { path: "txnarea/:txnId/commodity-type", component: CommodityTypeComponent, data: { title: "商品种类管理" } },
      { path: "member", component: MemberComponent, data: { title: "会员操作" } },
      { path: "fee-list", component: FeeListComponent, data: { title: "应收清单" } },
      { path: "payfee-list", component: PayFeeRecordPageComponent, data: { title: "费用清单" } },
      { path: "member/detail/:memberId", component: MemberDetailComponent, data: { title: "会员详情" } },
      { path: "recharge", component: RechargeComponent, data: { title: "会员充值" } },
      { path: "withdraw", component: WithdrawComponent, data: { title: "会员提现" } },
      { path: "exchange", component: ExchangeComponent, data: { title: "交易开单" } },
      { path: "transFeeRule", component: TransFeeRuleComponent, data: { title: "交易费率" } },
      { path: "refund", component: RefundComponent, data: { title: "订单退货" } }
    ]
    )
  ],
  declarations: [OrgPageComponent, RolePageComponent,
    MemberComponent,
    GlobalPageComponent, LocalPageComponent, SubjectComponent,
    MemberDetailComponent, RechargeComponent, WithdrawComponent,
    TransFeeRuleComponent, RefundComponent,
    ExchangeComponent, TxnareaComponent, CommodityTypeComponent,
    ModifyPasswordPageComponent, EmpPageComponent, FeeListComponent,
    MemberRealnameAuthPageComponent,
    PayFeeRecordPageComponent,
    RefundComponent

  ]
  ,
})
export class EmployeeModule { }
