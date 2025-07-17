//提交订单
import {httpRequest} from "@/utils/http";

export function addDingdan(params){
    return httpRequest({
        url:"/dingdan/addDingdan",
        method: "post",
        data: params,
        headers:{
            "token":localStorage.getItem("token")
        }
    })
}