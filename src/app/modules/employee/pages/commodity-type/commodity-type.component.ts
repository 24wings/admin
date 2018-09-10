import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { viewClassName } from '@angular/compiler';
import { EmpService } from '../../../lib';
import { async } from 'q';
import { Router, ActivatedRoute } from '@angular/router';



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
  txnId: number
  txnarea: ITxnArea
  txnName: string
  page: number = 1
  pageSize: number = 10
  count: number
  newcategory: ICategory = {
    cateName: "",
    // parentId?: 1,
    // orderNo: 1,
    // cateCode: 1
  }
  editCategory: ICategory
  internalCategoryOptions: CascaderOption[] = [];
  async showAddCommodify(category: ICategory) {
    this.state = View.CreateCommo
    this.selectCategory = category
    this.categorys = await this.emp.categoryInternalList();

    this.spreadCategorys(this.categorys);
    console.log(this.categorys)
  }

  spreadCategorys(categorys: ICategory[]) {

    let topCategorys = this.categorys.filter(category => category.parentId == -1);


    let topOptions: CascaderOption[] = topCategorys.map(category => {
      return {
        parentId: category.parentId,
        value: category.cateCode + '',
        label: category.cateName,
        children: [],
        isLeaf: false
      }
    });
    let options: CascaderOption[] = this.categorys.map(category => {
      return {
        parentId: category.parentId,
        children: [],
        value: category.cateCode + '',
        isLeaf: false,
        label: category.cateName
      }
    })
    topOptions.forEach(option => {
      option.children = this.getChildrenOptions(option, options);
    });

    this.internalCategoryOptions = topOptions;
    debugger

  }
  getChildrenOptions(parent: CascaderOption, options: CascaderOption[]): CascaderOption[] {

    let children = options.filter(category => category.parentId == parent.value as any);
    for (let option of children) {
      option.children = this.getChildrenOptions(option, options);
      if (option.children.length == 0) {
        option.isLeaf = true;
      }
    }
    if (children.length == 0) parent.isLeaf = true;
    return children;

  }

  async AddCommodify() {
    if (Array.isArray(this.newcategory.linkCateCode))
      this.newcategory.linkCateCode = this.newcategory.linkCateCode[0];
    this.newcategory.txnId = this.txnId
    if (this.selectCategory) {
      this.newcategory.parentId = this.selectCategory.cateId;

      let result = await this.emp.categoryCreate(this.newcategory);
    } else {

      let result = await this.emp.categoryCreate(this.newcategory);
    }


    this.categorys = [];
    this.state = View.ListCommo

    this.ListCategory()
  }

  async ListCategory() {

    let result = await this.emp.categoryList(this.page - 1, this.pageSize);


    this.categorys = result.rows;
    this.count = result.count
    this.categorys.forEach(category => category.level = 0);



  }
  async openChild(category: ICategory, toggle: boolean) {
    if (toggle) {
      let result = await this.emp.categoryList(this.page - 1, this.pageSize, category.mktId, category.cateId)
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


    await this.emp.deleteCate(category.cateId)

    this.ListCategory()

  }

  showEditCommodify(category: ICategory) {
    this.state = View.EditCommo
    this.editCategory = category

  }
  async OkShowEditCommodify() {

    await this.emp.categoryUpdate(this.editCategory)

    this.state = View.ListCommo;
    this.ListCategory()
  }
  constructor(
    private nzMessageService: NzMessageService,
    public emp: EmpService,



    public route: ActivatedRoute
  ) {
    this.txnId = this.route.snapshot.params.txnId
  }


  async txnDetail() {
    let result = await this.emp.txnDetail(this.txnId)
    this.txnarea = result.txnArea
  }

  ngOnInit() {
    this.ListCategory()
    this.txnDetail()

  }
}











