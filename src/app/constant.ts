export enum MenuType {
  Market = 1,
  GroupCompany,
  Develop
}
export enum RoleType {
  GroupCompany = 1,
  Market
}

export enum EmployeeType {
  GroupCompany = 1,
  Market = 2
}
export enum ParamType {
  Text = 1,
}

export enum MarketStatus {
  Disabled = 0,
  Active = 1
}
export enum EmployeeStatus {
  Disabled = 0,
  Active = 1
}

export enum CardStatus {
  Enable = "ENABLE",
  Disabled = "DISABLE",
  Cancel = "CANCEL",
  Active = "ACTIVE",
  Frozen = "FROZEN"
}

export enum BusinessType {
  Recharge = "001",
  WithDraw = "002",
}