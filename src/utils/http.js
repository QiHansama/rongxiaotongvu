import axios from 'axios'

export function httpRequest(config) {
    // 创建axios的实例
    const instance = axios.create({
       baseURL: "http://localhost:9003",//消费者端口
        timeout: 100000 //设置超时时间
    })
    // axios.interceptors  全局拦截
    //请求拦截
    // instance.interceptors.request.use(请求前函数，请求后函数)
    instance.interceptors.request.use(config => { //拦截请求
        return config //若拦截到需要原封不动的返回
    }, err => {
        return Promise.reject(err)
    })
    //响应拦截
    instance.interceptors.response.use(res => {
        return res.data
    }, err => {
        console.log(err);
        return Promise.reject(err)
    })
    // 3.发送真正的网络请求
    return instance(config)

}


