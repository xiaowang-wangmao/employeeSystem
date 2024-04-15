import axios from "axios";
import { store } from "@/store/index";
class Axios {
    //定义一个空数组，用来缓存请求
    isRefreshToken : Boolean = false
    cacheRequestArr: Function[] = []
    baseUrl: String
    timeout: Number
    constructor() {
        this.baseUrl = 'http://localhost:8088';
        this.timeout = 30000;
    }
    setInterceptors = (instance : any, url: any) => {
        instance.interceptors.request.use((config: any) => {
            console.log(url)
            config.headers.Authorization =  `Bearer ${store.getters.getToken}`;
            let flag = this.refreshToken(instance, config)
            return flag ? flag : config;
        }, (err: any) => Promise.reject(err));

        instance.interceptors.response.use((response: any) => {
            
            return response;
        }, (err: any) => {
            if (err.response) { // 响应错误码处理
                switch (err.response.status) {
                    case '401':
                        break;
                    // todo: handler other status code
                    default:
                        break;
                }
                return Promise.reject(err.response);
            }
            return Promise.reject(err);
        });
    }

    cacheRequestArrHandle(cb: Function) {
        this.cacheRequestArr.push(cb);
    }
    // 数组中的请求得到新的token之后自执行，用新的token去重新发起请求
    afreshRequest(token: any) {
        this.cacheRequestArr.map(cb => cb(token));
        this.cacheRequestArr = [];
    }
    isTokenExpired() {
        //判断token是否过期
        return true
    }
    refreshToken(instance: any, config: any) {
        // 判断token是否即将过期，且不是请求刷新token的接口
        if(this.isTokenExpired() && config.url !== '/refreshToken'){
            // 所有的请求来了，先判断是否正在刷新token，
            // 如果不是，将刷新token标志置为true并请求刷新token.
            // 如果是，则先将请求缓存到数组中
            // 等到刷新完token后再次重新请求之前缓存的请求接口即可
            if (!this.isRefreshToken) {
                this.isRefreshToken = true;
                instance.get('/refreshToken').then((res: { data: { status: number; data: any; }; }) => {
                    if(res.data.status === 0){
                        config.headers.token = res.data.data;
                        // 刷新token完成后重新请求之前的请求
                        this.afreshRequest(res.data.data);
                    }
                }).finally(() => {
                    this.isRefreshToken = false;
                })
                let retry = new Promise((resolve) => {
                    this.cacheRequestArrHandle((token: any) => {
                        config.headers.token = token; // token为刷新完成后传入的token
                        // 将请求挂起
                        resolve(config)
                    })
                })
                return retry;
            }
            else{
                let retry = new Promise((resolve) => {
                    this.cacheRequestArrHandle((token:any) => {
                        config.headers.token = token; // token为刷新完成后传入的token
                        // 将请求挂起
                        resolve(config)
                    })
                })
                return retry;
            }
        }
        else{
            return config
        }
    }
    request(options: any) {
        // 每次请求都会创建新的axios实例。
        const instance = axios.create();
        const config = { // 将用户传过来的参数与公共配置合并。
            ...options,
            baseURL: this.baseUrl,
            timeout: this.timeout,
        };
        // 配置拦截器，支持根据不同url配置不同的拦截器。
        this.setInterceptors(instance, options.url);
        return instance(config); // 返回axios实例的执行结果
    }

}

export default new Axios();