//引入拦截器
import {request} from "@/utils/request";
export function userLogin(params){
    return request({
        method:"post",
        data:params,
        url:"/user/Login"
    });
}
//更改个人信息
export function updateUserInfo(params){
    return request({
        method:"post",
        data:params,
        url:"/user/updateUserInfo",
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id查询用户信息
export function findByIdInfo(param){
    return request({
        method:"get",
        url:"/user/findById?id="+param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//更改密码
export  function updatePassword(param){
    return request({
        method:"post",
        url:"/user/updatePassword",
        data:param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}