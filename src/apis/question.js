/*import {httpRequest} from "@/util/http";*/
//查询所有信息
import {httpRequest} from "@/utils/http";

export function findAllQuestion(param){
    return httpRequest({
        method:"get",
        url:"/question/find",
        params:param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id查询信息
export function findQuestionById(param){
    return httpRequest({
        method:"get",
        url:"/question/findById?id="+param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}
//根据id删除信息
export function deleteById(param){
    return httpRequest({
        method:"get",
        url:"/question/deleteById?id="+param,
        headers: {
            "token": window.localStorage.getItem("token")
        }
    })
}