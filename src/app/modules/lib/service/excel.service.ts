import { Injectable } from '@angular/core';
import { XlsxService, SimpleTableColumn } from '@delon/abc';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  /** 导出元数据分组 */
  exportMetaDataObjects(metaGroups: IMetaGroups[]) {
    let header = ['查询名称', '查询sql', '更新表名', '主键名称', '父主键名称']
    let content = [];
    let columns: SimpleTableColumn[] = [];
    columns.map(i => i.title);
    metaGroups.forEach(group => {
      content.push(['查询分类:' + group.groupName]);
      group.metaObjects.forEach(metaObject => {
        let line = [];
        content.push([metaObject.objectName, metaObject.querySql, metaObject.tableName, metaObject.parentKey])
      });
    });
    return this.xlsx.export({ sheets: [{ name: '元数据分组', data: [header, ...content] }], filename: '元数据.xls', opts: {}, })
  }
  constructor(public xlsx:XlsxService) { }
}
