import { Component, OnInit } from '@angular/core';
import { NzMessageService, UploadFile } from "ng-zorro-antd";
import { CommonService, MyHttpService, DevService } from "../../../lib";
import { Observable, of } from "rxjs";
import { MarketStatus } from '../../../../constant';

enum ViewState {
  List = 1,
  Create,

  Update,

}
@Component({
  selector: 'app-group-company-page',
  templateUrl: './group-company-page.component.html',
  styleUrls: ['./group-company-page.component.css']
})
export class GroupCompanyPageComponent implements OnInit {
  MarketStatus = MarketStatus;
  loading: boolean = false;
  newMarket: IMarket = { mktName: '' };
  selectedMarket: IMarket;
  pageIndex = 1;
  pageSize = 10;
  selectedArticle: any;
  allChecked: boolean = false;
  indeterminate: boolean = false;
  ViewState = ViewState;
  groupCompanys: IGroupCompany[] = []

  fileList: any[] = [];
  previewImage = "";
  previewVisible = false;
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };
  async marketDisabled(market: IMarket) {
    await this.dev.marketDisabled(market.mktId);
    await this.listMarkets();

  }
  async marketActive(market: IMarket) {
    await this.dev.marketActive(market.mktId);
    await this.listMarkets();
  }

  dataSet: any[] = [];
  state = ViewState.List;
  total = 100;
  // 更新
  selectedArticleType: any;

  constructor(

    public common: CommonService,
    private msg: NzMessageService,
    public myHttp: MyHttpService,
    public dev: DevService,
    public message: NzMessageService

  ) { }

  ngOnInit() {
    this.listMarkets();
  }

  upload = async item => {
    let base64 = await this.common.convertFileToBase64(item.file);
    let result = await this.common.uploadImage(base64);
    this.fileList.push({ url: result.url, uid: result.id, status: "done" });

    return (
      of({}).subscribe(
        () => {
          let clearUpload = setTimeout(() => {
            let i = this.fileList.findIndex(file => file.status == "uploading");
            if (i >= 0) {
              this.fileList = this.fileList.filter(
                file => file.status != "uploading"
              );
              console.log(this.fileList);
              // clearInterval(clearUpload);
            }
          }, 1000);
          console.log(`success`, this.fileList);
        },
        () => {
          console.log(`error`);
        }
      ),
      () => {
        console.log("process");
      }
    );
  };
  nzData = async file => {
    return await this.common.convertFileToBase64(file);
  };

  beforeUpload = async item => {
    console.log(item);
    return false;
  };
  async listMarkets() {
    let result = await this.dev.marketPage(this.pageIndex - 1, this.pageSize);
    this.groupCompanys = result.rows;
    this.total = result.count

  }

  async deleteCompanyGroup(groupCompany: IMarket) {
    let result = await this.dev.groupCompanyDelete(groupCompany.mktId);
    if (result) {

      await this.listMarkets();
      this.message.success("删除成功")
    } else {
      this.message.error("删除失败")
    }
  }



  async   marketCreate() {
    let data = await this.dev.marketCreate(this.newMarket);
    this.state = ViewState.List;
    if (data) {
      await this.listMarkets();
      this.message.success("创建成功")
    } else {
      this.message.error("创建失败")
    }
  }
  async marketUpdate() {
    let result = await this.dev.marketUpdate(this.selectedMarket);
    this.state = ViewState.List;
    if (result) {
      await this.listMarkets();
      this.message.success("更新成功")
    } else {
      this.message.error("更新失败")
    }
  }


}
