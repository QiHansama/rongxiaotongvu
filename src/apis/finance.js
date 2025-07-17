
//查询所有信息
import {httpRequest} from "@/utils/http";

export function findAllFinance(param){
    return httpRequest({
        method:"get",
        url:"/finance/findAllFinance",
        params:param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id查询信息
export function findFinanceById(param){
    return httpRequest({
        method:"get",
        url:"/finance/findFinanceById?id="+param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id删除信息
export function deleteFinanceById(param){
    return httpRequest({
        method:"get",
        url:"/finance/deleteFinance?id="+param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//修改信息
export function updateFinance(params){
    return httpRequest({
        method:"post",
        url:"/finance/updateFinance",
        data:params,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}

//添加投资人和合伙人
export function addFinanceName(param) {
    return httpRequest({
        url: "/finance/addFinance",
        method: "post",
        data:param,
        headers: {
            "token": window.localStorage.getItem("token") // 携带登录令牌
        }
    });
}