/*import { httpRequest } from "@/util/http.js";*/

// 提交预约（与后端Controller接口地址对应）
import {httpRequest} from "@/utils/http";

export const submitAppointment = (data) => {
    return httpRequest({
        url: '/appointment/submit', // 对应后端@PostMapping("/appointment/submit")
        method: 'post',
        data:data,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    });
};


//查询所有信息
export function findAllAppointment(param){
    return httpRequest({
        method:"get",
        url:"/appointment/find",
        params:param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id查询信息
export function findAppointmentById(param){
    return httpRequest({
        method:"get",
        url:"/appointment/findById?id="+param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id删除信息
export function deleteAppointmentById(param){
    return httpRequest({
        method:"get",
        url:"/appointment/deleteById?id="+param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//修改信息
export function updateAppointment(params){
    return httpRequest({
        method:"post",
        url:"/appointment/updateById",
        data:params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}