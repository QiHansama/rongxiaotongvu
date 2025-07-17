// 融资人相关接口
/*import { httpRequest } from "@/util/http.js";*/

// 查询推荐融资人列表（原接口，保持不变）
import {httpRequest} from "@/utils/http";

export function selectRecommned() {
    return httpRequest({
        url: "/financier/recommend",
        method: "get",
        headers: {
            "token": window.localStorage.getItem("token") // 携带登录令牌
        }
    });
}

// 添加融资人（新接口，对应后端添加功能）
export function addFinancier(params) {
    return httpRequest({
        url: "/financier/add",
        method: "post",
        data: params, // POST请求用data传递参数
        headers: {
            "token": window.localStorage.getItem("token"),
            "Content-Type": "application/json"
        }
    });
}