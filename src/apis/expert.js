/*
import { httpRequest } from "@/util/http.js";
*/


// 正确接口：调用后端处理搜索的 /expert/selectBy 接口
// export function searchExperts(keys) {
//     return httpRequest({
//         url: '/expert/selectBy', // 对应后端 @GetMapping("/expert/selectBy")
//         method: 'get',
//         params: { keys: keys }, // 参数名keys，与后端@RequestParam("keys")完全匹配
//         headers:{
//             "token":window.localStorage.getItem("token")
//         }
//     });
// }

// @/apis/expert.js 中修改 getAllExperts 接口
import {httpRequest} from "@/utils/http";

export const getAllExperts = (params) => { // 接收整个参数对象
    return httpRequest({
        url: '/expert/all',
        method: 'get',
        params: {
            // 传递所有参数（关键词 + 分页参数）
            keyword: (params.keyword && params.keyword.trim()) || '',
            currentPage: params.currentPage, // 分页参数：当前页
            pageSize: params.pageSize        // 分页参数：每页条数
        },
        headers: {
            "token": window.localStorage.getItem("token")
        }
    });
};