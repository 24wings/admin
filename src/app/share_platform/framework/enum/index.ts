export enum UserStatusEnum {
    Active = "active",
    Disabled = "disabled",
    Frozen = "frozen"
}

export enum MarketStatusEnum {
    Active = "active",
    Disabled = "disabled",
    /** 冻结*/
    Frozen = "frozen"//冻结
}
export enum ParamsTypeEnum {
    Text = "text",
    Input = "input",
}
export enum ParamsIsLocalEnum {
    /**全局 */
    Gloab = "gloab",
    /**本都 */
    Local = "local"
}
/**日志类型 */
export enum UserLogTypeEnum {

}
export enum PayFeeRecordEnum {
    Active = "active",
    /**延期 */
    Delay = "delay",
    Unactive = "unactive",
    Undisable = "undisable"
}
