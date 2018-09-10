import { Injectable } from '@angular/core';
import { MyHttpService } from './http.service';
import { StorageService } from './storage.service';
import { MenuType, RoleType } from '../../../constant';
import { ExcelService } from './excel.service';

// import { type } from 'os';


@Injectable()
export class CrawlService {
    private api = {
        listShopXmls: '/crawl/zbj/list-shop-xmls',
        getShopsByXML: '/crawl/zbj/shop-by-xml',
        addQueue: '/crawl/zbj/add-queue',
        listQueueItems: '/crawl/zbj/listQueueItems',
        fetchUnassignedLinks: '/crawl/common/list-unassigned-links',
        workerCreate: '/crawl/common/worker/create',
        workerUpdate: '/crawl/common/worker/update',
        workerDelete: '/crawl/common/worker/delete',
        workerList: '/crawl/common/worker/list'
    }
    fetchUnassignedLInks(status = 'unassigned', page = 0, pageSize = 100) {
        return this.http.Post(this.api.fetchUnassignedLinks, { status, page, pageSize });
    }
    workerCreate(worker: IHostWorker) {
        return this.http.Post(this.api.workerCreate, worker);
    }
    workerUpdate(worker: IHostWorker) {
        return this.http.Post(this.api.workerUpdate, worker);
    }
    workerList(status: string[]): Promise<IHostWorker[]> {
        return this.http.Get(this.api.workerList, { params: { status } });
    }
    workerDelete(workerId: number) {
        return this.http.Get(this.api.workerDelete, { params: { workerId } });
    }

    listShopXmls(status?: string): Promise<ILink[]> {
        return this.http.Get(this.api.listShopXmls, { params: { status } })
    }
    getShopsByXml(shopXMLUrl: string): Promise<{ urlset: { url: { loc: [string], lastmod: [string] }[] } }> {
        return this.http.Post(this.api.getShopsByXML, { shopXMLUrl });
    }
    addQueue(urls: string[]): Promise<ILink[]> {
        return this.http.Post(this.api.addQueue, { urls });
    }
    listQueue(page = 0, pageSize = 100, status: 'unassigned') {
        return this.http.Post(this.api.listQueueItems, { page, pageSize, status });
    }
    constructor(public http: MyHttpService) { }

}