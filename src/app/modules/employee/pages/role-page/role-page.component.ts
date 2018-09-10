import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpService, CommonService, StorageService } from '../../../lib';
import { filter } from 'rxjs/operators';


enum View {
  ListRole,
  CreateRole = 1,
  EditRole,
  empRole,//角色赋权
  empdelete,//取消赋权
}
@Component({
  selector: 'app-role-page',
  templateUrl: './role-page.component.html',
  styleUrls: ['./role-page.component.css']
})
export class RolePageComponent implements OnInit {
  roles: IRole[] = [];
  marketId: number;
  newRole: IRole = {
    roleName: '',
    menuIds: [],
  }
  selectedRole: IRole
  totalMenus: IMenu[] = []
  indeterminate: boolean = false;

  groups: IGroup[] = [];
  orgId: number;
  state = View.ListRole;
  View = View;
  employee: IUser;
  emps: IUser[] = [];
  roleId: number;
  employeeIds: number[] = [];
  selectedEmps: IUser;
  empsdAll: IUser[] = [];
  employeeId: number;
  constructor(public route: ActivatedRoute, public emp: EmpService, public common: CommonService, public store: StorageService) {
    this.employee = this.store.employee
    this.marketId = this.employee.mktId;
    this.orgId = this.employee.orgId,
      this.employeeId = this.employee.id


  }
  dataSet: IRole[] = [
    { roleName: '', menuIds: [], }
  ];
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
    await this.listRoles();
  }
  async roleUpdate() {
    this.selectedRole.menuIds = this.common.getCheckedMenuIds(this.groups);
    this.selectedRole.mktId = this.marketId;
    await this.emp.roleUpdate(this.selectedRole);
    await this.listRoles();
    this.state = View.ListRole;

  }
  async  listRoles() {
    this.roles = await this.emp.roleList(this.marketId);
    this.roles.forEach(role => role.menus = this.common.menuIdsToMenus(role.menuIds as number[], this.totalMenus))
  }
  async  listGroup() {
    console.log(this.marketId)
    this.totalMenus = await this.emp.marketMenus(this.marketId);
    this.groups = this.common.getModuleGroup(this.totalMenus);
    console.log(this.employee)
    console.log(this.groups);
  }
  async  createRole() {
    this.newRole.menuIds = this.common.getCheckedMenuIds(this.groups);

    this.newRole.mktId = this.marketId;
    this.newRole.roleCode.toLocaleLowerCase;
    await this.emp.roleCreate(this.newRole);
    await this.listRoles();
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
  async roleDelete(roleId) {
    await this.emp.roleDelete(roleId);
    await this.listRoles();
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
  // 角色赋权
  async empRole() {



    let checkedEmp = this.emps.filter(emp => emp.checked).map(emp => emp.id)


    this.roleId = this.selectedRole.roleId
    this.employeeIds = checkedEmp

    await this.emp.employeeBatAdd(this.roleId, this.employeeIds)

  }
  //取消赋权
  async empdelete() {
    let checkedEmp = this.emps.filter(emp => emp.checked).map(emp => emp.id)


    this.roleId = this.selectedRole.roleId
    this.employeeIds = checkedEmp
    await this.emp.employeeBatLess(this.roleId, this.employeeIds)
  }
  // 获取没有角色的员工
  async empList() {

    this.roleId = this.selectedRole.roleId
    this.emps = await this.emp.noRoleEmployee(this.marketId, this.employeeId, this.roleId);

  }
  // 获取该角色下的所有员工
  async empRoleList() {

    this.roleId = this.selectedRole.roleId;

    this.emps = await this.emp.roleEmployees(this.roleId, this.marketId);

  }
}
