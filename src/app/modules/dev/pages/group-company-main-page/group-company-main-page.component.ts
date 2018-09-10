import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../../../lib';

enum View{
  List=1,
  Update
}
@Component({
  selector: 'app-group-company-main-page',
  templateUrl: './group-company-main-page.component.html',
  styleUrls: ['./group-company-main-page.component.css']
})
export class GroupCompanyMainPageComponent implements OnInit {

  constructor(public route: ActivatedRoute, public storage: StorageService) {
  

  }

  ngOnInit() {
    // alert(this.gcId);
  }

}
