import axios from 'axios'
// 最终方案
// 外层封装
export function request(config){ 
    //1.创建axios实例
    const instance = axios.create({
        baseURL:'http://152.136.185.210:8000/api/w6',
        timeout:5000
      })
    //2.axios的拦截器   全局拦截axios.interceptors
    //2.1 请求拦截的作用
    instance.interceptors.request.use(config => {
        return config
    },err => {
        console.log(err)
    })
    //2.2 响应拦截
    instance.interceptors.response.use(res => {
        return res.data
    },err => {
        console.log(err)
    })

    //3.发送真正的网络请求 instance本身包含Promise 并且自动relove与reject
    return instance(config)
}
