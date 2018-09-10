export enum AccountStatusEnum {

    ENABLE = "可用",
    DISABLE = "停用",
    FROZEN = "停用",
    CANCEL = "注销"
}
export enum MemberTypeEnum {
    PERSONAL = "个人",
    COMPANY = "企业"
}
export enum AccountTypeEnum {
    MARKET_MSG = "市场短信账户",
    MARKET_FEE = "市场手续费账户",
    MEMBER_CASH = "会员现金账户",
    MEMBER_SCORE = "会员积分账户",
    USER_CASH = "员工现金账户"
}
export enum CreateWayEnum {
    WEB = "",
    APP = "",
    POS = "",
}
export enum CustCardStatusEnum {
    ENABLE = "",
    DISABLE = "",
    CANCEL = "",
    ACTIVE = ""
}
export enum CustomerStatusEnum {

}
export enum MemberStatusEnum {
    ENABLE = "可用",
    DISABLE = "停用",
    FROZEN = "冻结",
    CANCEL = "注销"
}
export enum MsgTypeEnum {
    ACC_AMT = "",
    CUST_INVITE = "",
    REPAY_APPLY = "",
    REPAY_CONFIRM = "",
    TOBE_PAY = ""
}
export enum OrderStatusEnum {
    TEMP = "",
    TOBE_PAY = "",
    CLOSED = "",
    PAID = "",
    RETURNED = ""
}
export enum OrderTypeEnum {
    TRANS = "",
    RENTS = ""
}
export enum ParamsTypeEnum {
    TEXT,
    IMAGE,
    SELECT,
    SWITCH
}
export enum PayTypeEnum {
    WX_C2B,
    ALI_C2B,
    WX_B2C,
    ALI_B2C,
    POS_PAY,
    FS_C2B,
    FS_B2C,
    FS_IC,
    FS_CREDIT
}
export enum CertificateWayEnum {

}
export enum PriceUnitEnum {
    KG = "KG",
    JIN = "JIN",
    PCS = "PCS",
}