import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { DevService } from '../../../lib';

export interface TreeNodeInterface {
  key: number;
  name: string;
  code: number;
  level: number;
  expand: boolean;
  address: string;
  children?: TreeNodeInterface[];
}

enum View {
  ListCommo = 1,
  CreateCommo,
  EditCommo
}
@Component({
  selector: 'app-commodity-type',
  templateUrl: './commodity-type.component.html',
  styles: []
})

export class CommodityTypeComponent implements OnInit {
  View = View;
  state = View.ListCommo;
  isVisible = false;
  categorys: ICategory[];
  selectCategory: ICategory;

  newcategory: ICategory = {
    cateName: "",
    // parentId?: 1,
    // orderNo: 1,
    // cateCode: 1
  }
  page: number = 1
  pageSize: number = 10
  count: number
  editCategory: ICategory
  async showAddCommodify(category: ICategory) {
    this.state = View.CreateCommo
    this.selectCategory = category

  }

  async AddCommodify() {
    let result
    if (this.selectCategory) {
      this.newcategory.parentId = this.selectCategory.cateId
      result = await this.dev.categoryCreate(this.newcategory);
    } else {
      this.newcategory.parentId = -1
      result = await this.dev.categoryCreate(this.newcategory);
    }



    this.categorys = [];
    this.state = View.ListCommo
    this.message.success("创建成功")
    this.ListCategory()
  }

  async ListCategory() {


    let result = await this.dev.categoryList(this.page - 1, this.pageSize);

    this.categorys = result.rows;
    this.count = result.count
    this.categorys.forEach(category => category.level = 0);



  }
  async openChild(category: ICategory, toggle: boolean) {
    if (toggle) {


      let result = await this.dev.categoryList(this.page - 1, this.pageSize, category.cateId)
      let rows = result.rows;
      rows.forEach(row => row.level = category.level + 1);
      let i = this.categorys.findIndex(cate => cate == category);
      this.categorys.splice(i + 1, 0, ...rows);
    } else {
      let subs = this.categorys.filter(cate => cate.parentId == category.cateId);
      subs.forEach(sub => {
        let i = this.categorys.findIndex(cate => cate == sub);
        this.categorys.splice(i, 1);
      })

    }
  }


  handleCancel() {
    console.log('Button cancel clicked!');
    this.state = View.ListCommo
  }
  cancel() {
    this.nzMessageService.info('click cancel');
  }

  async deleteCate(category) {


    await this.dev.deleteCate(category.cateId)
    this.message.success("删除成功")
    this.ListCategory()

  }

  showEditCommodify(category: ICategory) {
    this.state = View.EditCommo
    this.editCategory = category

  }
  async OkShowEditCommodify() {

    await this.dev.categoryUpdate(this.editCategory)
    this.message.success("更新成功")
    this.state = View.ListCommo;
    this.ListCategory()
  }
  constructor(
    private nzMessageService: NzMessageService,

    public message: NzMessageService,
    public dev: DevService


  ) { }



  ngOnInit() {
    this.ListCategory()

  }
}


