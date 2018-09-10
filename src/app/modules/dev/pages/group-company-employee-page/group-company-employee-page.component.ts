import { Component, OnInit } from '@angular/core';
import { NzTreeNode, NzTreeNodeOptions, TransferItem, NzMessageService } from 'ng-zorro-antd';
import { RoleType, EmployeeType, EmployeeStatus } from '../../../../constant';
import { MenuType } from '../../../../constant';
import { DevService, CommonService, StorageService } from '../../../lib';
import { ActivatedRoute } from '@angular/router';


enum View {
  List = 1,

  EmployeeCreate,
  EmployeeEdit

}
@Component({
  selector: 'app-group-company-employee-page',
  templateUrl: './group-company-employee-page.component.html',
  styleUrls: ['./group-company-employee-page.component.css']
})
export class GroupCompanyEmployeePageComponent implements OnInit {
  state: View = View.List;
  EmployeeStatus = EmployeeStatus;
  selectedNode: NzTreeNode;
  market: IMarket;
  newRole: IRole = {
    roleName: '',
    roleType: RoleType.GroupCompany,
    menuIds: []
  }

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
  async employeeDisabled(data: IUser) {
    await this.dev.employeeDisabled(data.id);
    await this.refershEmployee()
  }
  async employeeActive(data: IUser) {
    await this.dev.employeeActive(data.id);
    await this.refershEmployee()
  }

  /**
   * isLeaf  false为组织 true为员工  组织可以点击获取组织员工
   * 
   */
  orgToTreeNode(org: IOrg): NzTreeNodeOptions {
    return { key: org.orgId + '', title: org.orgName, children: [], isLeaf: false, expanded: false, origin: org } as any
  }
  async  refershEmployee() {
    await this.listTopOrgs();
  }
  // 修改员工
  async  employeeUpdate() {
    this.selectedEmployee.roleIds = this.employeeRoles.filter(emp => emp.direction == 'left').map(emp => emp.key).join(',')
    this.dev.employeeUpdate(this.selectedEmployee);

    this.message.success("修改成功")

  }
  employeeToTreeNodeOption(employee: IUser): NzTreeNodeOptions {
    return { title: employee.name, key: employee.id + '', children: [], isLeaf: true }
  }

  /**
   *  当点击时候
   */
  async  mouseAction(name: string, e: { eventName: 'expand', node: NzTreeNode, event: MouseEvent }) {
    console.log(name, e);
    // this.selectedNode=e.node;
    /**点击组织 */
    if (!e.node.isLeaf) {

      if (e.node.key) {
        this.selectedOrg = { orgName: e.node.title, orgId: e.node.key as any };
        console.log('选中下级组织', e.node.origin);
        this.employees = await this.dev.employeeList(this.marketId, e.node.key as any);

        let subOrgs: IOrg[] = await this.dev.orgList(this.marketId, e.node.key as any);
        e.node.children = [];
        e.node.addChildren(subOrgs.map(org => this.orgToTreeNode(org)));

      }
      // 选择的是顶级组织 也就是市场
      else {
        console.log('选中顶级组织')
        this.selectedOrg = { orgName: this.market.mktName, orgId: 0 };
        // 市场员工
        this.employees = await this.dev.employeeList(this.marketId, 0);
        let orgs = await this.dev.orgList(this.marketId, 0);
        this.orgNodes[0].children = [];
        this.orgNodes[0].addChildren(orgs.map(org => this.orgToTreeNode(org)));

      }

    }
    // 选中员工
    else {

    }
  }
  constructor(public dev: DevService,
    public common: CommonService,
    public storage: StorageService,
    public route: ActivatedRoute,
    public message: NzMessageService
  ) {
    this.marketId = this.route.snapshot.params.marketId;

  }
  async listTopOrgs() {
    this.market = await this.dev.marketDetail(this.marketId);
    let topOrgs = await this.dev.orgList(this.marketId, 0);
    this.selectedOrg = { orgId: topOrgs[0].orgId, orgName: topOrgs[0].orgName };
    this.orgNodes = topOrgs.map(org => new NzTreeNode({ title: org.orgName, children: [], key: '', expanded: true }))
    this.employees = await this.dev.employeeList(this.marketId, this.selectedOrg.orgId);
    //let orgs = await this.dev.orgList(this.marketId, this.selectedOrg.orgId);
    // this.orgNodes[0].children = [];
    // this.orgNodes[0].addChildren(orgs.map(org => this.orgToTreeNode(org)));
    // this.orgNodes[0].addChildren(employees.map(employee=>this.employeeToTreeNodeOption(employee)));
  }
  employeeRoles: TransferItem[] = [];
  select(ret: {}): void {
    console.log('nzSelectChange', ret);
  }

  // 删除员工
  async  employeeDelete(epId: number) {
    this.dev.employeeDelete(epId);

    await this.listTopOrgs();
    this.message.success("删除成功")

  }
  change(ret: {}): void {
    console.log('nzChange', ret);
  }

  // 创建员工
  async  createEmployee() {
    this.newEmployee.mktId = this.marketId;
    this.newEmployee.orgId = this.selectedOrg.orgId;
    console.log(this.selectedOrg.orgId);
    //console.log(this.employeeRoles);
    this.newEmployee.roleIds = (this.employeeRoles.filter(role => role.direction == 'left').map(role => role.key) as number[]);
    let result = await this.dev.employeeCreate(this.newEmployee);
    if (result) {
      await this.listTopOrgs();
      this.message.success("创建成功")
    } else {
      this.message.error("创建失败")
    }
  }
  epChange($event: { from: 'right' | 'left', list: TransferItem[], to: 'right' | 'left' }) {
    $event.list.forEach(item => item.direction = $event.to);
  }


  // 初始化页面
  async ngOnInit() {
    await this.roleList();
    await this.listTopOrgs();
  }
  async roleList() {
    this.totalRoles = await this.dev.marketRoles(this.marketId);
    this.employeeRoles = this.totalRoles.map(role => this.roleToTransferItem(role));
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

}
