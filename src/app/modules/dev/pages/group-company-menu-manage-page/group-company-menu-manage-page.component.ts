import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd } from '@angular/router';
import { NzTreeNode, NzTreeNodeOptions, NzMessageService } from 'ng-zorro-antd';
import { MenuType } from '../../../../constant';
import { DevService, CommonService, StorageService } from '../../../lib';


enum ViewState {
  List = 1,
  Create,
  Update
}
@Component({
  selector: 'app-group-company-menu-manage-page',
  templateUrl: './group-company-menu-manage-page.component.html',
  styleUrls: ['./group-company-menu-manage-page.component.css']
})
export class GroupCompanyMenuManagePageComponent implements OnInit {

  gcId: number;
  marketId: number;
  showMenuTabIndex: number = 0;
  groups: IGroup[] = []
  menus: IMenu[] = [];
  market: IMarket;
  showTabGroups: IGroup[] = []
  optionParentMenus: IMenu[] = [];
  newMenuIds: number[];

  state: ViewState = ViewState.List;
  isExteralLink: boolean = false;
  ViewState = ViewState;


  isVisible: boolean = false;
  // new
  nodes: NzTreeNode[] = [];
  selectedMenu: IMenu;
  checkedKeys: String | number[]
  constructor(
    public dev: DevService,
    public common: CommonService,
    public storage: StorageService,
    public route: ActivatedRoute,
    public message: NzMessageService
  ) {

  }

  async ngOnInit() {
    this.marketId = this.route.snapshot.params.marketId
    await this.getMenuList();
  }

  async  getMenuList() {
    let result = await this.dev.marketMenuList();

    this.market = await this.dev.marketDetail(this.marketId);


    this.nodes = this.common.getMenuNzTreeNode(result.menus.rows)


    for (let node of this.nodes) {
      while (node.getChildren().length > 0) {
        let subNodes = node.getChildren();
        node.isChecked = subNodes.every(subNode => subNode.isChecked);
        break;
      }
    }

    console.log(this.market.menuIds)


    let bottomChildren =
      (result.menus.rows as IMenu[])
        .filter(menu =>
          (result.menus.rows as IMenu[]).find(item => menu.parentId == item.menuId)
          && !(result.menus.rows as IMenu[]).some(item => menu.menuId == item.parentId));
    // console.log(bottomChildren);
    // console.log(this.market)
    this.checkedKeys = bottomChildren.filter(child => (this.market.menuIds as number[]).find(menuId => menuId == child.menuId)).map(child => child.menuId);



  }

  async  mouseAction(name: string, e: any) {
    this.selectedMenu = await this.dev.menuDetail(e.node.key);
    if (typeof this.selectedMenu.config == 'object') {
      this.selectedMenu.config = JSON.stringify(this.selectedMenu.config);
    }
  }
  async updateGroupCompanyMenus() {

    let checkedIds = []
    for (let node of this.nodes) {
      checkedIds.push(this.getCheckedMenuIds(node as any));
    }
    this.market.menuIds = checkedIds
    let result = await this.dev.marketUpdate(this.market);
    if (result) {
      await this.getMenuList();
      this.message.success("更新成功")
    } else {
      this.message.error("更新失败")
    }
  }
  getCheckedMenuIds(menu: NzTreeNode | NzTreeNodeOptions): string[] {
    let checkedMenuIds: string[] = [];
    if ((menu as NzTreeNode).isChecked || (menu as NzTreeNode).isHalfChecked || (menu as NzTreeNodeOptions).checked) checkedMenuIds.push(menu.key);
    if (menu.children.length > 0) {
      for (let child of menu.children) {
        checkedMenuIds.push(...this.getCheckedMenuIds(child));
      }
    }
    return checkedMenuIds;
  }
  updateAllChecked(group): void {
    group.indeterminate = false;
    if (group.children.every(group => group.checked)) {
      group.children.forEach(item => (item.checked = false));
      group.checked = false;
    } else {
      group.children.forEach(item => (item.checked = true));
      group.checked = true;
    }
  }

  updateSingleChecked(group: IGroup): void {
    if (
      group.children.every(group => group.checked) ||
      group.children.every(group => !group.checked)
    ) {
      group.checked = group.children.every(child => child.checked);
      group.indeterminate = false;
    } else {
      group.indeterminate = true;
    }
  }
}


