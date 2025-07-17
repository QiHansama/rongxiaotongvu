
//查询所有信息
import {httpRequest} from "@/utils/http";

//查询购买的信息
export function findPurchaseBuy(param){
    return httpRequest({
        method:"get",
        url:"/purchase/findPurchaseBuy",
        params:param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//查询买出的信息
export function findPurchaseSell(param){
    return httpRequest({
        method:"get",
        url:"/purchase/findPurchaseSell",
        params:param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}