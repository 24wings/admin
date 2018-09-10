import { Injectable } from '@angular/core';
/**
 * 默认的App配置 
 */
@Injectable()
export class AppConfig {
    /**
     * 线上测试 将debug改为false，作为错误提示
     */
    debug: boolean = true;
    ip: string = 'http://localhost:9090' //本地ip
    // ip: string = 'http://114.116.17.90:9090' //线上ip
    // ip: string = 'http://192.168.3.107:9090'
    // ip: string = 'http://caf42631.ngrok.io'
    // ip: string = 'http://localhost:9090'
}


export class LocalAppConfig extends AppConfig {
    debug: boolean = true;
    ip: string = 'http://localhost'
}
/**
 * 线上环境配置
 */
export class ProdAppconfig extends AppConfig {
    ip: string = 'http://dev.fastsun.com.cn:9090'
}