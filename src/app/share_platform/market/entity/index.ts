import { User } from "../../framework/entity";
import { PayFeeRecordEnum } from "../../framework/enum";
import { AccountTypeEnum, AccountStatusEnum, OrderTypeEnum, MsgTypeEnum, PriceUnitEnum, CustCardStatusEnum, CustomerStatusEnum, CreateWayEnum, CertificateWayEnum, OrderStatusEnum, PayTypeEnum, MemberTypeEnum } from "../enum";
import { Feelist } from "share_platform/market/entity";

export class Account {
    id?: number;

    no?: string;     //账户号
    name?: string;    //账户名
    balAmt?: number;  //账户余额(可用金额+未结算金额)
    availAmt?: number;  //可用金额
    frozenAmt?: number;  //冻结金额

    accountType?: AccountTypeEnum;//账户类型
    status?: AccountStatusEnum;
    remark?: string;    //备注

    mktId?: number;//所属市场id
    createTime?: Date;//创建时间 
}
export class AccountDebt {
    id?: number;
    debtNo?: string;  //欠款流水号
    debteeAccId?: number;  //债权人账户Id
    debteeAccName?: number;  //债权账户Id
    debtorAccId?: number;  //债务账户Id
    debtorAccName?: string;  //债务账户名称
    debtAmt?: number;    //欠款金额
    repayAmt?: number;    //已还金额
    orderType?: OrderTypeEnum;    //订单类型
    orderNo?: string;    //订单编号
    remark?: string;    //备注
    createTime?: Date;    //创建时间
    RepaymentDays?: number;  //账期
    mktId?: number;//所属市场id
}
export class AccountRepay {
    id?: number;
    repayNo?: string;  //欠款流水号
    deptId?: number;
    repayAmt?: number;    //还款金额
    confirmed?: boolean;          //是否同意
    orderType?: OrderTypeEnum;    //订单类型
    orderNo?: string;    //订单编号
    remark?: string;    //备注
    createTime?: Date;    //创建时间
    confirmTime?: Date;    //确认时间
    mktId?: number;//所属市场id
}
export class AccRecvPay {
    id?: number;

    recvPayNo?: string;  //收支流水号
    accountId?: number;  //账户Id
    accountName?: number;  //账户Id
    toAccountId?: number;  //对方账户Id
    toAccountName?: number;  //对方账户名称

    io?: number;//收支方向
    subjectId?: number;    //收支科目
    subjectName?: string;    //收支科目
    amount?: number;    //收支金额
    balAmt?: number;  //账户余额(可用金额+未结算金额)
    availAmt?: number;  //可用金额
    frozenAmt?: number;  //冻结金额

    orderType?: OrderTypeEnum;    //订单类型
    orderNo?: string;    //订单编号
    remark?: string;    //备注
    createTime?: Date;    //创建时间
    mktId?: number;//所属市场id
}
export class AppMsgNotify {
    id?: number;
    mktId?: number;//所属市场id,为空时是平台级消息
    custId?: number;//发给app用户,为空时不限制Customer
    memberId?: number;//发给会员,为空时不限制会员

    msgType?: MsgTypeEnum;//消息类型

    title?: string;//消息摘要

    content?: string;//消息内容
    addition?: string;//附加内容
    createTime?: Date;//创建时间
    creatorId?: number;//创建人Id
    creator?: string;//创建人姓名
}
export class OrderNo {
    id?: number;
    currentKey?: string;
    currentValue?: number;
}
export class OssFile {
    fileId?: number;
    fileName?: string;
    fileUrl?: string;
}
export class ProdCatalog {
    id?: number;

    catName?: string;
    parentId?: string;
    isShow?: boolean;

    catCode?: string;
    txnId?: number;
    mktId?: number;
    linkCatCode?: string;
}
export class Product {
    id?: number;

    prodCat?: ProdCatalog;
    ProdCatId?: number;//日志类型
    catCode?: string;
    name?: string;//操作类型
    price?: number;
    createTime?: Date;//创建时间
    priceUnit?: PriceUnitEnum;//计价单位
    pcsWgt?: number;//单件重量
    quantity?: number;
    amout?: number;
    memberId?: number;//所属会员
    custId?: number;//创建者Id
}
export class RecPaySubject {
    subjectId?: number;

    subjectName?: string;
    parentId?: number;

    subCode?: number;
    subLinkId?: number;
    mktId?: number;
}
export class SMSLog {
    id?: number;

    isVerifySms?: boolean;//是否验证码短信
    verifyCode?: string;//验证码
    verifyType?: string;//验证类型
    mobi?: string;//手机号
    content?: string;//短信内容
    createTime?: Date;//创建时间
    mktId?: number;
    smsSupplier?: string;//短信服务商
}
export class CustCard {
    id?: number;
    no?: string;

    status?: CustCardStatusEnum;
    mktId?: number;//所属市场id
    createTime?: Date;//创建时间
    creatorId?: number;//创建人id
    creator?: string;//创建人

}
export class Customer {
    id?: number;
    name?: string;
    mobi?: string;//手机号
    password?: string;//登陆密码
    pwdEncrypted?: boolean;//密码是否已加密
    avatarUrl?: string;//头像URL
    cardId?: number;

    memberId?: number;//所属会员id
    card?: CustCard;//当前卡
    disabledMsgTypes?: string;//

    status?: CustomerStatusEnum;

    createWay?: CreateWayEnum;//创建途径

    mktId?: number;//所属市场id
    createTime?: Date;//创建时间
    creatorId?: number;//创建人Id
    creator?: string;//创建人
    member?: Member;
}
export class Member {
    id?: number;

    no?: string;     //会员编号
    name?: string;    //会员名
    idCardNo?: string;    //身份证号
    idcardImgUrl?: string;//身份证照片
    memberType?: MemberTypeEnum;
    legalName?: string;    //法人姓名
    coLicImgUrl?: string;//公司营业执照照片
    taxNo?: string;
    address?: string;
    phoneNo?: string;

    status?: AccountStatusEnum;//会员状态

    createWay?: CreateWayEnum;//创建途径

    mktId?: number;//所属市场id
    createTime?: Date;//创建时间
    creatorId?: number;//创建人id
    creator?: string;//创建人
    payPassword?: string;//支付密码
    pwdEncrypted?: boolean;//密码是否已加密
    certificated?: boolean;//是否已经实名认证
    certTime?: Date;//实名认证时间

    certWay?: CertificateWayEnum;//实名认证方法
    certLog?: string;//实名认证日志


    mobi?: string;//冗余字段mobi

    customerId?: number;//会员对应customer
    memberAccounts?: MemberAccount[];  //账户列表

    customers?: Customer[];

    accounts?: Account[];
}
export class MemberAccount {
    id?: number;

    memberId?: number;
    AccountNo?: string;
    member?; Member;
}
export class MemberInvite {
    id?: number;
    content?: string;     //会员编号
    sendCustId?: string;    //会员名
    RecvCustId?: string;    //身份证号
    confirmed?: boolean;//是否同意
    mktId?: number;//所属市场id
    createTime?: Date;//创建时间
    confirmTime?: Date;//确认时间
}

export class PayFeeList {
    payFeeListId?: number;

    recordId?: number;

    chargeEpId?: number;

    payFeeUserId?: number;

    mktId?: number;

    feeListId?; number;
    status?: string;
    payfeeRecord?: PayFeeRecord;
    feelist?: Feelist;
}
export class PayFeeRecord {
    recordId?: number;
    title?: string;
    shouldChargeMoney?: number;
    realChargeMoney?: number;
    createTime?: Date;

    mktId?: number;

    subjectId?: number;

    payFeeMemberId?: number;

    status: PayFeeRecordEnum
}
export class TransArea {
    txnId?: number;
    mktId?: number;
    txnCode?: string;
    txnName?: string;

}
export class Order {
    id?: number;
    orderNo?: string;

    buyerMemId?: number;//买方id
    buyerCustId?: number;//买方操作员
    buyerInfo?: string;//匿名买方信息

    sellerMemNo?: string;//卖方编号
    sellerCustId?: number;//买方操作员

    apAmt?: number;//应付货款
    payAmt?: number;//交易货款
    buyerFee?: number;//买方手续费
    sellerFee?: number;// 卖方手续费

    payType?: PayTypeEnum;//支付方式

    status?: OrderStatusEnum;//订单状态
    createWay?: CreateWayEnum
    mktId?: number;//所属市场id
    createTime?: Date;//创建时间
    creatorId?: number;//创建人Id
    creator?: string;//创建人

    actTime?: Date;//结算时间
    actorId?: number;//结算员Id
    actor?: string;//结算员
    remark?: string;
    orderDetails?: OrderDetail[];
}
export class OrderDetail {
    id?: number;
    order?: Order;
    orderId?: number;
    productId?: number;
    productName?: string;
    prodCatCode?: string;

    qty?: number;
    pcsWgt?: number;//件重
    grossWgt?: number;//毛重
    tareWgt?: number;//皮重
    weight?: number;
    price?: number;
    amount?: number;
    priceUnit?: PriceUnitEnum;
}
export class RechargeWithDraw {
    id?: number;
    billNo?: string;
    businessType?: string;
    payType?: string;
    memberId?: number;
    customerId?: number;
    amout?: number;
    afterBalAmt?: number;
    mktId?: number;
    createTime?: Date;
    creator?: string;
    creatorId?: number;

    actTime?: Date;
    actorId?: number;
    actor?: string;
    remark?: string;
    cardNo?: string;
    payPassword?: string;
}
