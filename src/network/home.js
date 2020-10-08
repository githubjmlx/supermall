import {request} from './request'

export function getHomeData1(){
    return request({
        url:'/home/multidata'
    })
}

export function getHomeGoods(type,page){
    return request({
        url:'/home/data',
        params:{    
           type,
           page
        }
    })

}