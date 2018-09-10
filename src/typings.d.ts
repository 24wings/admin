/// <reference path="./typings/editormd.d.ts" />
/// <reference types="nunjucks" />


interface Environment {
  options: {
    autoescape: boolean; 
  };

  constructor(loader?: ILoader | ILoader[] | null, opts?: any);
  render(name: string, context?: object): string;
  render(name: string, context?: object, callback?: (err: any, res: string) => any): void;

  renderString(name: string, context: object): string;
  renderString(name: string, context: object, callback?: (err: any, res: string) => any): void;

  addFilter(name: string, func: (...args: any[]) => any, async?: boolean): void;
  getFilter(name: string): void;

  addExtension(name: string, ext: Extension): void;
  removeExtension(name: string): void;
  getExtension(name: string): Extension;
  hasExtension(name: string): void;

  addGlobal(name: string, value: any): void;

  // getTemplate(name: string, eagerCompile?: boolean): Template;
  // getTemplate(name: string, eagerCompile?: boolean, callback?: (err: any, templ: Template) => Template): void;

  express(app: object): void;
}

interface Extension {
  tags: string[];
  // Parser API is undocumented it is suggested to check the source: https://github.com/mozilla/nunjucks/blob/master/src/parser.js
  parse(parser: any, nodes: any, lexer: any): any;
}

// installJinjaCompat(): void;

interface ILoader {
  async?: boolean;
  getSource(name: string): LoaderSource;
  extend?(extender: ILoader): ILoader;
}

// Needs both Loader and ILoader since nunjucks uses a custom object system
// Object system is also responsible for the extend methods
interface Loader {
  on(name: string, func: (...args: any[]) => any): void;
  emit(name: string, ...args: any[]): void;
  resolve(from: string, to: string): string;
  isRelative(filename: string): boolean;
  extend(toExtend: ILoader): ILoader;
}

interface LoaderSource {
  src: string;
  path: string;
  noCache: boolean;
}

interface FileSystemLoaderOptions {
  /** if true, the system will automatically update templates when they are changed on the filesystem */
  watch?: boolean;

  /**  if true, the system will avoid using a cache and templates will be recompiled every single time */
  noCache?: boolean;
}

//  class FileSystemLoader extends Loader implements ILoader {
//   init(searchPaths: string[], opts: any): void;
//   getSource(name: string): LoaderSource;
//   constructor(searchPaths?: string | string[], opts?: FileSystemLoaderOptions);
// }

// export class WebLoader implements ILoader {
//   constructor(baseUrl: string, opts?: any);
//   getSource(name: string): LoaderSource;
// }

// export class PrecompiledLoader extends Loader implements ILoader {
//   init(searchPaths: string[], opts: any): void;
//   getSource(name: string): LoaderSource;
// }

interface Nunjucks {
  renderString(src: string, context: object): string;
  renderString(src: string, context: object, callback?: (err: any, res: string) => any): void;
  Environment: new () => Environment;
}



declare var nunjucks: Nunjucks;
/* SystemJS module definition */
// import 'jquery';
// declare var $: JQueryStatic;

declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare var wx: any;
declare var WeixinJSBridge: any;
interface IRegion {

}

interface ICity {

}

interface IArea {

}

interface DbTable {
  dbId?: number;
  tableId?: number;
  name: string;
  comment: string;
  cols: DbCol[];
  fieldSize?: number;
}

interface DbCol {
  key: string;
  length: number;
  defaultValue?: string;
  comment?: string;
  /**
   * 附加二级数据类型
   * 图片链接
   * Image,Image[],
   * 
   * 其他Id对象
   * Id,Ids
   * 
   */
  addtionType?: any;
  type: string;
  PK?: boolean,
  NN?: boolean,
  AI?: boolean
}