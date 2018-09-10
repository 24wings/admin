import { Component, OnInit } from '@angular/core';
import { DevService } from '../../../lib';
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

  View = View;
  state = View.ListSubject;

  subject: ISubject
  subjects: ISubject[]
  newSubject: ISubject = {
    subName: ""
  }
  selectSubject: ISubject
  editSubject: ISubject
  constructor(
    public dev: DevService
  ) { }
  async  ShowAddSubject(subject: ISubject) {
    this.state = View.CreateSubject;
    this.selectSubject = subject

  }
  async  AddSubject() {
    if (this.selectSubject) {
      this.newSubject.parentId = this.selectSubject.subId

    } else {
      this.newSubject.parentId = -1
    }
    await this.dev.subjectCreate(this.newSubject)


    this.subjects = [];
    this.state = View.ListSubject;
    this.subjectList()
  }
  async handleCancel() {
    this.state = View.ListSubject
  }
  async subjectList() {
    this.subjects = await this.dev.subjectList()

    this.subjects.forEach(subject => subject.level = 0);

  }
  async showSubject(subject) {
    this.state = View.EditSubject
    this.editSubject = subject



  }
  async okeditSubject() {

    await this.dev.subjectUpdate(this.editSubject)
    this.state = View.ListSubject
    this.subjectList()
  }
  async deleteSub(subject) {
    await this.dev.subjectDelete(subject.subId)
    this.state = View.ListSubject;
    this.subjectList()
  }
  cancel() {
    this.state = View.ListSubject
  }

  async openChild(subject: ISubject, toggle: boolean) {
    if (toggle) {


      let result = await this.dev.subjectList(subject.subId)
      let rows = result;
      rows.forEach(row => row.level = subject.level + 1);
      let i = this.subjects.findIndex(sub => sub == subject);
      this.subjects.splice(i + 1, 0, ...rows);

    } else {
      let subs = this.subjects.filter(sub => subject.subId == sub.parentId);
      subs.forEach(sub => {
        let i = this.subjects.findIndex(subject => subject == sub);
        this.subjects.splice(i, 1);
      })

    }
  }
  ngOnInit() {
    this.subjectList()
  }

}
