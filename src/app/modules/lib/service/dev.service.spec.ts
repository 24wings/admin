import { TestBed, inject, async } from '@angular/core/testing';

import { DevService } from './dev.service';
import { MyHttpService } from './http.service';
import { Http, ConnectionBackend, HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { XlsxService, AdXlsxModule } from '@delon/abc';
import { StorageService } from './storage.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppConfig } from '../../../app.config';
import { HttpClientModule } from '@angular/common/http';
import { DelonUtilModule } from '@delon/util';
import { MenuType } from '../../../constant';
import { EmpService } from './employee.service';
import { subMilliseconds } from 'date-fns';

describe('开发者Api批量测试', async () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule, BrowserModule,
        OverlayModule,
        NgZorroAntdModule.forRoot(),
        HttpClientModule],
      providers: [DevService, MyHttpService, StorageService, AppConfig, EmpService,]
    });
  });
  it(`开发者登录`, inject([DevService], async (dev: DevService) => {
    let newDev: IDevelop = { devUserName: "test", password: "123" };
    if (newDev) {
      let loginResult = await dev.devLogin(newDev.devUserName, newDev.password)
      expect(newDev).toBeFalsy(`登录`)
    }
    // 商品--新增 --更新--列表--删除
    let newCategory: ICategory = { cateName: "分类1", cateCode: "345" };
    newCategory = await dev.categoryCreate(newCategory)
    expect(newCategory).toBeFalsy(`商品分类创建异常 body:{cateName:"分类1",cateCode:"345"} accpet {data:{category}}`)
    if (newCategory) {

      newCategory.cateCode = new Date().toLocaleDateString();
      let updateCate = await dev.categoryUpdate(newCategory)
      expect(updateCate).toBeTruthy(`更新商品分类 cateId=${newCategory.cateId}异常,accept {data:'not null'}`);

      let result1 = await dev.categoryList()
      expect(result1).toBeFalsy(`商品列表 cate=${newCategory}异常 accpet {data:{category}}`)

      let result = await dev.deleteCate(newCategory.cateId);
      expect(result).toBeTruthy(`删除商品分类 cateId=${newCategory.cateId}异常 accept {data:'not null'}`);
    }

    // 收支科目--新增--修改--列表--删除
    let newSub: ISubject = { subName: "测试收支科目", subCode: '234' }
    newSub = await dev.subjectCreate(newSub)
    expect(newSub).toBeFalsy(`收支科目创建成功 body: { subName: "测试收支科目", subCode: 234 } accpet {data:{subject}}`)
    if (newSub) {
      newSub.subCode = new Date().toLocaleDateString()
      let updateSub = await this.dev.updateSub(newSub)
      expect(updateSub).toBeFalsy(`更新收支科目  subId=${newSub.subId}异常,accpet {data:{newSubs}}`)
      let result1 = await dev.subjectList()
      expect(result1).toBeFalsy(`收支科目列表 sub=${newSub}异常 accpet {data:{newSub}}`)
      let result = await dev.subjectDelete(newSub.subId)
      expect(result).toBeFalsy(`收支科目删除 subid=${newSub.subId}异常 accpet {data:{subId}}`)
    }

  }));


  it(`员工登录测试`, inject([DevService, EmpService, StorageService], async (service: DevService, emp: EmpService, storage: StorageService) => {
    let newEmp: IUser = { name: "laoyu", password: "123" };
    if (newEmp) {
      let loginResult = await emp.EmpLogin(newEmp.name, newEmp.password);

      storage.token = loginResult.token

      expect(newEmp).toBeFalsy(`登录`)
      // let deleteAction = await service.employeeDelete(newEmp.epId)
      // expect(deleteAction).toBeFalsy("删除不成功")
    }
    newEmp = { name: "yir", password: "123", roleIds: "1", marketId: 3, orgId: 1 }
    newEmp = await emp.employeeCreate(newEmp)
    expect(newEmp).toBeTruthy(`员工创建异常 body:{epUserName: "yi", password: "123" } accpet {data:{emp}}`)
    let deleteAction = await emp.employeeDelete(newEmp.id)

    expect(deleteAction).toBeFalsy("删除不成功")

  }))

  it('市场菜单查询', inject([DevService], async (service: DevService) => {
    let result = await service.devMenuList()
    expect(Array.isArray(result.menus)).toBeTruthy();
  }));
  it('开发者菜单查询', inject([DevService], async (service: DevService, done: DoneFn) => {
    let result = await service.marketMenuList();
    expect(Array.isArray(result.menus)).toBeTruthy();
  }));



  it('开发者菜单: 添加-更新-详情-删除-menuCode唯一性', inject([DevService], async (service: DevService, ) => {
    let newMenuId: number;
    let newDevMenu: IMenu;
    let newDevMenuCode = 'text-dev';
    /**添加 */
    newDevMenu = await service.addMenu({
      text: 'text-dev',
      parentId: 0,
      menuType: MenuType.Develop,
      menuCode: newDevMenuCode
    });
    expect(newDevMenu).toBeTruthy()
    expect(newDevMenu.menuId).toBeTruthy();

    /** 更新 */
    newDevMenu.text = new Date().toLocaleDateString();
    let updateDevMenu = await service.menuUpdate(newDevMenu);
    expect(updateDevMenu).toBeTruthy('更新异常');
    /** 详情  */
    let detail = await service.menuDetail(newDevMenu.menuId);
    expect(detail).toBeTruthy(`开发者菜单详情异常,accept response {data:{menu:IMenu}}`);

    /** menuCode唯一性,此时应当报错,为空值 */
    let repeatMenuCode = await service.addMenu({ text: 'texxt-dev2', menuCode: 'text-dev', menuType: MenuType.Develop })
    console.log(repeatMenuCode)
    expect(!repeatMenuCode).toBeTruthy('menuCode没有唯一性');
    if (repeatMenuCode) {
      let result = await service.menuDelete(repeatMenuCode.menuId);
    }
    /**删除 */
    let result = await service.menuDelete(newDevMenu.menuId);
    expect(result).toBeTruthy('删除异常');

  }))
  it('市场菜单: 添加-更新-详情-删除', inject([DevService], async (service: DevService) => {
    let newMarketMenu: IMenu;
    /** 添加 */
    newMarketMenu = await service.addMenu({ text: 'text-market', parentId: 0, menuType: MenuType.Market, menuCode: 'text-market' });
    expect(newMarketMenu.menuId).toBeTruthy('创建市场异常');
    if (newMarketMenu) {
      /** 更新*/
      newMarketMenu.menuCode = new Date().toLocaleDateString();
      let updateMarketMenu = await service.menuUpdate(newMarketMenu);
      expect(updateMarketMenu).toBeTruthy(`更新市场菜单 menuId=${newMarketMenu.menuId}异常,accept {data:'not null'}`);
      /**  详情*/
      let detail = await service.menuDetail(newMarketMenu.menuId);
      expect(detail).toBeTruthy(`市场菜单详情 menuId=${newMarketMenu.menuId}错误 accept  {data:{menu:IMenu}}`);
      /** 删除 */
      let result = await service.menuDelete(newMarketMenu.menuId);
      expect(result).toBeTruthy(`删除市场菜单 menuId=${newMarketMenu.menuId}异常 accept {data:'not null'}`);
    }
  }))
  it('开发者: 列表-登陆-添加-用户名唯一性-更新-删除', inject([DevService], async (service: DevService) => {
    let newDev: IDevelop;
    let testDev = { devUserName: '555', password: '555' };
    // 列表
    let devList = await service.devPage();
    expect(Array.isArray(devList.rows)).toBeTruthy('开发者 分页异常  accept {data:{developers:{rows:IDeveloper[],count:number}}}');

    // 删除已经存在的555
    let exist = await service.devLogin(testDev.devUserName, testDev.password);
    if (exist) {
      await service.devDelete(exist.dev.devId);
    }

    //  创建
    newDev = await service.devCreate(testDev);
    expect(newDev).toBeTruthy(`创建新开发者异常  body:{devUserName:'555',password:'555'}  accpet {data:{dev}}`);
    if (newDev) {
      // 登陆
      let loginResult = await service.devLogin(newDev.devUserName, newDev.password);
      expect(newDev).toBeTruthy(`登陆`)
      // 更新
      let update = await service.devUpdate({ devId: newDev.devId, password: '666' });
      loginResult = await service.devLogin(newDev.devUserName, '666');
      expect(loginResult).toBeTruthy(`更新异常 body:IDevelop   accept:{data:'not null'} `);
      // 开发者用户名一致性
      let res = await service.devCreate(testDev);
      expect(!res).toBeTruthy('未实现开发者用户名一致性');
      if (res) {
        await service.devDelete(res.devId)
      }
      // 删除
      let deleteAction = await service.devDelete(newDev.devId);
      expect(deleteAction).toBeTruthy('删除异常');
    }
  }));


  it('元数据: 元数据列表-sql查询-元数据详情-更新元数据-元数据objectCode唯一性-删除元数据', inject([DevService], async (service: DevService) => {
    /**
     * sql 查询
     * 1.   select * from market
     * 2.  select * from market left join employee on employee.epId=market.mktId
     */
    let sql1 = `select * from market`;

    let newMetaObject: IMetaObject = {
      tableName: 'market', querySql: sql1,
      groupName: 'mock_test', objectCode: 'test',
      objectName: 'test',
      isCelledit: true,
      isShowNum: true,
      defaultOrder: 'order',
      config: {},
      pkKey: 'mktId'
    };
    /* 元数据列表**/
    let metaObjects = await service.metaObjectList();
    expect(Array.isArray(metaObjects)).toBeTruthy('MetaObject数据列表错误  accept {data:{metaObjects:IMetaObject[]}}')

    /**sql查询 */
    let result = await service.sqlDetail(sql1);
    expect(Array.isArray(result.fields)).toBeTruthy(`sql=> ${sql1} 查询错误  accept {data:{fields:{field:string,type:string
    }[]}}`);
    let fields = result.fields.map((field, i) => {
      return {
        fieldName: field.field,
        objectCode: newMetaObject.objectCode,
        fieldType: field.type, recno: i,
        isQuery: false,
        isUpdate: false,
        isShow: false,
        config: {}
      } as IMetadataField
    })
    /** 元数据详情 */
    let createdMetaObject = await service.metaObjectCreate(newMetaObject, fields);
    expect(createdMetaObject).toBeTruthy('创建的元数据对象错误 body:IMetaObject=>{fields:IMetaFields[]}')
    expect(createdMetaObject.metaObject).toBeTruthy('创建返回的元数据对象错误 {data:{metaObject:IMetaObject}}')

    if (createdMetaObject) {
      /** 详情 */
      let metaDetail = await service.metaObjectDetail(createdMetaObject.metaObject.objectCode as any);
      expect(metaDetail).toBeTruthy('元数据详情错误 accept {data:{metaObject:IMetaObject}}');
      expect(metaDetail.metaObject && metaDetail.fields).toBeTruthy('元数据详情返回数据格式错误 accept {data:{metaObject:IMetaObject}}');
      /** 元数据objectCode唯一性 */
      let repeatMetaObject = await service.metaObjectCreate(newMetaObject, fields);
      expect(!repeatMetaObject).toBeTruthy('元数据objectCode失去唯一性');
      if (repeatMetaObject) {
        await service.metaObjectDelete(repeatMetaObject.metaObject.objectCode);
      }

      /** 更新元数据 */
      let update = await service.metaObjectUpdate(metaDetail.metaObject, fields);
      expect(update).toBeTruthy('元数据更新异常 body:IMetaObject');
      /** 删除元数据 */
      let del = await service.metaObjectDelete(createdMetaObject.metaObject.objectCode as any);
      expect(del).toBeTruthy(`删除元数据 objectCode:${createdMetaObject.metaObject.objectCode} 错误`)
    }

  }));

  it(`模板查询: 添加动态页面元数据菜单-菜单编码获取菜单配置-SingleConfig查询`, inject([DevService], async (service: DevService) => {
    let menuPage: IMenu = {
      text: 'test_dynamic_page1',
      link: '/admin/dev/dynamic/test_dynamic_page1',
      menuCode: 'test_dynamic_page1',
      config: { viewType: 'single', singleConfig: { objectCode: 'test_dynamic_page1', } } as ViewConfig
    };

    /** 添加动态页面元数据菜单 */
    let createdMenuPage = await service.addMenu(menuPage);
    expect(createdMenuPage).toBeTruthy('添加动态页面元数据菜单失败 失去唯一性');
    if (createdMenuPage) {
      /** 菜单编码获取菜单配置 */
      let menuDetail = await service.menuDetailByMenuCode(createdMenuPage.menuCode);
      expect(menuDetail).toBeTruthy(`菜单编码详情错误 menuCode=${createdMenuPage.menuCode}`);

      /** 菜单编码配置 singleConfig*/
      let singleDetail = await service.metaObjectDetail((menuDetail.config as ViewConfig).singleConfig.objectCode);
      expect(singleDetail).toBeTruthy('singleConfig详情错误');
      if (singleDetail) {
        await service.metaObjectDataPage(singleDetail.metaObject.objectCode, [], 0, 10, '', 'asc');
      }
      await service.menuDelete(menuDetail.menuId);
    }

  }))



});
