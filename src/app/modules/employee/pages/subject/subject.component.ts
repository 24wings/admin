import { Component, OnInit } from '@angular/core';
import { state } from '@angular/animations';
import { Subject } from 'rxjs';
import { DevService, EmpService } from '../../../lib';
import { async } from 'rxjs/internal/scheduler/async';

enum View {
  ListSubject = 1,
  CreateSubject,
  EditSubject
}
@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styles: []
})
export class SubjectComponent implements OnInit {
  View = View
  state = View.ListSubject
  subject: ISubject;
  subjects: ISubject[]
  newSubject: ISubject = {
    subName: ""
  }
  editSubject: ISubject
  childSub: ISubject
  selectTop: ISubject;
  categoriesemp: ISubject[] = []
  constructor(

    public emp: EmpService
  ) { }
  handleCancel() {
    this.state = View.ListSubject
  }
  categories: ISubject[] = []
  subjectGroups: ISubject[] = []

  async  ngOnInit() {
    await this.AllsubjectDev()
    await this.allSubject()
    this.checkChange(this.subjectGroups[0].children[0])

  }

  // 添加分类
  async AddSubject() {
    this.newSubject.subLinkId = this.selectTop.subId
    this.newSubject.parentId = this.selectTop.subId
    await this.emp.subjectCustomCreate(this.newSubject)
    this.state = View.ListSubject;
    await this.allSubject()
  }

  checkChange(child): void {
    this.subjectGroups.forEach(
      group => group.children.forEach(item => item.checked = false)
    )
    child.checked = true
    this.selectTop = child
    this.allSubject()

  }
  // 分类列表
  async allSubject() {
    let parentId = this.selectTop.subId
    let result = await this.emp.subjectCustomList(parentId)
    this.categoriesemp = result.subjects
  }
  async editSub(categorie) {
    this.state = View.EditSubject
    this.editSubject = categorie
  }
  async okEditSubject() {
    await this.emp.subjectUpdate(this.editSubject)
    this.state = View.ListSubject
    await this.allSubject()
  }

  // 获取所有的开发者定义的收支科目，并生成节点树
  async  AllsubjectDev() {

    let result = await this.emp.listInternalSujects()
    this.categories = result.subjects

    let topSubs: ISubject[] = this.categories.filter(item => item.parentId == -1);
    for (let topSub of topSubs) {
      topSub.children = this.getMenuChildren(topSub, this.categories)
      this.subjectGroups.push(topSub)

    }


  }
  // 获取节点树
  getMenuChildren(parentSubject: ISubject, subjects: ISubject[]): ISubject[] {
    let children = subjects.filter(item => item.parentId == parentSubject.subId);
    for (let submenu of children) {
      submenu.children = this.getMenuChildren(submenu, subjects);
    }
    return children;
  }



}
