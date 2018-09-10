import { Component, OnInit } from '@angular/core';
import { NzMessageService, UploadFile, CascaderOption } from "ng-zorro-antd";
import { CommonService, MyHttpService, StorageService, DevService } from "../../../lib";
import { of } from "rxjs";
import { MarketStatus } from '../../../../constant';

enum ViewState {
  List = 1,
  Create,
  Update
}
@Component({
  selector: 'app-market-page',
  templateUrl: './market-page.component.html',
  styleUrls: ['./market-page.component.css']
})
export class MarketPageComponent implements OnInit {
  MarketStatus = MarketStatus;
  loading: boolean = false;
  gcId: number;
  options: CascaderOption[] = [];
  values: string[] = [];
  newMarket: IMarket = {
    mktName: '',
    province: '',
    city: '',
    area: '',
    telephone: '',
  }

  pageIndex = 0;
  pageSize = 10;
  allChecked: boolean = false;
  indeterminate: boolean = false;
  ViewState = ViewState;

  fileList: any[] = [];
  previewImage = "";
  previewVisible = false;
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };

  markets: IMarket[] = [];
  state = ViewState.List;
  total = 100;
  // 更新
  selectedMarket: IMarket;
  async deleteMarket(market: IMarket) {
    let result = await this.dev.marketDelete(market.mktId);
    if (result) {
      await this.listMarketIdByGcId();
      this.msg.success("删除成功")
    } else {
      this.msg.error("删除失败")
    }
  }
  selectMarket(market: IMarket) {
    this.selectedMarket = market;
    this.values = [this.selectedMarket.province, this.selectedMarket.city, this.selectedMarket.area];
  }
  constructor(
    public common: CommonService,
    private msg: NzMessageService,
    public myHttp: MyHttpService,
    public dev: DevService,
    public storage: StorageService,
  ) {
    this.gcId = this.storage.gcId;
  }


  ngOnInit() {

    this.listCityJson();
    this.listMarketIdByGcId()

  }
  async listMarketIdByGcId() {
    let result = await this.dev.marketPage(this.pageIndex, this.pageSize);
    this.markets = result.rows;
    this.total = result.count;
  }
  async createMarket() {
    if (this.values.length < 3) {
      return this.dev.http.createMessage('error', '请选择省市区')
    }
    this.newMarket.gcId = this.gcId;
    this.newMarket.province = this.values[0];
    this.newMarket.city = this.values[1];
    this.newMarket.area = this.values[2];

    await this.dev.marketCreate(this.newMarket);
    this.state = ViewState.List;
    await this.listMarketIdByGcId();
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
  async  listCityJson() {
    let regions = await this.common.localCityJson();
    this.options = regions.map(region => {
      let cityChildren = region.city.map(city => {
        let areaChildren = city.area.map(area => {
          return {
            label: area,
            value: area,
            isLeaf: true
          };
        });
        return { value: city.name, label: city.name, children: areaChildren };
      });
      return { label: region.name, value: region.name, children: cityChildren };
    });

  }

  async updateMarket() {
    this.selectedMarket.province = this.values[0];
    this.selectedMarket.city = this.values[1];
    this.selectedMarket.area = this.values[2];
    console.log(this.selectedMarket)
    let result = await this.dev.marketUpdate(this.selectedMarket);
    if (result) {

      await this.listMarketIdByGcId();
      this.msg.success("更新成功")
    } else {
      this.msg.error("更新失败")
    }
  }
}
