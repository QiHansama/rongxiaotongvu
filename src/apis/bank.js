// src/api/bank.js
/*import {httpRequest} from "@/util/http"; */ // 封装的axios实例

// 获取所有银行列表
import {httpRequest} from "@/utils/http";

export function getBankList() {
    return httpRequest({
        url: '/bank/list',  // 后端接口地址
        method: 'get',
        headers:{
            "token":window.localStorage.getItem("token")
        }
    });
}

// 根据ID获取银行详情
export function getBankById(id) {
    return httpRequest({
        url: `/bank/detail/${id}`,  // 后端接口地址
        method: 'get',
        headers:{
            "token":window.localStorage.getItem("token")
        }
    });
}