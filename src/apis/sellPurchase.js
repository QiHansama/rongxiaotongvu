
//查询所有信息
import {httpRequest} from "@/utils/http";

export function findAllSellPurchase(param){
    return httpRequest({
        method:"get",
        url:"/sellPurchase/findAllSellPurchase",
        params:param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
