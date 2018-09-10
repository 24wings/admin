import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DevService } from '../../../lib';
enum View{
  List=1,
  AddDatabase
}
@Component({
  selector: 'app-db-page',
  templateUrl: './db-page.component.html',
  styleUrls: ['./db-page.component.css']
})
export class DbPageComponent implements OnInit {
  state:View=View.List;
  View=View;
  dataSet: DbTable[] = [];

  constructor(public dev: DevService, public route: ActivatedRoute, public router: Router) {
 
  }
  newDb: IDb = {
    name: '',
    comment: ''
  }

  async ngOnInit() {
   await this.dbList();
  }


  dbs: IDb[] = [];
  async createDb() {
    await this.dev.dbCreate(this.newDb);
    await this.dbList();
  }
  async dbList() {
    this.dbs = await this.dev.dbList();
  }

}
