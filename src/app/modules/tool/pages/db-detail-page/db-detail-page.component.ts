import { Component, OnInit } from '@angular/core';
import { DevService } from '../../../lib';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-db-detail-page',
  templateUrl: './db-detail-page.component.html',
  styleUrls: ['./db-detail-page.component.css']
})
export class DbDetailPageComponent implements OnInit {
  tables:DbTable[]=[];
  constructor(public dev:DevService,public route:ActivatedRoute) { }

  ngOnInit() {
    this.listTables();
  }
  tableListByDbId() {
    this.listTables()
  }
  async listTables() {
    let tables: DbTable[] = await this.dev.tableListByDbId(this.route.snapshot.params.dbId);
    this.tables = tables.map(table => {
      if (typeof table.cols == 'string') {
        table.cols = JSON.parse(table.cols);
      }
      table.fieldSize = table.cols.length;
      return table;
    });
  }

}
