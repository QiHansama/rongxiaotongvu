/*import {httpRequest} from "@/util/http.js";*/
//添加信息
import {httpRequest} from "@/utils/http";

export function addressAdd(params){
    return httpRequest({
        method:"post",
        url:"/address/add",
        data:params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//修改信息
export function addressUpdate(params){
    return httpRequest({
        method:"post",
        url:"/address/update",
        data:params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//删除信息
export function addressDelete(params){
    return httpRequest({
        method:"get",
        url:"/address/delete?id="+params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//查询信息
export function addressAll(params){
    return httpRequest({
        method:"get",
        url:"/address/findAll?uid="+params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
export function  addressOne(){
    return httpRequest({
        method:"get",
        url:"/address/findOneAddress",
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}

export function addressAll1(){
    return httpRequest({
        method:"get",
        url:"/address/findAll1",
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}