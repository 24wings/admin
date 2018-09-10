import { Component, OnInit } from '@angular/core';
import { NzTreeNode, NzFormatEmitEvent } from 'ng-zorro-antd';
import { CrawlService } from '../../../lib/service/crawl.service';
import * as  _ from 'lodash';

enum View {
  ListWorkers = 1,
  ListSiteMap,
  ListLinks,
  ListParse,

}

@Component({
  selector: 'app-zbj-page',
  templateUrl: './zbj-page.component.html',
  styles: []
})

export class ZbjPageComponent implements OnInit {

  workers: IHostWorker[] = [];
  addWorkerModalVisible: boolean = false;
  editWorkModalVisible: boolean = false
  distributionModalVisible: boolean = false
  state = View.ListSiteMap;
  newWorker: IHostWorker = {
    alias: "ubuntu 01",
    ip: "",
  }
  View = View;
  editWork: IHostWorker
  worker: IHostWorker
  hostSatusFilters: { text: string, value: 'stop' | 'start' }[] = [
    { text: '离线', value: 'stop' },
    { text: '在线', value: 'start' }
  ]

  selectedSiteMaStatus = "unassigned"
  allChecked = false;
  indeterminate = false;
  displayData = [];
  data: ILink[] = []
  siteDis: ILink = {
    priority: 1
  }
  mouseAction(name: string, event: NzFormatEmitEvent): void {
    console.log(name, event);
  }

  async hostList(status: string[] = []) {

    let result = await this.crawl.workerList(status)
    this.workers = result


  }
  cancel() {
    this.state = View.ListWorkers
  }
  constructor(public crawl: CrawlService) { }

  ngOnInit() {
    this.listTopShops();
    this.hostList()
  }
  // 添加主机
  async createWorker() {
    await this.crawl.workerCreate(this.newWorker);
    this.addWorkerModalVisible = false
    await this.hostList();

  }
  // 删除主机
  async deleteHost(worker) {
    await this.crawl.workerDelete(worker.workerId)
    this.hostList()

  }
  //  更新主机
  async editHost(worker) {
    this.editWorkModalVisible = true
    this.editWork = worker

  }
  async okEditHost() {

    await this.crawl.workerUpdate(this.editWork)
    this.editWorkModalVisible = false
    this.hostList()

  }
  //siteMa列表
  async listTopShops() {

    this.data = await this.crawl.listShopXmls(this.selectedSiteMaStatus);



  }

  //分配主机
  async distribOk() {
    this.siteMapChecked()
  }

  // 获取勾选
  async siteMapChecked() {
    let dataChecked = this.data.filter(data => data.checked)
    await this.hostList()
    console.log(this.workers)
  }

  // 筛选不同状态的列表
  //未分配

  // currentPageDataChange($event: Array<{ name: string; age: number; address: string; checked: boolean; disabled: boolean; }>): void {
  //   this.displayData = $event;
  //   this.refreshStatus();
  // }


  refreshStatus(): void {
    const allChecked = this.data.filter(value => !value.disabled).every(value => value.checked === true);
    const allUnChecked = this.data.filter(value => !value.disabled).every(value => !value.checked);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);


  }

  checkAll(value: boolean): void {
    this.data.forEach(data => {
      if (!data.disabled) {
        data.checked = value;
      }
    });
    this.refreshStatus();
    console.log(this.refreshStatus())
  }
  // async addQueue() {
  //   let items = this.data.filter(item => item.checked);
  //   for (let item of items) {
  //     let result = await this.crawl.getShopsByXml(item.loc);
  //     let urls = result.urlset.url.map(sitemap => sitemap.loc[0]);
  //     // let filterUrls=urls.filter(url=>urls.filter(item=>item==url).length>< ));
  //     let filterurls = _.uniq(urls);

  //     await this.crawl.http.createMessage('success', `解析商户地图xml 获得 ${urls.length}条商户地址,去重后${filterurls.length}`);
  //     let res = await this.crawl.addQueue(filterurls);
  //     this.crawl.http.createMessage('success', `添加新链接到未分配的队列中 共${res.length}条`);
  //     item.status = true;
  //   }
  // }


} 
