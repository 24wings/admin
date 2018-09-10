declare var wx: any;
declare var WeixinJSBridge: any;
// import { IOrderState, ActionType, ShopKeeperBatType, FavoriteState, BillContent, BillType, IShopType, IShopKeeperBatType, IFavoriteState, IBillContent, IBillType } from './index';



/**用户分为两种 一种User 普通的个人用户 一种 商家  */
interface User {
    _id?: string;
    sex?: number;
    nickname?: string;
    avatar?: string;
    phone?: string;
    openid?: string;
    //优惠券

    password: string;
    headimgurl?: string;
    createDt?: string;
    lastModifyDt?: Date;

    //收货地址
    reciveName?: string;
    contactPhone?: string;
    reciveCity?: { name: string, code: string };
    detailAddress?: string;



}
