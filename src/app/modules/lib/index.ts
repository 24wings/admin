export * from "./lib.module";
export * from "./service";

export { ImageViewerDirective } from "./directive/image-viewer.directive";

export enum BillType {
  Person = 1,
  Company
}
export type IBillType = BillType;

/**发票内容   详情   无需发票 */
export enum BillContent {
  Detail = 1,
  No
}

export type IBillContent = BillContent;

export enum FavoriteState {
  UnFavorite = 1,
  HadFavorite = 2
}
export type IFavoriteState = FavoriteState;

export enum ShopKeeperBatType {
  Region = 1,
  //厂家批发
  Origin,
  Town
}
export type IShopKeeperBatType = ShopKeeperBatType;
export enum ShopType {
  // 厂家批发
  FactoryBat = 1,
  //省城批发
  RegionBat,
  //本地批发
  LocalBat
}
export type IShopType = ShopType;

// 订单状态
export enum FruitOrderState {
  UnConfirm,
  SendProduct,
  //  订单确认后取消的原因
  ReciveProduct,
  Cancel,
  // 从购物车中移除
  Remove,
  Finish
}

// export adminApi
export let bangweiShopAdminApi = {
  productGroup: {
    list: "/bangwei-shop/admin/list-product-groups",
    create: "/bangwei-shop/admin/create-product-group",
    update: "/bangwei-shop/admin/update-product-group",
    delete: "/bangwei-shop/admin/delete-product-group"
  },
  product: {
    list: "/bangwei-shop/admin/list-products",
    search: "/bangwei-shop/admin/search-product",
    create: "/bangwei-shop/admin/create-product",
    delete: "/bangwei-shop/admin/delete-product",
    update: "/bangwei-shop/admin/update-product",
    active: "/bangwei-shop/admin/active-product",
    unactive: "/bangwei-shop/admin/unactive-product"
  },
  reduction: {
    list: "/bangwei-shop/admin/list-reductions",
    create: "/bangwei-shop/admin/create-reduction",
    update: "/bangwei-shop/admin/update-reduction",
    delete: "/bangwei-shop/admin/delete-reduction"
  },
  user: {
    list: "/bangwei-shop/admin/list-users",
    create: "/bangwei-shop/admin/create-user",
    update: "/bangwei-shop/admin/update-user",
    delete: "/bangwei-shop/admin/delete-user"
  }
};

export enum BangweiOrderState {
  Unpay = 1,
  SendProduct, //代发货
  Finish, // 确认收货
  Commented, // 已经评论
  Cancel, // 订单待支付取消
  WaitReciveProduct, // 代收获
  SendProductCancel, // 代发货取消
  WaitProductCancel, // 待收货取消
  ReciveCancel, // 已收货取消
  Close, // 订单奖金派发完毕
  RequestRefound // 商户申请退款
}




