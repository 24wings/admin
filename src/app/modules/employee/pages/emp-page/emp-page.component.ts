



import { Component, OnInit } from '@angular/core';
import { NzTreeNode, NzTreeNodeOptions, TransferItem } from 'ng-zorro-antd';

import { MenuType, RoleType, EmployeeType } from '../../../../constant';
import { EmpService, CommonService, StorageService } from '../../../lib';
import { ActivatedRoute } from '@angular/router';

enum View {
  List = 1,

  EmployeeCreate,
  EmployeeEdit

}
@Component({
  selector: 'app-emp-page',
  templateUrl: './emp-page.component.html',
  styleUrls: ['./emp-page.component.css']
})
export class EmpPageComponent implements OnInit {
  state: View = View.List;
  market: IMarket;
  newRole: IRole = {
    roleName: '',
    roleType: RoleType.GroupCompany,
    menuIds: []
  }
  orgId: number;
  marketId: number;

  newEmployee: IUser = {
    name: '',
    userName: '',
    password: '',
    userType: EmployeeType.GroupCompany
  }
  showMenuTabIndex: number = 0;
  groups: IGroup[] = [];
  roleMenuGroups: IGroup[] = [];
  employees: IUser[] = [];
  menus: IMenu[] = [];
  groupCompany: IGroupCompany;
  isVisible: boolean = false;
  selectedOrg: IOrg;
  selectedEmployee: IUser;
  View = View;
  orgNodes: NzTreeNode[] = [];
  totalRoles: IRole[] = [];
  org: IOrg
  switchValue = false;
  active = false;
  roles: IRole[]

  /**
   * isLeaf  false为组织 true为员工  组织可以点击获取组织员工
   * 
   */
  orgToTreeNode(org: IOrg): NzTreeNodeOptions {
    return { key: org.orgId + '', title: org.orgName, children: [], isLeaf: false, expanded: false, origin: org } as any
  }
  async  employeeUpdate() {
    await this.emp.employeeUpdate(this.selectedEmployee);
    await this.listTopOrgs();
  }
  employeeToTreeNodeOption(employee: IUser): NzTreeNodeOptions {
    return { title: employee.name, key: employee.id + '', children: [], isLeaf: true }
  }
  /**
   *  当点击时候
   */
  async  mouseAction(name: string, e: { eventName: 'expand', node: NzTreeNode, event: MouseEvent }) {
    console.log(name, e);
    /**点击组织 */
    if (!e.node.isLeaf) {

      if (e.node.key) {
        this.selectedOrg = { orgName: e.node.title, orgId: e.node.key as any };
        console.log('选中下级组织', e.node.origin);
        this.employees = await this.emp.employeeList(this.marketId, e.node.key as any);

        let subOrgs: IOrg[] = await this.emp.orgList(this.marketId, e.node.key as any);
        e.node.children = [];
        e.node.addChildren(subOrgs.map(org => this.orgToTreeNode(org)));

      }
      // 选择的是顶级组织 也就是市场
      else {
        console.log('选中顶级组织')
        this.selectedOrg = { orgName: this.market.mktName, orgId: 0 };
        // 市场员工
        this.employees = await this.emp.employeeList(this.marketId, 0);
        let orgs = await this.emp.orgList(this.marketId, 0);
        this.orgNodes[0].children = [];
        this.orgNodes[0].addChildren(orgs.map(org => this.orgToTreeNode(org)));

      }

    }
    // 选中员工
    else {

    }
  }
  employee: IUser;
  constructor(public emp: EmpService, public common: CommonService, public storage: StorageService, public route: ActivatedRoute) {
    this.employee = this.storage.employee
    this.marketId = this.employee.mktId
    this.orgId = this.employee.orgId;
    this.menus = this.storage.menuList;
  }
  // 初始化员工列表
  async roleList() {
    this.totalRoles = await this.emp.roleList(this.marketId);
    this.employeeRoles = this.totalRoles.map(role => this.roleToTransferItem(role));
    this.org = await this.emp.orgDetail(this.orgId)
    this.mouseAction('', { node: { key: this.employee.orgId, title: this.org.orgName } } as any)
    this.state = View.List
  }
  // 所有的角色列表
  async RoleList() {
    this.roles = await this.emp.roleList(this.marketId)
  }
  async listTopOrgs() {

    let org = await this.emp.orgDetail(this.employee.orgId);

    /**不属于任何组织,直接属于市场 */
    if (!org) {
      this.market = await this.emp.marketDetail(this.employee.mktId);
      this.orgNodes = [new NzTreeNode({ title: this.market.mktName, key: 0 + '', expanded: true })];

    } else {
      this.orgNodes = [new NzTreeNode({ title: org.orgName, key: org.orgId + '' })];
    }

  }
  employeeRoles: TransferItem[] = [];
  select(ret: {}): void {
  }
  async  employeeDelete(epId: number) {

    await this.emp.employeeDelete(epId);
    await this.listTopOrgs();
  }
  //禁用员工
  async employeeDisable() {

  }
  change(ret: {}): void {
  }
  async  createEmployee() {
    this.newEmployee.mktId = this.marketId;
    this.newEmployee.orgId = this.selectedOrg.orgId;
    // console.log(this.employeeRoles);
    // this.newEmployee.roleIds = (this.employeeRoles.filter(role => role.direction == 'right').map(role => role.key) as number[]);
    this.newEmployee.roleIds = this.roles.filter(role => role.checked).map(role => role.roleId)
    await this.emp.employeeCreate(this.newEmployee);
    await this.listTopOrgs();
    await this.roleList();
  }
  epChange($event: { from: 'left' | 'right', list: TransferItem[], to: 'left' | 'right' }) {
    $event.list.forEach(item => item.direction = $event.to);
  }

  async ngOnInit() {
    await this.marketDetail()
    await this.listTopOrgs();
    await this.roleList();
  }
  async marketDetail() {
    this.market = await this.emp.marketDetail(this.marketId);
  }
  roleToTransferItem(role: IRole): TransferItem {
    return { title: role.roleName, key: role.roleId + '', direction: 'right' };
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
  clickSwitch(): void {
    if (!this.active) {

      this.active = true;
      setTimeout(() => {
        this.switchValue = !this.switchValue;
        // this.employee.employeeType=await this.emp.
        this.active = false;
      }, 300);


    } else {

    }

  }
}
