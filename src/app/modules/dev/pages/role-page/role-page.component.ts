import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DevService, CommonService, EmpService } from '../../../lib';
import { NzTreeNode, NzTreeNodeOptions, NzMessageService } from 'ng-zorro-antd';
enum View {
  ListRole,
  CreateRole = 1,
  EditRole,

  empRole,//角色赋权
  empdelete//取消赋权
}
@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.css']
})
export class RolePageComponent implements OnInit {
  newEmployee: IUser = {
    userName: '',
    password: '',

  }
  selectedRoles: string;

  roles: IRole[] = [];
  employeeCreate() {

    this.state = View.ListRole;
  }


  marketId: number;
  newRole: IRole = {
    roleName: '',
    menuIds: [],
    roleCode: '',
  }
  market: IMarket;
  selectedRole: IRole
  totalMenus: IMenu[] = []
  indeterminate: boolean = false;

  groups: IGroup[] = [];

  state = View.ListRole;
  View = View;
  // 新
  selectedMenu: IMenu;
  nodes: NzTreeNode[] = [];
  menus: IMenu[] = [];
  employee: IUser;
  emps: IUser[] = [];
  roleId: number;
  employeeIds: string;
  selectedEmps: IUser;
  empsdAll: IUser[] = [];
  employeeId: number;
  orgId: number;
  orgNodes: NzTreeNode[] = [];
  selectedOrg: IOrg;
  employees: IUser[] = [];
  constructor(
    public route: ActivatedRoute,
    public dev: DevService,
    public common: CommonService,
    public emp: EmpService,
    public message: NzMessageService
  ) {
    this.marketId = this.route.snapshot.params.marketId;

  }

  async selectRole(role: IRole) {
    this.selectedRole = role;
    this.groups.forEach(group => {
      if (role.menus.find(menu => menu.menuId == group.menuId)) {
        group.checked = true;
      }
      group.children.forEach(subMenu => {
        if (role.menus.find(menu => subMenu.menuId == menu.menuId)) {
          subMenu.checked = true;
        }
      })
    })
  }

  async  ngOnInit() {
    await this.listGroup();
    await this.getListRoles();
  }
  //更细角色
  async roleUpdate() {

    let checkedIds = []
    for (let node of this.nodes) {
      checkedIds.push(this.getCheckedMenuIds(node as any));
    }
    this.selectedRole.mktId = this.marketId;
    this.selectedRole.menuIds = checkedIds
    //console.log(this.selectedRole)
    let result = await this.dev.roleUpdate(this.selectedRole);
    if (result) {
      await this.listRoles();
      this.state = View.ListRole;

      this.message.success("更新成功")
    } else {
      this.message.error("更新失败")
    }



  }
  async  listRoles() {

    let roles = await this.dev.marketRoles(this.marketId);
    roles.forEach(role => role.menus = this.common.menuIdsToMenus(role.menuIds as number[], this.totalMenus));
    // console.log(roles, this.roles);
    this.roles = roles;


  }
  async getListRoles() {
    this.roles = await this.dev.newMarketRoles(this.marketId);
    //console.log(this.roles);
  }
  async  listGroup() {
    this.totalMenus = await this.dev.marketMenus(this.marketId);
    // this.groups = this.common.getModuleGroup(this.totalMenus);
    let result = await this.dev.marketMenuList();

    this.menus = result.menus.rows;
    this.nodes = this.common.getMenuNzTreeNode(this.menus);
    // console.log(this.groups);
  }
  async  createRole() {
    let checkedIds = []
    for (let node of this.nodes) {
      checkedIds.push(this.getCheckedMenuIds(node as any));
    }
    let menuIds = []
    for (let checkedId of checkedIds) {

      for (let menuId of checkedId) {
        if (menuId) {
          menuIds.push(menuId)
        }
      }
    }
    this.newRole.mktId = this.marketId;
    this.newRole.menuIds = checkedIds;
    this.newRole.menus = this.common.menuIdsToMenus(menuIds, this.totalMenus);
    this.newRole.roleCode = this.newRole.roleCode.toUpperCase()
    let result = await this.dev.roleCreate(this.newRole);
    await this.listRoles();
    this.message.success("创建成功")

  }
  async roleDelete(roleId) {
    let result = await this.dev.roleDelete(roleId);

    await this.listRoles();
    this.message.success("删除成功")

  }
  async  mouseAction(name: string, e: any) {
    this.selectedMenu = await this.dev.menuDetail(e.node.key);
    if (typeof this.selectedMenu.config == 'object') {
      this.selectedMenu.config = JSON.stringify(this.selectedMenu.config);
    }
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

  allChecked = false;

  displayData = [];
  refreshStatus(): void {
    const allChecked = this.displayData.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.displayData.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }

  checkAll(value: boolean): void {
    this.displayData.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
  }
  // 角色赋权
  async empRole() {



    let checkedEmp = this.emps.filter(emp => emp.checked).map(emp => emp.id).toString()


    this.roleId = this.selectedRole.roleId
    this.employeeIds = checkedEmp

    await this.dev.employeeBatAdd(this.roleId, this.employeeIds)

  }

  //取消赋权
  // async empdelete() {
  //   let checkedEmp = this.emps.filter(emp => emp.checked).map(emp => emp.epId)


  //   this.roleId = this.selectedRole.roleId
  //   this.employeeIds = checkedEmp
  //   await this.dev.employeeBatLess(this.roleId, this.employeeIds)
  // }
  // 获取所有的员工
  async empList() {



    this.orgId = 1

    this.emps = await this.dev.employeeList(this.marketId, this.orgId);

  }



  // 获取该角色下的所有员工
  // async empRoleList() {

  //   this.roleId = this.selectedRole.roleId;

  //   this.emps = await this.dev.roleEmployees(this.roleId, this.marketId);

  // }
}
