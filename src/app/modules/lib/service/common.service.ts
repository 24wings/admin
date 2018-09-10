import { Injectable } from "@angular/core";
import { MyHttpService } from "./http.service";
import { MenuType } from "../../../constant";
import { Menu, MenuService } from '@delon/theme';
import { NzTreeNode } from "ng-zorro-antd";
import { StorageService } from "./storage.service";
import { QueryObject, QueryCondition, QueryParameter, PageParameter } from "share_platform/framework/util";
import { EntityEnum } from "../../../entity.enum";
import { MetaObjectDataRq } from "../../../share_platform/market/MetaObjectDataRq";
import { MetaObject } from "share_platform/framework/entity";


@Injectable()
export class CommonService {



  phoneReg: RegExp = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
  defaultUserAvatar = "/assets/images/123.jpg";
  public commonApi = {
    /**
     * get
     *  ?className  
    */
    entityMeta: "/app/stq/entity/meta",
    /**
     * post
     * ?className
     * body:QueryParameter
     */
    entityQuery: "/app/stq/entity/query",
    /**
     * post
     * ? className
     * body :metaobjectrq
     */
    entityUpdate: "/app/stq/entity/update",
    /**
     * post
     * ?className
     * body:metaObjectRq
     */
    entityInsert: "/app/stq/entity/insert",
    /**
     * post
     * ? className
     * body:metaObjectRq
     */
    entityDelete: "/app/stq/entity/delete",
    getQrcode: "/common/qrcode",
    uploadImage: "/common/upload-image",
    uploadFile: "/common/upload/file",
    localCityJson: '/assets/city.json',
    getOrderNo: '/api/public/getOrderNo',
    singleTableQuery: "/app/stq/query"
  };

  /**
   * get
   *  ?className  
  */
  entityMeta(className: string): Promise<MetaObject> {
    return this.http.Get(this.commonApi.entityMeta, { params: { className } }).then(res => res.metaObject);
  }
  /**
   * post
   * ?className
   * body:QueryParameter
   */
  entityQuery(className: string, queryParameter: QueryParameter) {
    return this.http.Post(this.commonApi.entityQuery, queryParameter, { params: { className } })
  }

  /**
  * post
  * ? className
  * body :metaobjectrq
  */
  entityUpdate(className: string, metaObjectRq: MetaObjectDataRq) {
    return this.http.Post(this.commonApi.entityUpdate, metaObjectRq, { params: { className } });
  }
  /**
   * post
   * ?className
   * body:metaObjectRq
   */
  entityInsert(className: string, metaobjectrq: MetaObjectDataRq) {
    return this.http.Post(this.commonApi.entityInsert, metaobjectrq, { params: { className } });
  }
  /**
   * post
   * ? className
   * body:metaObjectRq
   */
  entityDelete(className: string, metaObjectRq: MetaObjectDataRq) {
    return this.http.Post(this.commonApi.entityDelete, metaObjectRq);
  }

  singleTableQuery(className: EntityEnum, queryObject: QueryObject | QueryObject[]): Promise<{ paging: { count: number, rows: any[] } }> {
    let queryParameter = this.getQueryParameter(queryObject);
    return this.http.Post(this.commonApi.singleTableQuery, queryParameter, { params: { className } });
  }

  /**
  .get("/common/qrcode", common.getQrcode)
  .post("/common/qrcode", common.getQrcode)
  .get("/wechat/ticket", common.getTicket)
  .get("/common/wechat/ticket", common.getTicket)
  .post("/common/upload/image", common.uploadBase64Test)
  .get("/common/send-auth-code", common.sendAuthCode);
 */
  checkPhone(phone: string) {
    return this.phoneReg.test(phone)
  }

  resetMenu(menus: IMenu[]) {
    menus = menus.filter(menu => menu.link || !menu.parentId)
    for (let menu of menus) {
      delete menu.externalink;
      delete menu.target;
    }
    let childMenus = this.getMenuTree(menus as any) as Menu[];
    this.menu.clear();
    let totalMenus = [{
      text: "",
      group: true,
      children: childMenus
    }]
    this.menu.add(totalMenus);
  }
  checkMenuCodeExisit(menuCode): boolean {
    return !!this.storage.menuList.find(menu => menu.menuCode == menuCode);
  }

  async getOrderNo(key: string) {
    return this.http.Get(this.commonApi.getOrderNo, { params: { key } })
  }

  localCityJson() {
    return this.http.localGetJSON(this.commonApi.localCityJson)
  }
  getQrcode(url) {
    return this.http.Get(this.commonApi.getQrcode, { params: { url } });
  }
  uploadImage(base64: string): Promise<any> {
    return this.http.Post(this.commonApi.uploadImage, { base64 });
  }

  /**
   *
   * @param url   file
   *
   * @param outputFormat string
   *
   * 将文件转成base64
   */
  compressBase64(
    base64: string,
    maxsize: number = 40000,
    outputFormat = "image/png"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      var img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = function () {
        var width = img.width;
        var height = img.height;
        let compress = 1;
        let rate = 1;
        if (width * height > maxsize) {
          rate = Math.ceil(width * height / 40000);
        }
        compress = 1 / rate;
        canvas.width = width * compress;
        canvas.height = height * compress;
        ctx.drawImage(
          img,
          0,
          0,
          width,
          height,
          0,
          0,
          width * compress,
          height * compress
        );
        let compressData = canvas.toDataURL(outputFormat);
        resolve(compressData);
      };
      img.src = base64;
    });
  }

  convertFileToBase64(file: File): Promise<string> {
    let reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = e => {
        let base64: string = <string>e.target["result"];
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  }

  // 自动化创建文件文本框,并选择读取base64,可以自定义压缩
  selectFile(): Promise<string> {
    return new Promise(resolve => {
      let fileInputEle = document.createElement("input");
      fileInputEle.type = "file";
      let reader = new FileReader();
      reader.onload = event => {
        let base64 = <any>event.target["result"];
        resolve(base64);
      };

      fileInputEle.onchange = event => {
        reader.readAsDataURL(fileInputEle.files[0]);
      };
      fileInputEle.click();
    });
  }

  menuCategory(menus: IMenu[]) {
    let marketCategory: IGroup[] = [];
    let groupCompanyCategory: IGroup[] = [];
    let devCategory: IGroup[] = [];
    menus.forEach(menu => {
      if (menu.menuType == MenuType.Market) {
        let exist = marketCategory.find(marketGroup => marketGroup.menuId == menu.menuId);
        if (!exist) {

        }
      }
    })


  }
  getMenuGroup(menus: Menu): Menu[] {
    let menuGroups: Menu[] = [];
    menus.forEach(menu => {
      let isChild = menus.find(
        mcurrent => mcurrent.menuId == menu.menuId && menu.menuId != 0
      );
      /**
       * 属于子模块并且子模块已存在分组中
       * 此时
       *
       */

      let existGroup = menuGroups.find(
        group => group.menuId == menu.parentId
      );
      menuGroups.find(group => {
        // console.log(group.id, modu.id);
        return group.menuId == menu.menuId;
      });
      // ), groups)};
      if (isChild && existGroup) {
        // console.log(`pushc child`);
        existGroup.children.push({
          text: menu.text,
          label: menu.text,
          menuId: menu.menuId,
          link: menu.link,
          checked: !!menu.checked,
          icon: menu.icon
        });
      } else {
        menuGroups.push({
          text: menu.text,
          menuId: menu.menuId,
          group: true,

          checked: !!menu.checked,
          icon: menu.icon,

          checkdAll: false,
          children: []
        });
        console.log(menuGroups);
      }
    });
    return menuGroups;
  }
  getMenuTree(menus: IMenu[]): IMenu[] {
    let treeMenus: IMenu[] = [];
    /** 扫出顶级菜单,若存在下级菜单递归扫下级菜单 */
    if (menus.some(menu => menu.parentId == 0 || !menu.parentId)) {
      treeMenus = menus.filter(menu => menu.parentId == 0 || !menu.parentId);
      for (let menu of treeMenus) {
        menu.children = this.getMenuChildren(menu, menus);
      }

    }
    return treeMenus;
  }
  getMenuNzTreeNode(menus: IMenu[]): NzTreeNode[] {
    let trees = this.getMenuTree(menus);
    let nodes: NzTreeNode[] = [];
    nodes = trees.map(tree => new NzTreeNode({ key: tree.menuId + '', title: tree.text, checked: false }));
    nodes.forEach(node => {
      node.addChildren(this.getNzTreeNodeChildren(node, menus));
    })
    return nodes;
  }
  private getNzTreeNodeChildren(parentNode: NzTreeNode, menus: IMenu[]): NzTreeNode[] {
    let children: NzTreeNode[] = menus.filter(menu => parentNode.key == menu.parentId + '').map(menu => {
      return {
        title: menu.text,
        key: menu.menuId,
        isChecked: false,
        level: 0,
        children: [],
        isLeaf: !menu.link, origin: menu
      } as any
    });
    for (let subNode of children) {
      subNode.children = this.getNzTreeNodeChildren(subNode, menus);
    }
    return children;

  }
  private getMenuChildren(parentMenu: IMenu, menus: IMenu[]): IMenu[] {
    let children = menus.filter(menu => menu.parentId == parentMenu.menuId);
    for (let submenu of children) {
      submenu.children = this.getMenuChildren(submenu, menus);
    }
    return children;

  }
  getModuleGroup(modules: IMenu[]) {
    let groups: IGroup[] = [];

    modules.forEach(modu => {
      let isChild = modules.find(
        mcurrent => mcurrent.menuId == modu.menuId && modu.menuId != 0
      );
      /**
       * 属于子模块并且子模块已存在分组中
       * 此时
       *
       */

      let existGroup = groups.find(
        group => group.menuId == modu.parentId
      );
      groups.find(group => {
        // console.log(group.id, modu.id);
        return group.menuId == modu.menuId;
      });
      // ), groups)};
      if (isChild && existGroup) {
        // console.log(`pushc child`);
        existGroup.children.push({
          text: modu.text,
          label: modu.text,
          menuId: modu.menuId,
          link: modu.link,
          checked: !!modu.checked,
          icon: modu.icon
        });
      } else {
        groups.push({
          text: modu.text,
          menuId: modu.menuId,

          checked: !!modu.checked,
          icon: modu.icon,

          checkdAll: false,
          children: []
        });
        console.log(groups);
      }
    });
    return groups;
  }
  getCheckedMenuIds(groups: IGroup[]): number[] {
    console.log(groups)
    let gcMenuIds = [];
    groups.forEach(group => {
      if (group.checked || group.indeterminate) {
        gcMenuIds.push(group.menuId);
        if (group.children) {
          group.children.forEach(menu => {
            menu.checked ? gcMenuIds.push(menu.menuId) : '';
          })
        }
      }
    })
    return gcMenuIds;
  }
  menuIdsToMenus(menuIds: number[], menus: IMenu[]): IMenu[] {
    return menuIds.filter(id => id).map(id => menus.find(menu => menu.menuId == id));
  }
  getQueryParameter(queryObject: QueryObject | QueryObject[], pageParameter?: PageParameter): QueryParameter {


    let conditions: QueryCondition[] = [];
    if (Array.isArray(queryObject)) {
      conditions = QueryObject.Or(queryObject)
    } else {
      conditions = QueryObject.toQueryContions(Object.assign(queryObject, new QueryObject()));
    }
    console.log(conditions)
    return { queryConditions: conditions, pageParameter: pageParameter ? pageParameter : new PageParameter(), queryAttributes: [] }
  }



  constructor(public http: MyHttpService, public menu: MenuService, public storage: StorageService) {
    // this.getQueryParameter([{ mktId: 1, name: 2, code: 3 }, { menuCode: "2", commonName: "3" }])
  }
}
