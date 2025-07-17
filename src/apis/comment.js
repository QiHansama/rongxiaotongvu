
import {httpRequest} from "@/utils/http";
//评论
export function addComments(params){
    return httpRequest({
        url: "/com/addComments",
        method: "post",
        data: params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}
//查询当前评论currentPage:1,
//         PageSize: this.pageSize
export function findComments(params){
    console.log("params",params)
    return httpRequest({
        url: "/com/findComments" ,
        method: "get",
        params:params,
        headers:{
            "token":window.localStorage.getItem("token")
        }
    })
}