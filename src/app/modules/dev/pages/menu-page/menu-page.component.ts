import { Component, OnInit } from '@angular/core';
import { NzTreeNode } from 'ng-zorro-antd';
import { MenuType } from '../../../../constant';
import { DevService, CommonService, StorageService } from '../../../lib';
import { NzMessageService } from 'ng-zorro-antd';

enum ViewState {
  List = 1,
  Create,
  EditGroup,
  EditMenu
}
enum MenuViews {
  Market,
  Develop
}
@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {
  menuView = MenuViews.Develop;
  MenuViews = MenuViews;
  expandDefault = false;
  nodes: NzTreeNode[] = [];

  showMenuTabIndex: number = 0;
  selectedMenu: IMenu;
  selectedGroup: IGroup
  tabs = [
    {
      active: true,
      name: '组织',
      icon: 'anticon anticon-apple'
    },
    {},

    {
      active: false,
      name: '开发者',
      icon: 'anticon anticon-android'
    }
  ];
  groups: IGroup[] = []
  menus: IMenu[] = [];
  showTabGroups: IGroup[] = []
  optionParentMenus: IMenu[] = [];

  state = ViewState.List;
  isExteralLink: boolean = false;
  ViewState = ViewState;
  externalOpenOptions: { label: string, value: string }[] = [
    { label: '新空白页', value: "_blank" },
    { label: '当前页', value: "_self" },
    { label: "父页面", value: "_parent", },
    { label: "顶级页面", value: "_top" }
  ]

  isVisible: boolean = false;
  newMenu: IMenu = {
    text: '默认菜单',
    target: '_blank',
    externalink: '',
    badgeDot: false,
    link: '/',
    menuType: MenuType.Develop,
    config: '{}',
    parentId: 0,
  }
  constructor(public storage: StorageService,
    public dev: DevService,
    public message: NzMessageService,
    public common: CommonService,
    private nzMessageService: NzMessageService) { }

  ngOnInit() {
    this.getMenuList()
  }
  // 取消删除
  cancel(): void {
    this.nzMessageService.info('click cancel');
  }
  async  createMenu() {
    console.log(this.showMenuTabIndex);
    this.newMenu.menuType = this.menuView == MenuViews.Market ? 1 : 3;
    this.newMenu.externalink = this.isExteralLink ? this.newMenu.externalink : '';

    let result = await this.dev.addMenu(this.newMenu);
    if (result) {

      await this.getMenuList();

      this.message.success('创建成功');
    } else {
      this.message.error("创建失败")
    }
  }
  selectMenu(menu) {
    this.state = ViewState.EditMenu
    this.selectedMenu = menu;
    // console.log(menu)
  }
  onChange() {
    // console.log(this.newMenu);
  }
  async  getMenuList() {
    let result: { menus: { count: number, rows: IMenu[] } };
    if (this.menuView == this.MenuViews.Market) {
      result = await this.dev.marketMenuList();
    } else {
      result = await this.dev.devMenuList();
    }
    // 将menu 换成字符串
    // console.log(result.menus);
    result.menus.rows.forEach(menu => menu.config = JSON.stringify(menu.config));
    this.menus = result.menus.rows;
    this.storage.menuList = this.menus;
    if (this.menuView != this.MenuViews.Market)
      this.common.resetMenu(this.menus);
    // result = await this.dev.devMenuList();

    let trees = this.common.getMenuTree(this.menus);
    // console.log(trees);
    this.nodes = this.common.getMenuNzTreeNode(this.menus);

  }
  async deleteMenu(menuId: number) {

    let result = await this.dev.menuDelete(menuId);
    if (result) {


      await this.getMenuList();
      this.message.success('删除成功');
    } else {
      this.message.error("删除失败")
    }
  }
  selectMenuGroup(group: IGroup) {
    this.selectedGroup = group;
    this.state = ViewState.EditGroup;
  }
  async  updateGroup() {
    let result = await this.dev.menuUpdate({ menuId: this.selectedGroup.menuId, text: this.selectedGroup.text, icon: this.selectedGroup.icon });
    if (result) {
      await this.getMenuList();
      this.message.success("更新成功")
    } else {
      this.message.error("更新失败")
    }
  }



  async  mouseAction(name: string, e: any) {
    this.selectedMenu = await this.dev.menuDetail(e.node.key);
    if (typeof this.selectedMenu.config == 'object') {
      this.selectedMenu.config = JSON.stringify(this.selectedMenu.config);
    }
    this.state = ViewState.EditMenu;

    console.log(name, e);
  }
  showAddMenuModal() {
    // console.log(`总菜单`, this.menus);
    this.state = ViewState.Create;
    // console.log(`可选福记菜单`, this.optionParentMenus)
  }
  allChecked = false;
  indeterminate = true;
  checkOptionsOne = [
    { label: 'Apple', value: 'Apple', checked: true },
    { label: 'Pear', value: 'Pear', checked: false },
    { label: 'Orange', value: 'Orange', checked: false }
  ];

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.checkOptionsOne.forEach(item => item.checked = true);
    } else {
      this.checkOptionsOne.forEach(item => item.checked = false);
    }
  }

  updateSingleChecked(): void {
    if (this.checkOptionsOne.every(item => item.checked === false)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.checkOptionsOne.every(item => item.checked === true)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
  async  updateMenu() {
    console.log(this.selectedMenu)
    let result = await this.dev.menuUpdate(this.selectedMenu);
    if (result) {
      await this.getMenuList();
      this.message.success("更新成功")
    } else {
      this.message.error("更新失败")
    }
  }
}
